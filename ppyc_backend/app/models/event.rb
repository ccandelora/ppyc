class Event < ApplicationRecord
  # Associations
  has_one_attached :image

  # Validations
  validates :title, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :end_time_after_start_time

  # Scopes
  scope :upcoming, -> { where('start_time > ?', Time.current) }
  scope :past, -> { where('end_time < ?', Time.current) }
  scope :by_start_time, -> { order(:start_time) }

  private

  def end_time_after_start_time
    return unless start_time && end_time

    errors.add(:end_time, 'must be after start time') if end_time < start_time
  end
end
