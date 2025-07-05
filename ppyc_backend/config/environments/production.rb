require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false

  # Ensures that a master key has been made available in either ENV["RAILS_MASTER_KEY"]
  # or in config/master.key. This key is used to decrypt credentials (and other encrypted files).
  # config.require_master_key = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present? || ENV["RENDER"].present?

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = "http://assets.example.com"

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for Apache
  # config.action_dispatch.x_sendfile_header = "X-Accel-Redirect" # for NGINX

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.variant_processor = :mini_magick

  # Mount Action Cable outside main process or domain.
  # config.action_cable.mount_path = nil
  # config.action_cable.url = "wss://example.com/cable"
  # config.action_cable.allowed_request_origins = [ "http://example.com", /http:\/\/example.*/ ]

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  # Can be used together with config.force_ssl for Strict-Transport-Security and secure cookies.
  config.assume_ssl = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Log to STDOUT by default
  config.logger = ActiveSupport::Logger.new(STDOUT)
    .tap  { |logger| logger.formatter = ::Logger::Formatter.new }
    .then { |logger| ActiveSupport::TaggedLogging.new(logger) }

  # Prepend all log lines with the following tags.
  config.log_tags = [ :request_id ]

  # Info include generic and useful information about system operation, but avoids logging too much
  # information to avoid inadvertent exposure of personally identifiable information (PII). If you
  # want to log everything, set the level to "debug".
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Use a different cache store in production.
  # Using solid_cache (database-backed) instead of Redis for simpler deployment
  config.cache_store = :solid_cache_store

  # Use a real queuing backend for Active Job (and separate queues per environment).
  # Using solid_queue (database-backed) instead of sidekiq for simpler deployment
  config.active_job.queue_adapter = :solid_queue
  config.active_job.queue_name_prefix = "ppyc_backend_production"

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Enable DNS rebinding protection and other `Host` header attacks.
  # config.hosts = [
  #   "example.com",     # Allow requests from example.com
  #   /.*\.example\.com/ # Allow requests from subdomains like `www.example.com`
  # ]
  # Skip DNS rebinding protection for the default health check endpoint.
  # config.host_authorization = { exclude: ->(request) { request.path == "/up" } }

  # Security Configuration
  # ======================

  # Content Security Policy
  config.content_security_policy do |policy|
    policy.default_src :self, :https
    policy.font_src    :self, :https, :data, 'https://cdnjs.cloudflare.com'
    policy.img_src     :self, :https, :data, 'https://res.cloudinary.com'
    policy.object_src  :none
    policy.script_src  :self, :https, 'https://kit.fontawesome.com', 'https://cdnjs.cloudflare.com', "'unsafe-eval'"
    policy.style_src   :self, :https, 'https://cdnjs.cloudflare.com', "'unsafe-inline'"
    policy.connect_src :self, :https, 'https://api.cloudinary.com'

    # Specify URI for violation reports
    # policy.report_uri "/csp-violation-report-endpoint"
  end

  # Enable CSP nonce generation
  config.content_security_policy_nonce_generator = -> request { SecureRandom.base64(16) }

  # Enable CSP nonce directives
  config.content_security_policy_nonce_directives = %w(script-src style-src)

  # Report CSP violations to a specified URI
  # config.content_security_policy_report_only = true

  # Security Headers
  config.force_ssl = true
  config.ssl_options = {
    hsts: {
      expires: 1.year,
      subdomains: true,
      preload: true
    }
  }

  # Performance Configuration
  # =========================

  # Enable caching
  config.action_controller.perform_caching = true

  # Cache API responses - using Redis cache store instead of Rack::Cache
  # config.middleware.use Rack::Cache,
  #   verbose: false,
  #   metastore: ENV.fetch("REDIS_URL", "redis://localhost:6379/2"),
  #   entitystore: ENV.fetch("REDIS_URL", "redis://localhost:6379/2")

  # Enable gzip compression
  config.middleware.use Rack::Deflater

  # Session Configuration
  # ====================

  # Use secure session cookies
  config.session_store :cookie_store,
    key: '_ppyc_session',
    domain: ENV.fetch("DOMAIN", "ppyc.com"),
    secure: true,
    httponly: true,
    same_site: :lax,
    expire_after: 30.days

  # CORS Configuration for Production
  # =================================

  # Set allowed origins from environment
  allowed_origins = ENV.fetch("CORS_ORIGINS", "https://ppyc.com").split(',')
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins allowed_origins
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: true,
        max_age: 86400
    end
  end

  # Rate Limiting
  # =============

  # Add rate limiting middleware (requires rack-attack gem)
  # config.middleware.use Rack::Attack

  # Database Configuration
  # ======================

  # Query optimization
  config.active_record.strict_loading_by_default = true

  # Active Storage Configuration
  # ============================

  # Use Cloudinary for file storage in production
  config.active_storage.service = :cloudinary
  config.active_storage.variant_processor = :mini_magick
  config.active_storage.analyzers = [
    ActiveStorage::Analyzer::ImageAnalyzer::Vips,
    ActiveStorage::Analyzer::ImageAnalyzer::ImageMagick,
    ActiveStorage::Analyzer::VideoAnalyzer,
    ActiveStorage::Analyzer::AudioAnalyzer
  ]

  # Health Check Configuration
  # ==========================

  # Rails 8 provides a built-in health check endpoint at /up
  # No custom middleware needed

  # Monitoring and Observability
  # ============================

  # Enable detailed query logging in production for monitoring
  # (Should be disabled in high-traffic environments)
  # config.active_record.logger = nil if ENV['DISABLE_DB_LOGGING'] == 'true'

  # Custom error handling
  config.exceptions_app = ->(env) {
    status = env['PATH_INFO'] == '/404' ? 404 : 500
    [status, {'Content-Type' => 'application/json'},
     [{ error: 'Application Error', status: status }.to_json]]
  }
end
