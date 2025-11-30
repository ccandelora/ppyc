import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import SEOHelmet from '../components/SEOHelmet';
import { YACHT_CLUB_ASSETS } from '../config/cloudinary';
import CloudinaryVideo from '../components/CloudinaryVideo';
import { eventsAPI } from '../services/api';
import { sanitizeHtml } from '../utils/htmlUtils';
import { useApiCache } from '../hooks/useApiCache';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Use cached API call with loading state tracking
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useApiCache(
    eventsAPI.getAll,
    'events-all',
    {
      ttl: 5 * 60 * 1000 // 5 minutes cache
    }
  );

  // Update data when API call completes
  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData.data || []);
    } else if (eventsError) {
      console.error('Error fetching events:', eventsError);
      setError('Failed to load events. Please try again later.');
    }
  }, [eventsData, eventsError]);

  if (eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin shadow-lg">
            <FontAwesomeIcon icon={ICON_NAMES.LOADING} className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Events</h2>
          <p className="text-gray-600">Fetching upcoming activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={ICON_NAMES.WARNING} className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Events</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={ICON_NAMES.REFRESH} />
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

  // Handle image click to open modal
  const handleImageClick = (imageUrl, eventTitle) => {
    setSelectedImage({ url: imageUrl, title: eventTitle });
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Close modal on ESC key - set up once, check state in handler
  useEffect(() => {
    const handleEscape = (e) => {
      // Check if modal is open by checking if selectedImage state exists
      // We'll use a closure to access the current state
      if (e.key === 'Escape') {
        // Use a function updater to avoid dependency issues
        setSelectedImage(prev => {
          if (prev) return null;
          return prev;
        });
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []); // Empty deps - set up once, handler uses function updater

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <CloudinaryVideo
            publicId={YACHT_CLUB_ASSETS.videos.eventsHero}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Club Events
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Join us for exciting events throughout the sailing season. From educational seminars to 
              social gatherings, there's always something happening at Pleasant Park Yacht Club.
            </p>
          </div>
        </div>
      </div>

      {/* Events Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="text-blue-500 text-3xl" />
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
                    <FontAwesomeIcon icon={ICON_NAMES.CALENDAR_ALT} className="text-4xl text-blue-600 mb-4" />
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
                          <div 
                            className="relative bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group"
                            onClick={() => handleImageClick(event.image_url, event.title)}
                          >
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-full h-auto object-contain max-h-[500px] transition-transform duration-200 group-hover:scale-105"
                              style={{ maxWidth: '100%', display: 'block' }}
                            />
                            {/* Hover overlay hint */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-2">
                                <FontAwesomeIcon icon={ICON_NAMES.SEARCH} className="text-blue-600 text-lg" />
                              </div>
                            </div>
                            {isThisWeek(event.start_time) && (
                              <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full z-10">
                                This Week
                              </div>
                            )}
                          </div>
                        )}

                        {/* Event Content */}
                        <div className="p-6">
                          <div className="text-blue-600 font-semibold text-sm mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={ICON_NAMES.CALENDAR_DAY} />
                            {new Date(event.start_time).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          
                          <div className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={ICON_NAMES.CLOCK} />
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
                              <FontAwesomeIcon icon={ICON_NAMES.LOCATION} className="text-blue-500" />
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
          <div className="mb-6">
            <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-5xl text-blue-300" />
          </div>
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              <FontAwesomeIcon icon={ICON_NAMES.USERS} />
              Become a Member
            </a>
            <a 
              href="/news" 
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold rounded-lg hover:bg-blue-400 hover:text-white transition-all duration-300"
            >
              <FontAwesomeIcon icon={ICON_NAMES.NEWS} />
              Read Club News
            </a>
          </div>
        </div>
      </section>

      {/* Marina Activities Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.SHIP} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Life at the Marina</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're joining us for a Sister Yacht Club Invasion or simply unwinding on the water, Pleasant Park Yacht Club delivers endless opportunities for fun and relaxation.
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
                <div className="p-4">
                  <FontAwesomeIcon icon={ICON_NAMES.TROPHY} className="text-blue-600 text-xl mb-2" />
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
                <div className="p-4">
                  <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} className="text-blue-600 text-xl mb-2" />
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
                <div className="p-4">
                  <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-blue-600 text-xl mb-2" />
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
                <div className="p-4">
                  <FontAwesomeIcon icon={ICON_NAMES.SUN} className="text-blue-600 text-xl mb-2" />
                  <h3 className="font-semibold text-slate-800 text-sm">Perfect Days</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full p-3 z-10 transition-all shadow-lg"
              aria-label="Close image"
            >
              <FontAwesomeIcon icon={ICON_NAMES.CLOSE} className="text-xl" />
            </button>
            
            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[90vh] object-contain mx-auto"
              />
              {/* Image Title */}
              <div className="bg-white px-6 py-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{selectedImage.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Click outside or press ESC to close</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage; 