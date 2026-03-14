import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WYSIWYGEditor from './WYSIWYGEditor';
import ImageBrowser from './ImageBrowser';
import { adminAPI } from '../../services/api';
import { logError } from '../../utils/safeLogger';

const stripHtml = (html = '') =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchNewsArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchNewsArticle = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.news.getById(id);

      const newsArticle = response?.data?.data || response?.data || response;

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
        } catch (_dateError) {
          // use default empty publishedAtFormatted
        }
      }
      
      setFormData({
        title: newsArticle.title || '',
        content: newsArticle.content || '',
        published_at: publishedAtFormatted,
        featured_image: null // Will be handled by ImageUpload component
      });
      setExistingImageUrl(newsArticle.featured_image_url || null);
    } catch (err) {
      setError('Failed to fetch news article');
      logError('Error fetching news article:', err);
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
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setError('');
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
    setFieldErrors((prev) => ({ ...prev, content: null }));
  };

  const handleImageUpload = (uploadData) => {
    setFormData(prev => ({
      ...prev,
      featured_image: uploadData // This will contain the Cloudinary upload response
    }));
  };

  const handleImageSelect = (imageData) => {
    if (!imageData) {
      setFormData((prev) => ({ ...prev, featured_image: null }));
      setExistingImageUrl(null);
      setShowImagePicker(false);
      return;
    }

    const normalizedImageData = {
      url: imageData.url || imageData.secure_url,
      secure_url: imageData.secure_url || imageData.url,
      public_id: imageData.public_id,
      width: imageData.width,
      height: imageData.height,
      alt: imageData.alt || imageData.public_id?.split('/').pop()
    };

    handleImageUpload(normalizedImageData);
    setExistingImageUrl(null);
    setShowImagePicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    const nextFieldErrors = {};
    if (!formData.title.trim()) {
      nextFieldErrors.title = 'Article title is required.';
    }
    if (!stripHtml(formData.content)) {
      nextFieldErrors.content = 'Article content is required.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError('Please fill in the required fields and try again.');
      return;
    }

    setLoading(true);

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
      const serverMessage = err?.response?.data?.error || err?.message || `Failed to ${isEditing ? 'update' : 'create'} news article`;
      const nextServerFieldErrors = {};

      if (/title/i.test(serverMessage)) nextServerFieldErrors.title = serverMessage;
      if (/content/i.test(serverMessage)) nextServerFieldErrors.content = serverMessage;
      if (/published/i.test(serverMessage)) nextServerFieldErrors.published_at = serverMessage;

      if (Object.keys(nextServerFieldErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...nextServerFieldErrors }));
      }

      setError(serverMessage);
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
        <p className="text-sm text-gray-600">
          Fields marked with <span className="text-red-600">*</span> are required.
        </p>

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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              fieldErrors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter article title..."
          />
          {fieldErrors.title && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
          )}
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
          {fieldErrors.content && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.content}</p>
          )}
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon="image" className="mr-2 text-gray-400" />
            Featured Image
          </label>
          
          {/* Thumbnail Preview */}
          {(existingImageUrl || formData.featured_image?.secure_url) && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <div className="inline-block relative">
                <img
                  src={formData.featured_image?.secure_url || existingImageUrl}
                  alt="Article thumbnail"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                {formData.featured_image?.secure_url && (
                  <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    New
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FontAwesomeIcon icon="images" className="mr-2" />
              {formData.featured_image?.secure_url || existingImageUrl ? 'Change Image' : 'Choose from Media Library'}
            </button>
            {(formData.featured_image?.secure_url || existingImageUrl) && (
              <button
                type="button"
                onClick={() => handleImageSelect(null)}
                className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FontAwesomeIcon icon="times" className="mr-2" />
                Remove Image
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Pick an image from the library or upload a new PNG/JPG directly in the picker.
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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              fieldErrors.published_at ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {fieldErrors.published_at && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.published_at}</p>
          )}
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

      {showImagePicker && (
        <ImageBrowser
          onImageSelect={handleImageSelect}
          onClose={() => setShowImagePicker(false)}
          uploadFolder="news"
          selectedImage={formData.featured_image || (existingImageUrl ? { public_id: 'existing', url: existingImageUrl } : null)}
        />
      )}
    </div>
  );
};

export default NewsForm; 