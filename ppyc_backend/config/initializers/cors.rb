# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

# CORS configuration moved to config/application.rb for better compatibility with API-only mode
# Rails.application.config.middleware.insert_before 0, Rack::Cors do
#   # Allow public endpoints without credentials
#   allow do
#     origins '*'
#     resource '/api/v1/slides',
#       headers: :any,
#       methods: [:get],
#       credentials: false

#     resource '/api/v1/news',
#       headers: :any,
#       methods: [:get],
#       credentials: false

#     resource '/api/v1/news/*',
#       headers: :any,
#       methods: [:get],
#       credentials: false

#     resource '/api/v1/events',
#       headers: :any,
#       methods: [:get],
#       credentials: false

#     resource '/api/v1/events/*',
#       headers: :any,
#       methods: [:get],
#       credentials: false

#     resource '/api/v1/pages/*',
#       headers: :any,
#       methods: [:get],
#       credentials: false

#     resource '/api/v1/weather/*',
#       headers: :any,
#       methods: [:get],
#       credentials: false
#   end

#   # Allow authenticated endpoints with credentials
#   allow do
#     origins 'http://localhost:5173', 'http://localhost:3000', 'http://srv894370.hstgr.cloud'
#     resource '/api/v1/admin/*',
#       headers: :any,
#       methods: [:get, :post, :put, :patch, :delete, :options, :head],
#       credentials: true

#     resource '/api/v1/auth/*',
#       headers: :any,
#       methods: [:get, :post, :put, :patch, :delete, :options, :head],
#       credentials: true
#   end
# end
