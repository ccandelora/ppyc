class Api::V1::BaseController < ApplicationController
  # protect_from_forgery is not available in API-only mode
  respond_to :json

  # Skip CSRF protection for API requests
  skip_before_action :verify_authenticity_token

  # Add CORS headers for all API requests
  after_action :add_cors_headers
  before_action :handle_preflight

  private

  def handle_preflight
    if request.method == 'OPTIONS'
      head :ok
    end
  end

  def add_cors_headers
    # For authentication requests that need credentials, we need to specify the exact origin
    origin = request.headers['Origin'] || 'http://localhost:5173'

    response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Requested-With'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
  end

  def render_error(message, status = :unprocessable_entity)
    render json: { error: message }, status: status
  end

  def render_success(data, status = :ok)
    render json: data, status: status
  end
end
