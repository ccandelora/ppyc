import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../../config/fontawesome';
import { adminAPI } from '../../services/api';
import { truncateText } from '../../utils/htmlUtils';

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
        <div className="text-blue-600 text-2xl">
          <FontAwesomeIcon icon={ICON_NAMES.HOME} className="mr-2" />
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <FontAwesomeIcon icon={ICON_NAMES.HOME} className="text-red-500 mr-2" />
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
              <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="mr-2 text-green-500" />
              Events Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage yacht club events and activities
            </p>
          </div>
          <Link
            to="/admin/events/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FontAwesomeIcon icon={ICON_NAMES.ADD} className="mr-2" />
            Add New Event
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">
              <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} />
            </div>
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
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
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
                          <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="text-gray-400 text-xl" />
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
                          <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="mr-2 text-gray-400" />
                          <span>
                            {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={ICON_NAMES.HOME} className="mr-2 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.description && (
                          <div className="flex items-start">
                            <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="mr-2 text-gray-400 mt-0.5" />
                            <span className="line-clamp-2">
                              {truncateText(event.description, 100)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                      title="Edit Event"
                    >
                      <FontAwesomeIcon icon={ICON_NAMES.EDIT} className="mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                      title="Delete Event"
                    >
                      <FontAwesomeIcon icon={ICON_NAMES.DELETE} className="mr-1" />
                      Delete
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