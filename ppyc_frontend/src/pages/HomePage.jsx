import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, postsResponse] = await Promise.all([
          api.get('/events'),
          api.get('/posts')
        ]);
        setEvents(eventsResponse.data.slice(0, 3));
        setPosts(postsResponse.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img 
            src="/assets/images/file.svg" 
            alt="Pleasant Park Yacht Club" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/images/videos/13974154_3840_2160_50fps.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/80"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <img 
              src="/assets/images/file.svg" 
              alt="Pleasant Park Yacht Club" 
              className="w-24 h-24 mx-auto mb-6 opacity-90"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Pleasant Park
            <span className="block text-4xl md:text-6xl font-light text-blue-200">Yacht Club</span>
          </h1>
          
          <div className="w-24 h-1 bg-gold-400 mx-auto mb-8"></div>
          
          <p className="text-xl md:text-2xl font-light mb-4 leading-relaxed">
            Est. 1910
          </p>
          
          <p className="text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
            A tradition of excellence in navigation, seamanship, and fellowship on the Great Lakes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/about" 
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Discover Our Heritage
            </Link>
            <Link 
              to="/membership" 
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              Join Our Community
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Over a Century of Excellence
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Since 1910, Pleasant Park Yacht Club has been a beacon for those who share our passion for 
              the water, fine seamanship, and lifelong friendships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-compass text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Navigation Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                Promoting the highest standards of seamanship and navigation on the Great Lakes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-anchor text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Maritime Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Building lasting friendships through shared adventures on the water.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-trophy text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Proud Tradition</h3>
              <p className="text-gray-600 leading-relaxed">
                Honoring our maritime heritage while embracing the future of yachting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Photos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              A Rich Heritage
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From our founding in 1910 to today, Pleasant Park Yacht Club has been a cornerstone 
              of maritime excellence and community fellowship.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="/assets/images/ppyc-images/ppyc-1919a-768x603.jpg" 
                  alt="PPYC 1919" 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Early Days - 1919</h3>
                  <p className="text-gray-600">Our club in its formative years, establishing traditions that continue today.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="/assets/images/ppyc-images/ppyc1951.jpg" 
                  alt="PPYC 1920" 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Growing Community - 1920</h3>
                  <p className="text-gray-600">The spirit of fellowship and maritime excellence taking root.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="/assets/images/ppyc-images/ppyc1951_men_at_bar-768x563.jpg" 
                  alt="PPYC 1951 Social Life" 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Social Traditions - 1951</h3>
                  <p className="text-gray-600">The clubhouse has always been the heart of our community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
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
              <i className="fas fa-arrow-right"></i>
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
                  <div className="text-blue-600 font-semibold text-sm mb-2">
                    {new Date(event.start_time).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{event.title}</h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3">{event.description}</p>
                  {event.location && (
                    <div className="mt-4 text-sm text-gray-500">
                      📍 {event.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Club News</h2>
              <div className="w-16 h-1 bg-blue-600"></div>
            </div>
            <Link 
              to="/news" 
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors"
            >
              <span>View All News</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {post.featured_image_url && (
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="text-gray-500 text-sm mb-2">
                    {new Date(post.published_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight">
                    <Link 
                      to={`/news/${post.slug}`} 
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    By {post.author?.email || 'PPYC Staff'}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Maritime Community
          </h2>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
          <p className="text-xl font-light leading-relaxed mb-12 opacity-90">
            Experience the camaraderie, tradition, and adventure that has defined Pleasant Park Yacht Club 
            for over a century. From seasoned mariners to those new to the water, all are welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/membership" 
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Learn About Membership
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold rounded-lg hover:bg-blue-400 hover:text-white transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage; 