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
  validate :no_duplicate_titles_within_timeframe

  # Scopes
  scope :published, -> { where.not(published_at: nil) }
  scope :recent, -> { order(published_at: :desc) }
  scope :similar_titles, ->(title, id = nil) {
    query = where("LOWER(title) = LOWER(?)", title)
    query = query.where.not(id: id) if id.present?
    query
  }

  # Methods
  def published?
    published_at.present? && published_at <= Time.current
  end

  def should_generate_new_friendly_id?
    slug.blank? || title_changed?
  end

  private

  def no_duplicate_titles_within_timeframe
    # Check for posts with the same title within 24 hours
    # Skip validation if published_at is nil (drafts can have duplicate titles)
    return if published_at.nil?

    # Skip validation if title hasn't changed (editing without changing title is fine)
    return unless title_changed?

    timeframe = 24.hours
    duplicate = self.class.similar_titles(title, id)
                   .where.not(published_at: nil)
                   .where(published_at: (published_at - timeframe)..(published_at + timeframe))
                   .exists?

    if duplicate
      errors.add(:title, "has already been used for another post within 24 hours")
    end
  end
end
