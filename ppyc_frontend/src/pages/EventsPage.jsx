import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import { sanitizeHtml } from '../utils/htmlUtils';
import { useApiCache } from '../hooks/useApiCache';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use cached API call
  const { loading: cacheLoading, error: cacheError } = useApiCache(
    eventsAPI.getAll,
    'events-all',
    {
      ttl: 5 * 60 * 1000, // 5 minutes cache
      onSuccess: (data) => {
        setEvents(data.data || []);
        setLoading(false);
      },
      onError: (err) => {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    }
  );

  useEffect(() => {
    if (cacheLoading) {
      setLoading(true);
    } else if (cacheError) {
      setError('Failed to load events. Please try again later.');
      setLoading(false);
    }
  }, [cacheLoading, cacheError]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img 
            src="/assets/images/ppyc-logo.svg" 
            alt="PPYC" 
            className="w-16 h-16 mx-auto mb-6 opacity-80" 
          />
          <p className="text-blue-100 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Events</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Group events by month for better organization
  const groupEventsByMonth = (events) => {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.start_time);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByMonth(events);

  // Helper function to check if event is this week
  const isThisWeek = (eventDate) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    const event = new Date(eventDate);
    return event >= startOfWeek && event <= endOfWeek;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/images/videos/vecteezy_similan-islands-thailand-november-23-2016-dive-boat-near_8821366.mp4" type="video/mp4" />
            <source src="/assets/images/videos/13963117_2560_1440_30fps.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/80"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Club Events</h1>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
          <p className="text-xl font-light max-w-3xl mx-auto leading-relaxed opacity-90">
            Join us for exciting events throughout the sailing season. From educational seminars to 
            social gatherings, there's always something happening at Pleasant Park Yacht Club.
          </p>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Upcoming Events</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Check back soon for exciting events and activities. Follow our news for the latest updates 
                on club happenings.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
                <div key={monthYear}>
                  {/* Month Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">{monthYear}</h2>
                    <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
                  </div>

                  {/* Events Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {monthEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                      >
                        {/* Event Image */}
                        {event.image_url && (
                          <div className="relative">
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-full h-48 object-cover"
                            />
                            {isThisWeek(event.start_time) && (
                              <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                                This Week
                              </div>
                            )}
                          </div>
                        )}

                        {/* Event Content */}
                        <div className="p-6">
                          <div className="text-blue-600 font-semibold text-sm mb-2 flex items-center gap-2">
                            <i className="fas fa-calendar-day"></i>
                            {new Date(event.start_time).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          
                          <div className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                            <i className="fas fa-clock"></i>
                            {new Date(event.start_time).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </div>

                          <h3 className="text-xl font-bold text-slate-800 mb-3">{event.title}</h3>
                          
                          {/* Render HTML content properly */}
                          {event.description && (
                            <div 
                              className="text-gray-600 leading-relaxed mb-4 prose-event"
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }}
                            />
                          )}
                          
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <i className="fas fa-map-marker-alt text-blue-500"></i>
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Connected with PPYC
          </h2>
          <div className="w-20 h-1 bg-blue-400 mx-auto mb-8"></div>
          <p className="text-lg font-light leading-relaxed mb-8 opacity-90">
            Never miss an event! Join our community to receive updates about upcoming activities, 
            member meetings, and special occasions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/membership" 
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Become a Member
            </a>
            <a 
              href="/news" 
              className="px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold rounded-lg hover:bg-blue-400 hover:text-white transition-all duration-300"
            >
              Read Club News
            </a>
          </div>
        </div>
      </section>

      {/* Marina Activities Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Life at the Marina</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From racing to relaxing, Pleasant Park Yacht Club offers endless opportunities 
              to enjoy life on the water.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src="/assets/images/ppyc-images/matches.jpg" 
                  alt="Racing at PPYC" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-slate-800 text-sm">Racing Program</h3>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src="/assets/images/ppyc-images/float2.jpg" 
                  alt="Marina Facilities" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-slate-800 text-sm">Marina Services</h3>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src="/assets/images/ppyc-images/deck.jpg" 
                  alt="Deck Life" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-slate-800 text-sm">Social Gatherings</h3>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src="/assets/images/ppyc-images/middaysun.jpg" 
                  alt="Perfect Day" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-slate-800 text-sm">Perfect Days</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventsPage; 