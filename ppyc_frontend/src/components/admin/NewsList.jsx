import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { adminAPI } from '../../services/api';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.news.getAll();
      setNews(response.data);
    } catch (err) {
      setError('Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) {
      return;
    }

    try {
      await adminAPI.news.delete(newsId);
      setNews(news.filter(item => item.id !== newsId));
    } catch (err) {
      setError('Failed to delete news article');
      console.error('Error deleting news:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Draft';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon="spinner" className="fa-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              <FontAwesomeIcon icon="newspaper" className="mr-2 text-blue-500" />
              <span className="hidden sm:inline">News Management</span>
              <span className="sm:hidden">News</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1 hidden sm:block">
              Manage your news articles and announcements
            </p>
          </div>
          <Link 
            to="/admin/news/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <FontAwesomeIcon icon="plus" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
          {error}
        </div>
      )}

      {/* News List */}
      <div className="p-4 sm:p-6">
        {news.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon icon="newspaper" className="text-4xl mb-2 opacity-30" />
            <p>No news articles found. Create your first article!</p>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {news.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-20 h-20">
                      {item.featured_image_url ? (
                        <img 
                          src={item.featured_image_url} 
                          alt={item.title}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                          <FontAwesomeIcon icon="newspaper" className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.published_at 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.published_at ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon="user" className="mr-1" />
                          {item.author?.email || 'Unknown'}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon="calendar" className="mr-1" />
                          {formatDate(item.published_at)}
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Link
                          to={`/admin/news/${item.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors text-xs font-medium"
                        >
                          <FontAwesomeIcon icon="edit" className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors text-xs font-medium"
                        >
                          <FontAwesomeIcon icon="trash" className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12 mr-3">
                            {item.featured_image_url ? (
                              <img 
                                src={item.featured_image_url} 
                                alt={item.title}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                                <FontAwesomeIcon icon="newspaper" className="text-gray-400 text-sm" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.author?.email || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.published_at 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.published_at ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.published_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/news/${item.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon="edit" className="mr-1" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon="trash" className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsList; 