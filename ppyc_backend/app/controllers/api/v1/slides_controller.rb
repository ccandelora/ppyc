class Api::V1::SlidesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_cors_headers

  def index
    slides = Slide.active.by_display_order.includes(:image_attachment, :background_video_attachment)
    render json: slides.map { |slide| slide_json(slide) }
  end

  private

  def slide_json(slide)
    {
      id: slide.id,
      title: slide.title,
      slide_type: slide.slide_type,
      content: slide.content,
      image_url: slide.image_url.presence || (slide.image.attached? ? url_for(slide.image) : nil),
      duration_seconds: slide.duration_seconds,
      display_order: slide.display_order,
      location: slide.location,
      weather_type: slide.weather_type,
      background_video_url: slide.background_video_url.presence || (slide.background_video.attached? ? url_for(slide.background_video) : nil),
      background_tint_color: slide.background_tint_color,
      background_tint_opacity: slide.background_tint_opacity
    }
  end

  def set_cors_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
  end
end
