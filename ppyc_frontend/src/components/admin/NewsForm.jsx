import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  }, [id, isEditing]);

  const fetchNewsArticle = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.news.getById(id);
      const newsArticle = response.data;
      
      setFormData({
        title: newsArticle.title || '',
        content: newsArticle.content || '',
        published_at: newsArticle.published_at ? new Date(newsArticle.published_at).toISOString().slice(0, 16) : '',
        featured_image: null // Will be handled by ImageUpload component
      });
    } catch (err) {
      setError('Failed to fetch news article');
      console.error('Error fetching news article:', err);
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
        <i className="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
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
              <i className="fas fa-newspaper mr-2 text-blue-500"></i>
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
            <i className="fas fa-times mr-1"></i>
            Cancel
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <i className="fas fa-check-circle mr-2"></i>
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-heading mr-2 text-gray-400"></i>
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
            <i className="fas fa-align-left mr-2 text-gray-400"></i>
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
            <i className="fas fa-image mr-2 text-gray-400"></i>
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
            <i className="fas fa-calendar mr-2 text-gray-400"></i>
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
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
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