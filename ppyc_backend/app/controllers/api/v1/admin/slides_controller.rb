class Api::V1::Admin::SlidesController < Api::V1::Admin::BaseController
  before_action :set_slide, only: [:show, :update, :destroy]

  def index
    slides = Slide.includes(:image_attachment, :background_video_attachment).order(:display_order)
    render_success(slides.map { |slide| admin_slide_json(slide) })
  end

  def show
    render_success(admin_slide_json(@slide))
  end

  def create
    slide = Slide.new(slide_params)

    if slide.save
      render_success(admin_slide_json(slide), :created)
    else
      render_error(slide.errors.full_messages.join(', '))
    end
  end

  def update
    Rails.logger.info "🔄 Updating slide #{@slide.id} with params: #{slide_params}"
    Rails.logger.info "🎥 Background video URL param: #{params.dig(:slide, :background_video_url)}"
    Rails.logger.info "🎨 Background tint color param: #{params.dig(:slide, :background_tint_color)}"
    Rails.logger.info "🌫️ Background tint opacity param: #{params.dig(:slide, :background_tint_opacity)}"

    if @slide.update(slide_params)
      Rails.logger.info "✅ Slide updated successfully"
      Rails.logger.info "🎥 Final background_video_url in DB: #{@slide.background_video_url}"
      render_success(admin_slide_json(@slide))
    else
      Rails.logger.error "❌ Slide update failed: #{@slide.errors.full_messages.join(', ')}"
      render_error(@slide.errors.full_messages.join(', '))
    end
  end

  def destroy
    @slide.destroy
    render_success({ message: 'Slide deleted successfully' })
  end

  # Bulk update display order
  def reorder
    slides_data = Array(params[:slides])
    if slides_data.empty?
      return render_error('No slides provided', :bad_request)
    end

    Slide.transaction do
      normalized_data = slides_data.map do |slide_data|
        {
          id: slide_data[:id].to_i,
          display_order: slide_data[:display_order].to_i
        }
      end

      slide_ids = normalized_data.map { |slide| slide[:id] }
      slides_by_id = Slide.where(id: slide_ids).index_by(&:id)

      missing_ids = slide_ids - slides_by_id.keys
      raise ActiveRecord::RecordNotFound if missing_ids.any?

      # Temporarily move all selected slides out of the current order range so
      # we can safely re-assign unique display_order values in a second pass.
      offset = (Slide.maximum(:display_order) || 0) + normalized_data.size + 10
      normalized_data.each do |slide_data|
        slides_by_id[slide_data[:id]].update_columns(display_order: slide_data[:display_order] + offset)
      end

      normalized_data.each do |slide_data|
        slides_by_id[slide_data[:id]].update!(display_order: slide_data[:display_order])
      end
    end

    slides = Slide.order(:display_order)
    render_success(slides.map { |slide| admin_slide_json(slide) })
  rescue ActiveRecord::RecordNotFound
    render_error('Slide not found', :not_found)
  rescue ActiveRecord::RecordInvalid => e
    render_error("Failed to reorder slides: #{e.record.errors.full_messages.join(', ')}")
  end

  private

  def set_slide
    @slide = Slide.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('Slide not found', :not_found)
  end

  def slide_params
    params.require(:slide).permit(:title, :slide_type, :content, :duration_seconds, :display_order, :active_status, :image, :image_url, :location, :weather_type, :background_video, :background_video_url, :background_tint_color, :background_tint_opacity)
  end

  def admin_slide_json(slide)
    {
      id: slide.id,
      title: slide.title,
      slide_type: slide.slide_type,
      content: slide.content,
      duration_seconds: slide.duration_seconds,
      display_order: slide.display_order,
      active_status: slide.active_status,
      image_url: slide.image_url.presence || (slide.image.attached? ? slide.image.url : nil),
      location: slide.location,
      weather_type: slide.weather_type,
      background_video_url: slide.background_video_url.presence || (slide.background_video.attached? ? slide.background_video.url : nil),
      background_tint_color: slide.background_tint_color,
      background_tint_opacity: slide.background_tint_opacity,
      created_at: slide.created_at,
      updated_at: slide.updated_at
    }
  end
end
