Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      # Replace 'http://localhost:3000' with your frontend's URL if it's hosted elsewhere
      origins 'http://localhost:3000'  # Allow requests from this origin
  
      resource '*', # Allows access to all resources
        headers: :any,   # Allow all headers
        methods: [:get, :post, :put, :patch, :delete, :options, :head], # Allowed methods
        expose: ['X-CSRF-Token']  # Expose CSRF token to JavaScript
    end
  end
  