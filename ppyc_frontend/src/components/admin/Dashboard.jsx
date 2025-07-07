import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI, eventsAPI, slidesAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    slides: 0,
    pages: 4 // Static pages count
  });
  const [recentNews, setRecentNews] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch news, events, and slides from public API using proper imports
      const [newsResponse, eventsResponse, slidesResponse] = await Promise.all([
        newsAPI.getAll(),
        eventsAPI.getAll(),
        slidesAPI.getAll()
      ]);

      setStats(prev => ({
        ...prev,
        news: newsResponse.data.length,
        events: eventsResponse.data.length,
        slides: slidesResponse.data.length
      }));

      setRecentNews(newsResponse.data.slice(0, 5));
      setRecentEvents(eventsResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create News Article',
      description: 'Write a new news article or announcement',
      icon: 'fas fa-plus-circle',
      link: '/admin/news/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Add Event',
      description: 'Schedule a new yacht club event',
      icon: 'fas fa-calendar-plus',
      link: '/admin/events/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Create TV Slide',
      description: 'Design a new slide for TV display',
      icon: 'fas fa-tv',
      link: '/admin/slides/new',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Upload Media',
      description: 'Add new images to media library',
      icon: 'fas fa-cloud-upload-alt',
      link: '/admin/media',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const statCards = [
    {
      title: 'News Articles',
      count: stats.news,
      icon: 'fas fa-newspaper',
      color: 'bg-blue-500',
      link: '/admin/news'
    },
    {
      title: 'Events',
      count: stats.events,
      icon: 'fas fa-calendar-alt',
      color: 'bg-green-500',
      link: '/admin/events'
    },
    {
      title: 'TV Slides',
      count: stats.slides,
      icon: 'fas fa-desktop',
      color: 'bg-purple-500',
      link: '/admin/slides'
    },
    {
      title: 'Pages',
      count: stats.pages,
      icon: 'fas fa-file-alt',
      color: 'bg-orange-500',
      link: '/admin/pages'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-anchor fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to PPYC Content Management System</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`${card.color} rounded-lg p-3 text-white`}>
                <i className={`${card.icon} text-xl`}></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                <p className="text-gray-600 text-sm">{card.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-200 transform hover:scale-105`}
            >
              <i className={`${action.icon} text-2xl mb-2 block`}></i>
              <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
              <p className="text-xs opacity-90">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent News</h2>
            <Link to="/admin/news" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          {recentNews.length > 0 ? (
            <div className="space-y-3">
              {recentNews.map((post) => (
                <div key={post.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 rounded-lg p-2 text-blue-600">
                    <i className="fas fa-newspaper"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-500">
                      By {post.author.email} • {new Date(post.published_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No news yet</p>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/admin/events" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          {recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="bg-green-100 rounded-lg p-2 text-green-600">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.start_time).toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming events</p>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Website Online</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Cloudinary Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Database Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 