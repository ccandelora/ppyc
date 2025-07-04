class Api::V1::BaseController < ApplicationController
  # protect_from_forgery is not available in API-only mode
  respond_to :json

  private

  def render_error(message, status = :unprocessable_entity)
    render json: { error: message }, status: status
  end

  def render_success(data, status = :ok)
    render json: data, status: status
  end
end
