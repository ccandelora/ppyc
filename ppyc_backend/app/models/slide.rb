class Slide < ApplicationRecord
  # Associations
  has_one_attached :image
  has_one_attached :background_video

  # Validations
  validates :title, presence: true
  validates :slide_type, presence: true, inclusion: { in: %w[announcement event_promo photo weather] }
  validates :display_order, presence: true, uniqueness: true
  validates :duration_seconds, presence: true, numericality: { greater_than: 0 }
  validates :background_tint_opacity, numericality: { greater_than_or_equal_to: 0.0, less_than_or_equal_to: 1.0 }, allow_nil: true
  validates :background_tint_color, format: { with: /\A#[0-9A-F]{6}\z/i }, allow_blank: true

  # Scopes
  scope :active, -> { where(active_status: true) }
  scope :by_display_order, -> { order(:display_order) }

  # Set defaults
  after_initialize :set_defaults, if: :new_record?

  # Methods
  def background_asset_url
    if background_video_url.present?
      background_video_url
    elsif background_video.attached?
      Rails.application.routes.url_helpers.rails_blob_url(background_video, only_path: true)
    end
  end

  def has_background_video?
    background_video_url.present? || background_video.attached?
  end

  def has_background_tint?
    background_tint_color.present?
  end

  def tint_opacity
    background_tint_opacity.presence || 0.5
  end

  private

  def set_defaults
    self.active_status = true if active_status.nil?
    self.duration_seconds ||= 60
    self.display_order ||= (Slide.maximum(:display_order) || 0) + 1
    self.background_tint_opacity ||= 0.5
  end
end
