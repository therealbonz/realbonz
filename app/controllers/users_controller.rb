class UsersController < ApplicationController
    before_action :authenticate_user!, only: [:update_profile] # Ensure this is properly applied
    include DeviseTokenAuth::Concerns::SetUserByToken
    skip_before_action :authenticate_user!, only: [:login, :create]  # ✅ Allow login and create actions
    skip_before_action :verify_authenticity_token, only: [:login, :create] # ✅ Required for API requests
  
    # Custom registration action
    def create
      # Ensure the parameters are properly permitted
      registration_params = params.require(:registration).permit(:name, :email, :password, :password_confirmation)
  
      # Build the user resource with the registration parameters
      @user = User.new(registration_params)
  
      # Handle custom logic or validation before user creation (if needed)
      if @user.save
        # Optionally, create auth token after successful registration
        token = @user.create_new_auth_token
  
        # Send response with user and token
        render json: { user: @user, token: token }, status: :created
      else
        # Return errors if user creation fails
        render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    # Login action
    def login
      user = User.find_by(email: params[:email])
  
      if user&.valid_password?(params[:password])
        token = user.create_new_auth_token
        render json: { user: user, token: token }, status: :ok
      else
        render json: { errors: ["Invalid email or password"] }, status: :unauthorized
      end
    end
  
    def logout
        # This is just an example, the actual implementation depends on your token-based authentication
        current_user&.logout
        render json: { message: "Logged out successfully" }, status: :ok
      end

      def update
        @user = current_user # Assuming you are using Devise
    
        if @user.update(user_params)
          render json: @user, status: :ok
        else
          render json: { error: @user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # Profile update action
    def update_profile
        @user = current_user  # Ensure this is not nil
    
        if @user.nil?
          render json: { error: "User not found or not authenticated" }, status: :unauthorized
          return
        end
    
        if @user.update(user_params)
          render json: @user, status: :ok
        else
          render json: { error: "Failed to update user", details: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
  
    # Current user action
    def show_current_user
        render json: current_user
      end
  
    private
  
    def user_params
      # Permits user parameters for update_profile action
      params.require(:user).permit(:username, :email, :password, :profile_picture)
    end
  end
  