class MediaController < ApplicationController
    before_action :verify_authenticity_token, except: [:index] # For API-style requests
  
    def create
      if params[:media].nil? || params[:media][:file].nil?
        render json: { errors: 'No files selected. Please choose a file.' }, status: :unprocessable_entity
        return
      end
  
      files = params[:media][:file]
      uploaded_media = []
  
      files.each do |file|
        # Validate file types (image/*, including bmp and gif)
        unless file.content_type.start_with?('image/', 'video/')
          render json: { errors: 'Invalid file type. Only image or video files are allowed.' }, status: :unprocessable_entity
          return
        end
  
        # Create a new Medium record for each file
        @media = Medium.new(file: file, title: file.original_filename)
  
        if @media.save
          uploaded_media << @media
        else
          render json: { errors: @media.errors.full_messages }, status: :unprocessable_entity
          return
        end
      end
  
      render json: uploaded_media, status: :created
    end
  
    def index
      @media = Medium.order(created_at: :desc)
  
      render json: @media.map { |media| 
        {
          id: media.id,
          title: media.title,
          file: media.file.attached? ? {
            url: url_for(media.file),
            content_type: media.file.blob.content_type
          } : nil
        }
      }, status: :ok
    end
  
    private
  
    def media_params
      params.require(:media).permit(:file, :title)
    end
  end
  