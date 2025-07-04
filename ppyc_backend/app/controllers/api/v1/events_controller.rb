class Api::V1::EventsController < Api::V1::BaseController
  def index
    events = Event.upcoming.by_start_time.includes(:image_attachment)
    render_success(events.map { |event| event_json(event) })
  end

  def show
    event = Event.find(params[:id])
    render_success(event_json(event))
  rescue ActiveRecord::RecordNotFound
    render_error('Event not found', :not_found)
  end

  private

  def event_json(event)
    {
      id: event.id,
      title: event.title,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      image_url: event.image.attached? ? event.image.url : nil
    }
  end
end
