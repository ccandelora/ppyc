import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { newsAPI, eventsAPI, slidesAPI } from '../../services/api';
import { useMultipleApiCache } from '../../hooks/useApiCache';

const Dashboard = () => {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    slides: 0,
    pages: 4 // Static pages count
  });
  const [recentNews, setRecentNews] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Memoize callback functions
  const onSuccess = useCallback(() => {
    setIsInitialLoad(false);
  }, []);

  const onError = useCallback((error) => {
    console.error('Error fetching dashboard data:', error);
    setIsInitialLoad(false);
  }, []);

  // Use cached API calls for dashboard data
  const { data: dashboardData } = useMultipleApiCache([
    { apiCall: newsAPI.getAll, cacheKey: 'news-all', ttl: 5 * 60 * 1000 },
    { apiCall: eventsAPI.getAll, cacheKey: 'events-all', ttl: 5 * 60 * 1000 },
    { apiCall: slidesAPI.getAll, cacheKey: 'slides-all', ttl: 2 * 60 * 1000 }
  ], {
    onSuccess,
    onError
  });

  // Update stats and recent data when dashboard data loads
  React.useEffect(() => {
    if (dashboardData && Object.keys(dashboardData).length > 0) {
      const newsData = dashboardData['news-all'];
      const eventsData = dashboardData['events-all'];
      const slidesData = dashboardData['slides-all'];

      if (newsData && eventsData && slidesData) {
        setStats(prev => ({
          ...prev,
          news: newsData.data?.length || 0,
          events: eventsData.data?.length || 0,
          slides: slidesData.data?.length || 0
        }));

        setRecentNews(newsData.data?.slice(0, 5) || []);
        setRecentEvents(eventsData.data?.slice(0, 5) || []);
        setIsInitialLoad(false);
      }
    }
  }, [dashboardData]);

  const quickActions = [
    {
      title: 'Create News Article',
      description: 'Write a new news article or announcement',
      icon: 'plus',
      link: '/admin/news/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Add Event',
      description: 'Schedule a new yacht club event',
      icon: 'calendar',
      link: '/admin/events/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Create TV Slide',
      description: 'Design a new slide for TV display',
      icon: 'tv',
      link: '/admin/slides/new',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Upload Media',
      description: 'Add new images to media library',
      icon: 'cloud-upload-alt',
      link: '/admin/media',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const statCards = [
    {
      title: 'News Articles',
      count: stats.news,
      icon: 'newspaper',
      color: 'bg-blue-500',
      link: '/admin/news'
    },
    {
      title: 'Events',
      count: stats.events,
      icon: 'calendar-alt',
      color: 'bg-green-500',
      link: '/admin/events'
    },
    {
      title: 'TV Slides',
      count: stats.slides,
      icon: 'desktop',
      color: 'bg-purple-500',
      link: '/admin/slides'
    },
    {
      title: 'Pages',
      count: stats.pages,
      icon: 'file-alt',
      color: 'bg-orange-500',
      link: '/admin/pages'
    }
  ];

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FontAwesomeIcon icon="anchor" className="fa-spin text-4xl text-blue-500 mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome to PPYC Content Management System</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0">
              <div className={`${card.color} rounded-lg p-2 sm:p-3 text-white self-start`}>
                <FontAwesomeIcon icon={card.icon} className="text-lg sm:text-xl" />
              </div>
              <div className="sm:ml-4">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{card.count}</p>
                <p className="text-gray-600 text-xs sm:text-sm">{card.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-white rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition-all duration-200 transform hover:scale-105`}
            >
              <FontAwesomeIcon icon={action.icon} className="text-xl sm:text-2xl mb-2 block" />
              <h3 className="font-semibold text-xs sm:text-sm mb-1">{action.title}</h3>
              <p className="text-xs opacity-90 hidden sm:block">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent News</h2>
            <Link to="/admin/news" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
              <span className="hidden sm:inline">View all</span>
              <span className="sm:hidden">All</span>
              <FontAwesomeIcon icon="arrow-right" className="ml-1" />
            </Link>
          </div>
          {recentNews.length > 0 ? (
            <div className="space-y-3">
              {recentNews.map((post) => (
                <div key={post.id} className="flex items-start space-x-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 rounded-lg p-2 text-blue-600 flex-shrink-0">
                    <FontAwesomeIcon icon="newspaper" className="text-sm" />
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
              View all <FontAwesomeIcon icon="arrow-right" className="ml-1" />
            </Link>
          </div>
          {recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="bg-green-100 rounded-lg p-2 text-green-600">
                    <FontAwesomeIcon icon="calendar-alt" />
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