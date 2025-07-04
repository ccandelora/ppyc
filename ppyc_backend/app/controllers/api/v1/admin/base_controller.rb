class Api::V1::Admin::BaseController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :ensure_admin_access

  private

  def ensure_admin_access
    unless current_user&.can_view_admin?
      render json: {
        success: false,
        error: 'Access denied. Admin privileges required.'
      }, status: :forbidden
    end
  end

  def ensure_content_edit_access
    unless current_user&.can_edit_content?
      render json: {
        success: false,
        error: 'Access denied. Content editing privileges required.'
      }, status: :forbidden
    end
  end

  def ensure_user_management_access
    unless current_user&.can_manage_users?
      render json: {
        success: false,
        error: 'Access denied. User management privileges required.'
      }, status: :forbidden
    end
  end

  def ensure_media_management_access
    unless current_user&.can_manage_media?
      render json: {
        success: false,
        error: 'Access denied. Media management privileges required.'
      }, status: :forbidden
    end
  end
end
