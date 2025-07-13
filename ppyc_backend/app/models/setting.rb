class Setting < ApplicationRecord
  validates :key, presence: true, uniqueness: true
  validates :category, presence: true
  validates :value, presence: true, allow_blank: true

  CATEGORIES = %w[general social tv_display].freeze

  validates :category, inclusion: { in: CATEGORIES }

  # Helper method to get a setting value
  def self.get(key)
    setting = find_by(key: key)
    return nil unless setting

    # Try to parse JSON for complex values
    begin
      JSON.parse(setting.value)
    rescue JSON::ParserError
      setting.value
    end
  end

  # Helper method to set a setting value
  def self.set(key, value, category: 'general', description: nil)
    # Convert complex values to JSON, but allow empty strings
    stored_value = case value
    when String
      value
    when NilClass
      ''
    else
      value.to_json
    end

    setting = find_or_initialize_by(key: key)
    setting.assign_attributes(
      value: stored_value,
      category: category,
      description: description
    )
    setting.save!
    setting
  end

  # Get all settings grouped by category
  def self.grouped_by_category
    all.group_by(&:category).transform_values do |settings|
      settings.each_with_object({}) do |setting, hash|
        hash[setting.key] = begin
          JSON.parse(setting.value)
        rescue JSON::ParserError
          setting.value
        end
      end
    end
  end

  # Initialize default settings
  def self.initialize_defaults!
    defaults = {
      # General settings
      'site_title' => {
        value: 'Pleasant Park Yacht Club',
        category: 'general',
        description: 'The main title of the website'
      },
      'site_description' => {
        value: 'A premier yacht club fostering maritime excellence since 1910',
        category: 'general',
        description: 'Brief description of the yacht club'
      },
      'contact_email' => {
        value: 'secretary.ppyc@gmail.com',
        category: 'general',
        description: 'Main contact email address'
      },
      'contact_phone' => {
        value: '(555) 123-4567',
        category: 'general',
        description: 'Main contact phone number'
      },
      'address' => {
        value: '123 Marina Drive, Boston, MA 02101',
        category: 'general',
        description: 'Physical address of the yacht club'
      },

      # Social media settings
      'facebook_url' => {
        value: '',
        category: 'social',
        description: 'Facebook page URL'
      },
      'twitter_url' => {
        value: '',
        category: 'social',
        description: 'Twitter profile URL'
      },
      'instagram_url' => {
        value: '',
        category: 'social',
        description: 'Instagram profile URL'
      },
      'linkedin_url' => {
        value: '',
        category: 'social',
        description: 'LinkedIn profile URL'
      },

      # TV display settings
      'default_slide_duration' => {
        value: '8',
        category: 'tv_display',
        description: 'Default duration for TV slides in seconds'
      },
      'enable_weather' => {
        value: 'true',
        category: 'tv_display',
        description: 'Show weather information on TV display'
      },
      'enable_time' => {
        value: 'true',
        category: 'tv_display',
        description: 'Show current time on TV display'
      },
      'background_color' => {
        value: '#1e40af',
        category: 'tv_display',
        description: 'Background color for TV display'
      }
    }

    defaults.each do |key, config|
      next if exists?(key: key)

      set(key, config[:value], category: config[:category], description: config[:description])
    end
  end
end
