class Api::V1::Admin::EventsController < Api::V1::Admin::BaseController
  before_action :set_event, only: [:show, :update, :destroy]

  def index
    events = Event.includes(:image_attachment).order(:start_time)
    render_success(events.map { |event| admin_event_json(event) })
  end

  def show
    render_success(admin_event_json(@event))
  end

  def create
    event = Event.new(event_params)

    if event.save
      render_success(admin_event_json(event), :created)
    else
      render_error(event.errors.full_messages.join(', '))
    end
  end

  def update
    if @event.update(event_params)
      render_success(admin_event_json(@event))
    else
      render_error(@event.errors.full_messages.join(', '))
    end
  end

  def destroy
    @event.destroy
    render_success({ message: 'Event deleted successfully' })
  end

  private

  def set_event
    @event = Event.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('Event not found', :not_found)
  end

  def event_params
    params.require(:event).permit(:title, :description, :start_time, :end_time, :location, :image)
  end

  def admin_event_json(event)
    {
      id: event.id,
      title: event.title,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      image_url: event.image.attached? ? event.image.url : nil,
      created_at: event.created_at,
      updated_at: event.updated_at
    }
  end
end
