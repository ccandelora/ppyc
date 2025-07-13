class Api::V1::EventsController < Api::V1::BaseController
  def index
    events = Event.upcoming.by_start_time
    render json: events.map { |event| event_json(event) }
  end

  def show
    event = Event.find(params[:id])
    render json: event_json(event)
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Event not found' }, status: :not_found
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
      image_url: event.image_url,
      created_at: event.created_at,
      updated_at: event.updated_at
    }
  end
end
