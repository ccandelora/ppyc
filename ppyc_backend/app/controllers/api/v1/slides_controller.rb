class Api::V1::SlidesController < Api::V1::BaseController
  def index
    slides = Slide.active.by_display_order.includes(:image_attachment, :background_video_attachment)
    render_success(slides.map { |slide| slide_json(slide) })
  end

  private

  def slide_json(slide)
    {
      id: slide.id,
      title: slide.title,
      slide_type: slide.slide_type,
      content: slide.content,
      image_url: slide.image_url.presence || (slide.image.attached? ? slide.image.url : nil),
      duration_seconds: slide.duration_seconds,
      display_order: slide.display_order,
      location: slide.location,
      weather_type: slide.weather_type,
      background_video_url: slide.background_video_url.presence || (slide.background_video.attached? ? slide.background_video.url : nil),
      background_tint_color: slide.background_tint_color,
      background_tint_opacity: slide.background_tint_opacity
    }
  end
end
