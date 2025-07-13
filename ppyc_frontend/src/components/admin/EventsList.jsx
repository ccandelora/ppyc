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
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="mr-2 text-green-500" />
              <span className="hidden sm:inline">Events Management</span>
              <span className="sm:hidden">Events</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1 hidden sm:block">
              Manage yacht club events and activities
            </p>
          </div>
          <Link
            to="/admin/events/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={ICON_NAMES.ADD} />
            <span>Add New Event</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {events.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
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
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16">
                      {event.image_url ? (
                        <img
                          className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover"
                          src={event.image_url}
                          alt={event.title}
                        />
                      ) : (
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="text-gray-400 text-lg sm:text-xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {event.title}
                        </h3>
                        {isUpcoming(event.start_time) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={ICON_NAMES.HOME} className="mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                        {event.description && (
                          <div className="flex items-start">
                            <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {truncateText(event.description, 100)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:flex-col sm:space-x-0 sm:space-y-2">
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center flex-1 sm:flex-none"
                      title="Edit Event"
                    >
                      <FontAwesomeIcon icon={ICON_NAMES.EDIT} className="mr-1 sm:mr-0" />
                      <span className="sm:hidden">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center flex-1 sm:flex-none"
                      title="Delete Event"
                    >
                      <FontAwesomeIcon icon={ICON_NAMES.DELETE} className="mr-1 sm:mr-0" />
                      <span className="sm:hidden">Delete</span>
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