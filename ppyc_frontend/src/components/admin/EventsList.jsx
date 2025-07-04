import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.events.getAll();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await adminAPI.events.delete(eventId);
        setEvents(events.filter(event => event.id !== eventId));
      } catch (err) {
        setError('Failed to delete event');
        console.error('Error deleting event:', err);
      }
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isUpcoming = (startTime) => {
    return new Date(startTime) > new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fas fa-anchor fa-spin text-blue-600 text-2xl"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              <i className="fas fa-calendar-alt mr-2 text-green-500"></i>
              Events Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage yacht club events and activities
            </p>
          </div>
          <Link
            to="/admin/events/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Event
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-500 mb-4">No events created yet.</p>
            <Link
              to="/admin/events/new"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-16 w-16">
                      {event.image_url ? (
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={event.image_url}
                          alt={event.title}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                          <i className="fas fa-calendar-alt text-gray-400 text-xl"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {event.title}
                        </h3>
                        {isUpcoming(event.start_time) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <i className="fas fa-clock mr-2 text-gray-400"></i>
                          <span>
                            {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.description && (
                          <div className="flex items-start">
                            <i className="fas fa-align-left mr-2 text-gray-400 mt-0.5"></i>
                            <span className="line-clamp-2">
                              {event.description.length > 100 
                                ? `${event.description.substring(0, 100)}...` 
                                : event.description}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit Event"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete Event"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList; 