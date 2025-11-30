import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../../config/fontawesome';
import WYSIWYGEditor from './WYSIWYGEditor';
import ImageUpload from '../ImageUpload';
import { adminAPI } from '../../services/api';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    image: null // Will be handled by ImageUpload component
  });
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id, isEditing]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.events.getById(id);
      const event = response.data;
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '',
        end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
        location: event.location || '',
        image: null
      });
      setExistingImageUrl(event.image_url || null);
    } catch (err) {
      setError('Failed to fetch event');
      console.error('Error fetching event:', err);
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
    setError(null);
  };

  const handleDescriptionChange = (description) => {
    setFormData(prev => ({
      ...prev,
      description
    }));
  };

  const handleImageUpload = (uploadData) => {
    setFormData(prev => ({
      ...prev,
      image: uploadData // This will contain the Cloudinary upload response
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('event[title]', formData.title);
      submitData.append('event[description]', formData.description);
      submitData.append('event[start_time]', formData.start_time);
      submitData.append('event[end_time]', formData.end_time);
      submitData.append('event[location]', formData.location);
      
      if (formData.image && formData.image.secure_url) {
        submitData.append('event[image_url]', formData.image.secure_url);
      }

      if (isEditing) {
        await adminAPI.events.update(id, submitData);
      } else {
        await adminAPI.events.create(submitData);
      }

      setSuccess(`Event ${isEditing ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        navigate('/admin/events');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'create'} event`);
      console.error('Error saving event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/events');
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} spin className="text-3xl text-blue-500" />
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
              <FontAwesomeIcon icon={ICON_NAMES.CALENDAR_ALT} className="mr-2 text-green-500" />
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing ? 'Update your existing event' : 'Schedule a new yacht club event'}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={ICON_NAMES.CLOSE} className="mr-1" />
            Cancel
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon={ICON_NAMES.WARNING} className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon={ICON_NAMES.CHECK_CIRCLE} className="mr-2" />
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={ICON_NAMES.HEADING} className="mr-2 text-gray-400" />
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            placeholder="Enter event title..."
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={ICON_NAMES.ALIGN_LEFT} className="mr-2 text-gray-400" />
            Description
          </label>
          <WYSIWYGEditor
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Describe the event details..."
            height={300}
            disabled={loading}
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={ICON_NAMES.PLAY} className="mr-2 text-gray-400" />
              Start Time *
            </label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={ICON_NAMES.STOP} className="mr-2 text-gray-400" />
              End Time *
            </label>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={ICON_NAMES.LOCATION} className="mr-2 text-gray-400" />
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            placeholder="Enter event location..."
          />
        </div>

        {/* Event Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={ICON_NAMES.IMAGE} className="mr-2 text-gray-400" />
            Event Image
          </label>
          
          {/* Thumbnail Preview */}
          {(existingImageUrl || formData.image?.secure_url) && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <div className="inline-block relative">
                <img
                  src={formData.image?.secure_url || existingImageUrl}
                  alt="Event thumbnail"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                {formData.image?.secure_url && (
                  <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    New
                  </span>
                )}
              </div>
            </div>
          )}
          
          <ImageUpload 
            onUploadSuccess={handleImageUpload}
            onUploadError={(error) => setError(`Image upload failed: ${error}`)}
            folder="events"
            allowLibraryBrowse={true}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload an image to represent this event (optional)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={ICON_NAMES.CLOSE} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={ICON_NAMES.LOADING} spin className="mr-2" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={ICON_NAMES.SAVE} className="mr-2" />
                {isEditing ? 'Update Event' : 'Create Event'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 