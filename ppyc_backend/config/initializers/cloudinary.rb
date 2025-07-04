require 'cloudinary'
require 'dotenv'

# Ensure .env file is loaded
Dotenv.load('.env') if File.exist?('.env')

# Cloudinary configuration using individual environment variables
# This follows the official documentation: https://cloudinary.com/documentation/rails_integration
if ENV['CLOUDINARY_CLOUD_NAME'].present? && ENV['CLOUDINARY_API_KEY'].present? && ENV['CLOUDINARY_API_SECRET'].present?
  Cloudinary.config(
    cloud_name: ENV['CLOUDINARY_CLOUD_NAME'],
    api_key: ENV['CLOUDINARY_API_KEY'],
    api_secret: ENV['CLOUDINARY_API_SECRET'],
    secure: true
  )

  Rails.logger.info "Cloudinary configured with cloud_name: #{ENV['CLOUDINARY_CLOUD_NAME']}"
else
  Rails.logger.warn "Cloudinary environment variables not properly set"
end
