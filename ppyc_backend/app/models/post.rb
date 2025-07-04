class Post < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  # Associations
  belongs_to :author, class_name: 'User'
  has_one_attached :featured_image

  # Validations
  validates :title, presence: true
  validates :content, presence: true
  validates :slug, presence: true, uniqueness: true

  # Scopes
  scope :published, -> { where.not(published_at: nil) }
  scope :recent, -> { order(published_at: :desc) }

  # Methods
  def published?
    published_at.present? && published_at <= Time.current
  end

  def should_generate_new_friendly_id?
    slug.blank? || title_changed?
  end
end
