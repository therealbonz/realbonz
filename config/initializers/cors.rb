Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'http://localhost:3035'  # Change this if your frontend is hosted elsewhere
  
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        expose: [
          'access-token',
          'client',
          'uid',
          'expiry',
          'token-type',
          'X-CSRF-Token'
        ] # Expose authentication headers for React to use
    end
  end
  