import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { eventsAPI } from '../../services/api';
import { useApiCache } from '../../hooks/useApiCache';

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([]);

  // Use cached API call with self-managed loading
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useApiCache(
    eventsAPI.getAll,
    'events-all',
    {
      ttl: 5 * 60 * 1000 // 5 minutes cache
    }
  );

  // Update data when API call completes
  useEffect(() => {
    if (eventsData && eventsData.data) {
      setEvents(eventsData.data.slice(0, 3));
    }
  }, [eventsData]);

  // Don't render anything while loading
  if (eventsLoading) {
    return null;
  }

  // Don't render if no events or error
  if (eventsError || !events.length) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Upcoming Events</h2>
            <div className="w-16 h-1 bg-blue-600"></div>
          </div>
          <Link 
            to="/events" 
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors"
          >
            <span>View All Events</span>
            <FontAwesomeIcon icon="arrow-right" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {event.image_url && (
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="text-blue-600 font-semibold text-sm mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon="calendar-day" />
                  {new Date(event.start_time).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon="clock" />
                  {new Date(event.start_time).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{event.title}</h3>
                <p className="text-gray-600 leading-relaxed line-clamp-3">{event.description}</p>
                {event.location && (
                  <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                    <FontAwesomeIcon icon="map-marker-alt" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection; 