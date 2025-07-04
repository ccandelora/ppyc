class Api::V1::Admin::UsersController < Api::V1::Admin::BaseController
  before_action :ensure_user_management_access
  before_action :set_user, only: [:show, :update, :destroy]

  # GET /api/v1/admin/users
  def index
    users = User.all.order(created_at: :desc)

    render json: {
      success: true,
      data: users.map { |user| user_json(user) }
    }
  end

  # GET /api/v1/admin/users/:id
  def show
    render json: {
      success: true,
      data: user_json(@user)
    }
  end

  # POST /api/v1/admin/users
  def create
    user = User.new(user_params)

    if user.save
      render json: {
        success: true,
        data: user_json(user),
        message: 'User created successfully'
      }, status: :created
    else
      render json: {
        success: false,
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/admin/users/:id
  def update
    if @user.update(user_params)
      render json: {
        success: true,
        data: user_json(@user),
        message: 'User updated successfully'
      }
    else
      render json: {
        success: false,
        errors: @user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/admin/users/:id
  def destroy
    # Prevent users from deleting themselves
    if @user == current_user
      render json: {
        success: false,
        error: 'Cannot delete your own account'
      }, status: :forbidden
      return
    end

    # Prevent deletion of the last superuser
    if @user.superuser? && User.where(role: 'superuser').count <= 1
      render json: {
        success: false,
        error: 'Cannot delete the last superuser account'
      }, status: :forbidden
      return
    end

    @user.destroy
    render json: {
      success: true,
      message: 'User deleted successfully'
    }
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {
      success: false,
      error: 'User not found'
    }, status: :not_found
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :role)
  end

  def user_json(user)
    {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      posts_count: user.posts.count,
      can_admin: user.can_admin?,
      can_edit_content: user.can_edit_content?,
      can_manage_users: user.can_manage_users?,
      can_manage_media: user.can_manage_media?
    }
  end
end
