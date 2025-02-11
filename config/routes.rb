Rails.application.routes.draw do
  # Devise Token Auth routes for user authentication
  mount_devise_token_auth_for 'User', at: 'auth'
  get 'hello_world', to: 'hello_world#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  resources :media, only: [:create, :index, :destroy]
    #root 'media#index'
  root 'home#index' # This serves React
  resources :users, only: [:create, :show, :update]  # Example route
  post '/register', to: 'users#create'  # Custom registration endpoint
  post "login", to: "users#login"  # Custom login route
  delete '/logout', to: 'users#logout'

  # Define a route to fetch the current user
get '/current_user', to: 'users#show_current_user'
  devise_scope :user do
    put 'users/update_profile', to: 'users#update'  end

end
