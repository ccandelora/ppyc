import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';

const NewsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getAll();
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load news posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin shadow-lg">
            <i className="fas fa-anchor text-white text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading News</h2>
          <p className="text-slate-600">Fetching the latest club updates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to Load News</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Hero Section with Video Background */}
      <section className="relative text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            poster="/assets/images/ppyc-images/ppyc-hero.png"
            className="w-full h-full object-cover"
            onError={(e) => console.log('Video error:', e)}
          >
            <source src="/assets/images/videos/vecteezy_boston-usa-october-16-2024-the-evelyn-moakley-bridge_52194493.mp4" type="video/mp4" />
            <source src="/assets/images/videos/vecteezy_fan-pier-boston-waterfront_1624405.mov" type="video/quicktime" />
            <source src="/assets/images/videos/13963117_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/85 to-blue-900/80"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <i className="fas fa-newspaper text-6xl mb-6 text-blue-300"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Club News & Updates
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest news, announcements, and stories from Pleasant Park Yacht Club
          </p>
        </div>
      </section>



      <div className="max-w-6xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-newspaper text-slate-400 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                No News Available
              </h3>
              <p className="text-slate-600 mb-8">
                Check back soon for the latest club news and announcements.
              </p>
              <Link 
                to="/events" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
              >
                <i className="fas fa-calendar-alt"></i>
                View Upcoming Events
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {posts.length > 0 && (
              <section className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Featured Story</h2>
                  <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
                </div>
                
                <article className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  {posts[0].featured_image_url && (
                    <div className="h-64 md:h-80 overflow-hidden">
                      <img 
                        src={posts[0].featured_image_url} 
                        alt={posts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-6 text-slate-500 text-sm mb-6">
                      <span className="flex items-center gap-2">
                        <i className="fas fa-calendar-alt text-blue-600"></i>
                        {new Date(posts[0].published_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      {posts[0].author && (
                        <span className="flex items-center gap-2">
                          <i className="fas fa-user text-blue-600"></i>
                          By {posts[0].author.email}
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                      <Link to={`/news/${posts[0].slug || posts[0].id}`}>
                        {posts[0].title}
                      </Link>
                    </h1>
                    
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                      {posts[0].content.substring(0, 300)}...
                    </p>
                    
                    <Link 
                      to={`/news/${posts[0].slug || posts[0].id}`}
                      className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                      <span>Read Full Story</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </article>
              </section>
            )}

            {/* Additional Articles */}
            {posts.length > 1 && (
              <section>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">Recent News</h2>
                  <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {posts.slice(1).map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105"
                    >
                      {post.featured_image_url && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
                          <span className="flex items-center gap-2">
                            <i className="fas fa-calendar-alt text-blue-600"></i>
                            {new Date(post.published_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {post.author && (
                            <span className="flex items-center gap-2">
                              <i className="fas fa-user text-blue-600"></i>
                              {post.author.email}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                          <Link to={`/news/${post.slug || post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-slate-600 mb-4 line-clamp-3">
                          {post.content.substring(0, 150)}...
                        </p>
                        
                        <Link 
                          to={`/news/${post.slug || post.id}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                        >
                          <span>Read More</span>
                          <i className="fas fa-arrow-right"></i>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Newsletter Subscription Section */}
        <section className="mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
            <div className="mb-6">
              <i className="fas fa-envelope text-4xl mb-4 text-blue-200"></i>
              <h3 className="text-3xl font-bold mb-4">Stay Connected</h3>
              <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Never miss an update! Subscribe to our newsletter for the latest club news, event announcements, and maritime insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:newsletter@ppyc.org?subject=Subscribe to PPYC Newsletter"
                className="inline-flex items-center gap-3 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <i className="fas fa-envelope"></i>
                Subscribe to Newsletter
              </a>
              <a 
                href="https://facebook.com/ppyc1910"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg border-2 border-blue-400 hover:border-blue-300"
              >
                <i className="fab fa-facebook-f"></i>
                Follow on Facebook
              </a>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Explore More</h3>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              to="/events" 
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <i className="fas fa-calendar-alt text-2xl text-blue-600 group-hover:text-white"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600">Upcoming Events</h4>
              <p className="text-slate-600">Check out our sailing events and social gatherings</p>
            </Link>
            
            <Link 
              to="/history" 
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <i className="fas fa-scroll text-2xl text-blue-600 group-hover:text-white"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600">Club Heritage</h4>
              <p className="text-slate-600">Discover our rich history spanning over a century</p>
            </Link>
            
            <Link 
              to="/membership" 
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <i className="fas fa-users text-2xl text-blue-600 group-hover:text-white"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600">Join PPYC</h4>
              <p className="text-slate-600">Become part of our maritime community</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsPage; 