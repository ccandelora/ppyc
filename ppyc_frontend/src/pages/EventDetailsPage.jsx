import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import SEOHelmet from '../components/SEOHelmet';
import { eventsAPI } from '../services/api';
import { useApiCache } from '../hooks/useApiCache';
import { sanitizeHtml } from '../utils/htmlUtils';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { data: response, loading, error } = useApiCache(
    () => eventsAPI.getById(id),
    `events-${id}`,
    {
      ttl: 10 * 60 * 1000,
      enabled: !!id,
      dependencies: [id],
    }
  );

  const event = response?.data;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <FontAwesomeIcon icon={ICON_NAMES.LOADING} className="text-white text-xl" />
          </div>
          <p className="text-slate-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Event Not Found</h1>
          <p className="text-slate-600 mb-8">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <div className="space-x-4">
            <Link to="/events" className="btn-primary">
              Back to Events
            </Link>
            <Link to="/" className="btn-secondary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHelmet
        title={`${event.title} - Events | Pleasant Park Yacht Club`}
        description={event.description ? sanitizeHtml(event.description).replace(/<[^>]*>/g, '').slice(0, 160) : `Join us for ${event.title} at Pleasant Park Yacht Club.`}
        type="article"
      />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link to="/events" className="hover:text-blue-600 transition-colors">
              Events
            </Link>
            <span>›</span>
            <span className="text-slate-900 font-medium">{event.title}</span>
          </div>
        </div>
      </nav>

      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {event.image_url && (
              <div className="w-full h-80 sm:h-96 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200">
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={ICON_NAMES.CALENDAR_DAY} />
                  {formatDate(event.start_time)}
                </span>
                {(event.start_time || event.end_time) && (
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={ICON_NAMES.CLOCK} />
                    {formatTime(event.start_time)}
                    {event.end_time && ` – ${formatTime(event.end_time)}`}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={ICON_NAMES.LOCATION} />
                    {event.location}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {event.title}
              </h1>

              {event.description && (
                <div
                  className="prose prose-lg max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }}
                />
              )}
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center">
            <Link
              to="/events"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <FontAwesomeIcon icon={ICON_NAMES.CHEVRON_LEFT} className="mr-2 w-4 h-4" />
              Back to All Events
            </Link>
            <Link to="/news" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">
              View Club News
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default EventDetailsPage;
