class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Constants
  ROLES = %w[superuser admin editor member].freeze

  # Associations
  has_many :posts, foreign_key: :author_id, dependent: :destroy

  # Validations
  validates :role, inclusion: { in: ROLES, message: "%{value} is not a valid role" }

  # Set default role
  after_initialize :set_default_role, if: :new_record?

  # Role methods
  def superuser?
    role == 'superuser'
  end

  def admin?
    role == 'admin'
  end

  def editor?
    role == 'editor'
  end

  def member?
    role == 'member'
  end

  # Permission methods
  def can_admin?
    superuser? || admin?
  end

  def can_edit_content?
    superuser? || admin? || editor?
  end

  def can_manage_users?
    superuser? || admin?
  end

  def can_manage_media?
    superuser? || admin? || editor?
  end

  def can_view_admin?
    superuser? || admin? || editor?
  end

  private

  def set_default_role
    self.role ||= 'member'
  end
end
