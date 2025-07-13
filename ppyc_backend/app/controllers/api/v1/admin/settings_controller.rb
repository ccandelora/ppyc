class Api::V1::Admin::SettingsController < Api::V1::Admin::BaseController
  before_action :authenticate_user!
  before_action :ensure_admin_access!

  def index
    begin
      settings = Setting.grouped_by_category
      render json: {
        success: true,
        data: settings
      }
    rescue => e
      render json: {
        success: false,
        error: 'Failed to fetch settings',
        message: e.message
      }, status: :internal_server_error
    end
  end

  def show
    begin
      setting = Setting.find_by!(key: params[:key])
      render json: {
        success: true,
        data: {
          key: setting.key,
          value: Setting.get(setting.key),
          category: setting.category,
          description: setting.description
        }
      }
    rescue ActiveRecord::RecordNotFound
      render json: {
        success: false,
        error: 'Setting not found'
      }, status: :not_found
    rescue => e
      render json: {
        success: false,
        error: 'Failed to fetch setting',
        message: e.message
      }, status: :internal_server_error
    end
  end

  def update
    begin
      category = params[:category] || 'general'

      # Validate category
      unless Setting::CATEGORIES.include?(category)
        return render json: {
          success: false,
          error: 'Invalid category'
        }, status: :unprocessable_entity
      end

      # Update single setting
      if params[:key].present? && params[:value].present?
        setting = Setting.set(params[:key], params[:value], category: category)

        render json: {
          success: true,
          message: 'Setting updated successfully',
          data: {
            key: setting.key,
            value: Setting.get(setting.key),
            category: setting.category
          }
        }
      else
        render json: {
          success: false,
          error: 'Missing required parameters'
        }, status: :unprocessable_entity
      end
    rescue => e
      render json: {
        success: false,
        error: 'Failed to update setting',
        message: e.message
      }, status: :internal_server_error
    end
  end

  def update_multiple
    begin
      category = params[:category] || 'general'

      # Validate category
      unless Setting::CATEGORIES.include?(category)
        return render json: {
          success: false,
          error: 'Invalid category'
        }, status: :unprocessable_entity
      end

      # Update multiple settings
      if params[:settings].present?
        updated_settings = {}

        params[:settings].each do |key, value|
          setting = Setting.set(key, value, category: category)
          updated_settings[key] = Setting.get(key)
        end

        render json: {
          success: true,
          message: 'Settings updated successfully',
          data: updated_settings
        }
      else
        render json: {
          success: false,
          error: 'Missing settings parameter'
        }, status: :unprocessable_entity
      end
    rescue => e
      render json: {
        success: false,
        error: 'Failed to update settings',
        message: e.message
      }, status: :internal_server_error
    end
  end

  def create
    begin
      unless params[:key].present? && params[:value].present?
        return render json: {
          success: false,
          error: 'Key and value are required'
        }, status: :unprocessable_entity
      end

      category = params[:category] || 'general'
      description = params[:description]

      # Validate category
      unless Setting::CATEGORIES.include?(category)
        return render json: {
          success: false,
          error: 'Invalid category'
        }, status: :unprocessable_entity
      end

      setting = Setting.set(params[:key], params[:value], category: category, description: description)

      render json: {
        success: true,
        message: 'Setting created successfully',
        data: {
          key: setting.key,
          value: Setting.get(setting.key),
          category: setting.category,
          description: setting.description
        }
      }
    rescue ActiveRecord::RecordInvalid => e
      render json: {
        success: false,
        error: 'Validation failed',
        errors: e.record.errors.full_messages
      }, status: :unprocessable_entity
    rescue => e
      render json: {
        success: false,
        error: 'Failed to create setting',
        message: e.message
      }, status: :internal_server_error
    end
  end

  def destroy
    begin
      setting = Setting.find_by!(key: params[:key])
      setting.destroy!

      render json: {
        success: true,
        message: 'Setting deleted successfully'
      }
    rescue ActiveRecord::RecordNotFound
      render json: {
        success: false,
        error: 'Setting not found'
      }, status: :not_found
    rescue => e
      render json: {
        success: false,
        error: 'Failed to delete setting',
        message: e.message
      }, status: :internal_server_error
    end
  end

  def initialize_defaults
    begin
      Setting.initialize_defaults!
      settings = Setting.grouped_by_category

      render json: {
        success: true,
        message: 'Default settings initialized successfully',
        data: settings
      }
    rescue => e
      render json: {
        success: false,
        error: 'Failed to initialize default settings',
        message: e.message
      }, status: :internal_server_error
    end
  end

  private

  def ensure_admin_access!
    unless current_user&.admin? || current_user&.superuser?
      render json: {
        success: false,
        error: 'Insufficient permissions'
      }, status: :forbidden
    end
  end
end
