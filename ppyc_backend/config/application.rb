require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module PpycBackend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    # Add session middleware for authentication
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: '_ppyc_session'

    # Add CSRF protection for session-based authentication
    config.middleware.use ActionDispatch::ContentSecurityPolicy::Middleware

    # Explicitly add CORS middleware
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '/api/v1/slides',
          headers: :any,
          methods: [:get],
          credentials: false

        resource '/api/v1/news',
          headers: :any,
          methods: [:get],
          credentials: false

        resource '/api/v1/news/*',
          headers: :any,
          methods: [:get],
          credentials: false

        resource '/api/v1/events',
          headers: :any,
          methods: [:get],
          credentials: false

        resource '/api/v1/events/*',
          headers: :any,
          methods: [:get],
          credentials: false

        resource '/api/v1/pages/*',
          headers: :any,
          methods: [:get],
          credentials: false

        resource '/api/v1/weather/*',
          headers: :any,
          methods: [:get],
          credentials: false
      end

      allow do
        origins 'http://localhost:5173', 'http://localhost:3000', 'http://srv894370.hstgr.cloud'
        resource '/api/v1/admin/*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          credentials: true

        resource '/api/v1/auth/*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          credentials: true
      end
    end
  end
end
