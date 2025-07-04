class Page < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  # Validations
  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :content, presence: true

  # Scopes
  scope :published, -> { where(is_published: true) }

  def should_generate_new_friendly_id?
    slug.blank? || title_changed?
  end
end
