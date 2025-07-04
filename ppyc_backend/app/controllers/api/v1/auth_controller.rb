class Api::V1::AuthController < Api::V1::BaseController
  before_action :authenticate_user!, only: [:show, :destroy]

  # POST /api/v1/auth/login
  def create
    user = User.find_by(email: params[:email])

    if user&.valid_password?(params[:password])
      sign_in(user)
      render json: {
        success: true,
        data: {
          user: user_json(user),
          message: 'Logged in successfully'
        }
      }
    else
      render json: {
        success: false,
        error: 'Invalid email or password'
      }, status: :unauthorized
    end
  end

  # GET /api/v1/auth/me
  def show
    render json: {
      success: true,
      data: {
        user: user_json(current_user)
      }
    }
  end

  # DELETE /api/v1/auth/logout
  def destroy
    sign_out(current_user)
    render json: {
      success: true,
      message: 'Logged out successfully'
    }
  end

  private

  def user_json(user)
    {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    }
  end
end
