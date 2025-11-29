import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageUpload from '../ImageUpload';
import WYSIWYGEditor from './WYSIWYGEditor';
import { adminAPI } from '../../services/api';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published_at: '',
    featured_image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchNewsArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchNewsArticle = async () => {
    try {
      setLoading(true);
      console.log('Fetching news article with ID:', id);
      const response = await adminAPI.news.getById(id);
      console.log('News article response:', response);
      
      // Handle different response structures
      const newsArticle = response?.data?.data || response?.data || response;
      console.log('News article data:', newsArticle);
      
      if (!newsArticle || typeof newsArticle !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      // Safely parse the published_at date
      let publishedAtFormatted = '';
      if (newsArticle.published_at) {
        try {
          const date = new Date(newsArticle.published_at);
          if (!isNaN(date.getTime())) {
            publishedAtFormatted = date.toISOString().slice(0, 16);
          }
        } catch (dateError) {
          console.warn('Failed to parse published_at date:', dateError);
        }
      }
      
      setFormData({
        title: newsArticle.title || '',
        content: newsArticle.content || '',
        published_at: publishedAtFormatted,
        featured_image: null // Will be handled by ImageUpload component
      });
    } catch (err) {
      setError('Failed to fetch news article');
      console.error('Error fetching news article:', err);
      // Re-throw to let ErrorBoundary catch it if it's a critical error
      if (err.response?.status === 404) {
        setError('News article not found');
      } else if (err.response?.status === 401) {
        setError('You are not authorized to view this article');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageUpload = (uploadData) => {
    setFormData(prev => ({
      ...prev,
      featured_image: uploadData // This will contain the Cloudinary upload response
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('news[title]', formData.title);
      formDataToSend.append('news[content]', formData.content);
      
      if (formData.published_at) {
        formDataToSend.append('news[published_at]', formData.published_at);
      }
      
      if (formData.featured_image && formData.featured_image.secure_url) {
        formDataToSend.append('news[featured_image_url]', formData.featured_image.secure_url);
      }

      if (isEditing) {
        await adminAPI.news.update(id, formDataToSend);
      } else {
        await adminAPI.news.create(formDataToSend);
      }

      setSuccess(`News article ${isEditing ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        navigate('/admin/news');
      }, 2000);
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} news article`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/news');
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon="spinner" spin className="text-3xl text-blue-500" />
      </div>
    );
  }

  // Safety check - if we're editing but don't have an id, show error
  if (isEditing && !id) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
          Invalid article ID. Please go back and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              <FontAwesomeIcon icon="newspaper" className="mr-2 text-blue-500" />
              {isEditing ? 'Edit News Article' : 'Create New News Article'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing ? 'Update your news article' : 'Write a new article for the club'}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon="times" className="mr-1" />
            Cancel
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon="check-circle" className="mr-2" />
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon="heading" className="mr-2 text-gray-400" />
            Article Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="Enter article title..."
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon="align-left" className="mr-2 text-gray-400" />
            Article Content *
          </label>
          <WYSIWYGEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your news article content..."
            height={400}
            disabled={loading}
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon="image" className="mr-2 text-gray-400" />
            Featured Image
          </label>
          <ImageUpload 
            onUploadSuccess={handleImageUpload}
            onUploadError={(error) => setError(`Image upload failed: ${error}`)}
            folder="news"
            allowLibraryBrowse={true}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload a featured image for this article (optional)
          </p>
        </div>

        {/* Publication Date */}
        <div>
          <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon="calendar" className="mr-2 text-gray-400" />
            Publication Date
          </label>
          <input
            type="datetime-local"
            id="published_at"
            name="published_at"
            value={formData.published_at}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to save as draft. Set future date to schedule publication.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon="times" className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon="spinner" spin className="mr-2" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" className="mr-2" />
                {isEditing ? 'Update Article' : 'Create Article'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm; 