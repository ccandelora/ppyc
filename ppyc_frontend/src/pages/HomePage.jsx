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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="relative">
            <img 
              src="/assets/images/file.svg" 
              alt="Pleasant Park Yacht Club" 
              className="w-20 h-20 mx-auto mb-6 animate-pulse"
            />
            <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping"></div>
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading...</p>
          <div className="mt-4 w-48 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
          </div>
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
            <source src="https://res.cloudinary.com/dqb8hp68j/video/upload/v1751693180/ppyc/ppyc/slides/videos/cloudinaryfile_wttzjq.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-800/85"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in-up">
            <div className="relative inline-block">
              <img 
                src="/assets/images/file.svg" 
                alt="Pleasant Park Yacht Club" 
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-6 opacity-95 drop-shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-white/20 scale-150 blur-xl"></div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up animation-delay-200">
            Pleasant Park
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-blue-200 mt-2">
              Yacht Club
            </span>
          </h1>
          
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-400 mx-auto mb-8 animate-fade-in-up animation-delay-400"></div>
          
          <p className="text-lg sm:text-xl lg:text-2xl font-light mb-4 animate-fade-in-up animation-delay-600">
            Established 1910
          </p>
          
          <p className="text-base sm:text-lg lg:text-xl font-light mb-12 max-w-3xl mx-auto leading-relaxed opacity-95 animate-fade-in-up animation-delay-800">
            A tradition of excellence in navigation, seamanship, and fellowship on the Great Lakes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-1000">
            <Link 
              to="/about" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl min-w-[200px] text-center"
            >
              Discover Our Heritage
            </Link>
            <Link 
              to="/membership" 
              className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:scale-105 min-w-[200px] text-center"
            >
              Join Our Community
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-xs mt-2 text-white/80">Scroll</p>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Over a Century of Excellence
            </h2>
            <div className="w-20 lg:w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Since 1910, Pleasant Park Yacht Club has been a beacon for those who share our passion for 
              the water, fine seamanship, and lifelong friendships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-compass text-3xl lg:text-4xl text-blue-600"></i>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">Navigation Excellence</h3>
              <p className="text-slate-600 leading-relaxed">
                Promoting the highest standards of seamanship and navigation on the Great Lakes.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-anchor text-3xl lg:text-4xl text-blue-600"></i>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">Maritime Community</h3>
              <p className="text-slate-600 leading-relaxed">
                Building lasting friendships through shared adventures on the water.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-trophy text-3xl lg:text-4xl text-blue-600"></i>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">Proud Tradition</h3>
              <p className="text-slate-600 leading-relaxed">
                Honoring our maritime heritage while embracing the future of yachting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 lg:mb-16">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
                Upcoming Events
              </h2>
              <div className="w-20 h-1 bg-blue-600"></div>
            </div>
            <Link 
              to="/events" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Events
              <i className="fas fa-arrow-right text-sm"></i>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105">
                <div className="p-6 lg:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-calendar text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-slate-600 text-sm lg:text-base line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                    <Link 
                      to={`/events`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Learn More
                      <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 lg:mb-16">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
                Latest News
              </h2>
              <div className="w-20 h-1 bg-blue-600"></div>
            </div>
            <Link 
              to="/news" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All News
              <i className="fas fa-arrow-right text-sm"></i>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105">
                <div className="p-6 lg:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-newspaper text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 text-sm lg:text-base line-clamp-3">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <Link 
                      to={`/news/${post.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read More
                      <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Join Our Maritime Family?
          </h2>
          <p className="text-lg lg:text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the camaraderie, expertise, and adventure that has defined Pleasant Park Yacht Club for over a century.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/membership" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl min-w-[200px] text-center"
            >
              Apply for Membership
            </Link>
            <Link 
              to="/about" 
              className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 min-w-[200px] text-center"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage; 