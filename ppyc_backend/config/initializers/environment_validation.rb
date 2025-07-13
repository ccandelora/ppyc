# Environment Variable Validation
# This initializer validates that all required environment variables are set
# and provides clear error messages if any are missing.

class EnvironmentValidator
  REQUIRED_VARS = {
    production: {
      'SECRET_KEY_BASE' => 'Rails secret key for session security',
      'PPYC_BACKEND_DATABASE_PASSWORD' => 'PostgreSQL password for database connection',
      'RAILS_ENV' => 'Rails environment (should be "production")'
    },
    development: {
      # Add development-specific required vars here if needed
    },
    test: {
      # Add test-specific required vars here if needed
    }
  }.freeze

  OPTIONAL_VARS = {
    'CLOUDINARY_CLOUD_NAME' => 'Cloudinary cloud name for image uploads',
    'CLOUDINARY_API_KEY' => 'Cloudinary API key',
    'CLOUDINARY_API_SECRET' => 'Cloudinary API secret',
    'RAILS_LOG_LEVEL' => 'Rails log level (debug, info, warn, error, fatal)',
    'RAILS_MAX_THREADS' => 'Maximum number of threads for Puma',
    'PORT' => 'Port for the application server',
    'PPYC_BACKEND_DATABASE_USERNAME' => 'PostgreSQL username (defaults to ppyc_user)',
    'PPYC_BACKEND_DATABASE_HOST' => 'PostgreSQL host (defaults to localhost)',
    'PPYC_BACKEND_DATABASE_PORT' => 'PostgreSQL port (defaults to 5432)'
  }.freeze

  def self.validate!
    return unless Rails.env.production? || ENV['VALIDATE_ENV_VARS'] == 'true'

    environment = Rails.env.to_sym
    required_vars = REQUIRED_VARS[environment] || {}

    missing_vars = []
    present_vars = []

    required_vars.each do |var, description|
      value = ENV[var]
      if value.nil? || value.strip.empty?
        missing_vars << { name: var, description: description }
      else
        present_vars << { name: var, description: description, value: mask_sensitive_value(var, value) }
      end
    end

    if missing_vars.any?
      puts "\n" + "=" * 80
      puts "❌ ENVIRONMENT CONFIGURATION ERROR"
      puts "=" * 80
      puts "The following required environment variables are missing:"
      puts

      missing_vars.each do |var|
        puts "  #{var[:name]}"
        puts "    Description: #{var[:description]}"
        puts "    How to set: export #{var[:name]}=your_value_here"
        puts
      end

      puts "Please set these environment variables and restart the application."
      puts "=" * 80
      puts

      exit 1
    end

    # Log successful validation in production
    if Rails.env.production?
      Rails.logger.info "Environment validation passed. Required variables present:"
      present_vars.each do |var|
        Rails.logger.info "  ✅ #{var[:name]}: #{var[:value]}"
      end
    end
  end

  def self.check_optional_vars
    return unless Rails.env.production? || ENV['VALIDATE_ENV_VARS'] == 'true'

    missing_optional = []
    present_optional = []

    OPTIONAL_VARS.each do |var, description|
      value = ENV[var]
      if value.nil? || value.strip.empty?
        missing_optional << { name: var, description: description }
      else
        present_optional << { name: var, description: description, value: mask_sensitive_value(var, value) }
      end
    end

    if missing_optional.any?
      puts "\n📋 Optional environment variables not set:"
      missing_optional.each do |var|
        puts "  ⚠️  #{var[:name]}: #{var[:description]}"
      end
      puts
    end
  end

  private

  def self.mask_sensitive_value(var_name, value)
    # Mask sensitive values for logging
    sensitive_vars = %w[SECRET_KEY_BASE PASSWORD API_SECRET API_KEY]

    if sensitive_vars.any? { |sensitive| var_name.include?(sensitive) }
      return value.length > 8 ? "#{value[0..3]}...#{value[-4..-1]}" : "[SET]"
    else
      return value
    end
  end
end

# Validate environment variables on startup
EnvironmentValidator.validate!

# Check optional variables (non-fatal)
EnvironmentValidator.check_optional_vars

# Add a method to Rails.application for runtime validation
Rails.application.define_singleton_method(:validate_environment!) do
  EnvironmentValidator.validate!
end
