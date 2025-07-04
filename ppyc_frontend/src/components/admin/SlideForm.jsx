import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUpload from '../ImageUpload';
import WYSIWYGEditor from './WYSIWYGEditor';
import { adminAPI } from '../../services/api';

const SlideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slide_type: 'announcement',
    content: '',
    duration_seconds: 60,
    active_status: true,
    image: null,
    location: '',
    weather_type: 'current',
    background_video: null,
    background_tint_color: '#000000',
    background_tint_opacity: 0.5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const slideTypes = [
    { 
      value: 'announcement', 
      label: 'Announcement', 
      icon: 'fas fa-bullhorn',
      description: 'General announcements and news',
      color: 'text-blue-600'
    },
    { 
      value: 'event_promo', 
      label: 'Event Promotion', 
      icon: 'fas fa-calendar-alt',
      description: 'Promote upcoming events',
      color: 'text-green-600'
    },
    { 
      value: 'photo', 
      label: 'Photo Slide', 
      icon: 'fas fa-image',
      description: 'Display photos with optional text',
      color: 'text-purple-600'
    },
    { 
      value: 'weather', 
      label: 'Weather Display', 
      icon: 'fas fa-cloud-sun',
      description: 'Show current weather and marine conditions',
      color: 'text-orange-600'
    }
  ];

  useEffect(() => {
    if (isEditing) {
      fetchSlide();
    }
  }, [id, isEditing]);

  const fetchSlide = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.slides.getById(id);
      const slide = response.data;
      
      setFormData({
        title: slide.title || '',
        slide_type: slide.slide_type || 'announcement',
        content: slide.content || '',
        duration_seconds: slide.duration_seconds || 60,
        active_status: slide.active_status !== undefined ? slide.active_status : true,
        image: slide.image_url ? { secure_url: slide.image_url } : null, // Load existing image
        location: slide.location || '',
        weather_type: slide.weather_type || 'current',
        background_video: slide.background_video_url ? { secure_url: slide.background_video_url } : null, // Load existing video
        background_tint_color: slide.background_tint_color || '#000000',
        background_tint_opacity: slide.background_tint_opacity !== undefined ? slide.background_tint_opacity : 0.5
      });
    } catch (err) {
      setError('Failed to fetch slide');
      console.error('Error fetching slide:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handleImageUpload = (uploadData) => {
    setFormData(prev => ({
      ...prev,
      image: uploadData // This will contain the Cloudinary upload response
    }));
  };

  const handleBackgroundVideoUpload = (uploadData) => {
    console.log('🎥 Background video upload success:', uploadData);
    console.log('🎥 Video URL:', uploadData?.url || uploadData?.secure_url);
    setFormData(prev => ({
      ...prev,
      background_video: uploadData // This will contain the Cloudinary upload response
    }));
    
    // Show success message
    setSuccess('✅ Video uploaded successfully! You can now save the slide.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('slide[title]', formData.title);
      formDataToSend.append('slide[slide_type]', formData.slide_type);
      formDataToSend.append('slide[content]', formData.content || '');
      formDataToSend.append('slide[duration_seconds]', formData.duration_seconds);
      formDataToSend.append('slide[active_status]', formData.active_status);
      
      if (formData.image && formData.image.secure_url) {
        formDataToSend.append('slide[image_url]', formData.image.secure_url);
      }

      // Add background video and tint fields
      console.log('Form data before submission:', formData);
      if (formData.background_video && formData.background_video.secure_url) {
        console.log('🎥 Adding background video URL:', formData.background_video.secure_url);
        formDataToSend.append('slide[background_video_url]', formData.background_video.secure_url);
      } else {
        console.log('⚠️ No background video to add:', formData.background_video);
      }
      if (formData.background_tint_color) {
        console.log('🎨 Adding background tint color:', formData.background_tint_color);
        formDataToSend.append('slide[background_tint_color]', formData.background_tint_color);
      }
      if (formData.background_tint_opacity !== undefined && formData.background_tint_opacity !== null) {
        console.log('🌫️ Adding background tint opacity:', formData.background_tint_opacity);
        formDataToSend.append('slide[background_tint_opacity]', parseFloat(formData.background_tint_opacity));
      }

      // Add weather-specific fields
      if (formData.slide_type === 'weather') {
        formDataToSend.append('slide[location]', formData.location || '');
        formDataToSend.append('slide[weather_type]', formData.weather_type || 'current');
      }

      // Debug: Log all form data being sent
      console.log('📋 Complete FormData being sent:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      if (isEditing) {
        await adminAPI.slides.update(id, formDataToSend);
      } else {
        await adminAPI.slides.create(formDataToSend);
      }

      setSuccess(`Slide ${isEditing ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        navigate('/admin/slides');
      }, 2000);
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} slide`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/slides');
  };

  const getSelectedSlideType = () => {
    return slideTypes.find(type => type.value === formData.slide_type);
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
              <i className="fas fa-edit mr-2 text-blue-500"></i>
              {isEditing ? 'Edit Slide' : 'Create New Slide'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing ? 'Update your TV display slide' : 'Create a new slide for the TV display'}
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
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter slide title..."
          />
        </div>

        {/* Slide Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <i className="fas fa-layer-group mr-2 text-gray-400"></i>
            Slide Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {slideTypes.map((type) => (
              <div key={type.value}>
                <input
                  type="radio"
                  id={type.value}
                  name="slide_type"
                  value={type.value}
                  checked={formData.slide_type === type.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <label
                  htmlFor={type.value}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.slide_type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <i className={`${type.icon} ${type.color} text-2xl mb-2`}></i>
                    <h3 className="font-medium text-gray-900">{type.label}</h3>
                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Weather-specific fields */}
        {formData.slide_type === 'weather' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required={formData.slide_type === 'weather'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Boston, MA or 42.3601,-71.0589"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter city name, ZIP code, or coordinates
              </p>
            </div>

            <div>
              <label htmlFor="weather_type" className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-thermometer-half mr-2 text-gray-400"></i>
                Weather Display Type
              </label>
              <select
                id="weather_type"
                name="weather_type"
                value={formData.weather_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current">Current Weather & Marine</option>
                <option value="forecast">3-Day Forecast</option>
                <option value="marine">Marine Conditions</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose what weather information to display
              </p>
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-image mr-2 text-gray-400"></i>
            Slide Image {formData.slide_type === 'photo' && <span className="text-red-500">*</span>}
          </label>
          {formData.image && formData.image.secure_url ? (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <i className="fas fa-image text-blue-600 mr-2"></i>
                  <span className="text-blue-700 font-medium">
                    {isEditing ? 'Current slide image' : 'Slide image uploaded'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Remove slide image"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              {/* Image Preview */}
              <div className="mb-3">
                <img
                  src={formData.image.secure_url}
                  alt="Slide preview"
                  className="w-full h-32 object-cover rounded border border-blue-200"
                />
              </div>
              
              <p className="text-xs text-blue-600 mt-1 truncate">
                {formData.image.secure_url}
              </p>
              
              {isEditing && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600 mb-2">Replace with a new image:</p>
                  <ImageUpload 
                    onUploadSuccess={handleImageUpload}
                    onUploadError={(error) => setError(`Image upload failed: ${error}`)}
                    folder="slides"
                    allowLibraryBrowse={true}
                  />
                </div>
              )}
            </div>
          ) : (
            <ImageUpload 
              onUploadSuccess={handleImageUpload}
              onUploadError={(error) => setError(`Image upload failed: ${error}`)}
              folder="slides"
              allowLibraryBrowse={true}
            />
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.slide_type === 'photo' 
              ? 'Image is required for photo slides'
              : 'Optional: Add a background image for your slide'
            }
          </p>
        </div>

        {/* Background Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-video mr-2 text-gray-400"></i>
            Background Video
          </label>
          {formData.background_video && formData.background_video.secure_url ? (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <i className="fas fa-video text-green-600 mr-2"></i>
                  <span className="text-green-700 font-medium">
                    {isEditing ? 'Current background video' : 'Background video uploaded'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, background_video: null }))}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Remove background video"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              {/* Video Preview */}
              <div className="mb-3">
                <video
                  src={formData.background_video.secure_url}
                  className="w-full h-32 object-cover rounded border border-green-200"
                  controls
                  muted
                />
              </div>
              
              <p className="text-xs text-green-600 mt-1 truncate">
                {formData.background_video.secure_url}
              </p>
              
              {isEditing && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-xs text-gray-600 mb-2">Replace with a new video:</p>
                  <ImageUpload 
                    onUploadSuccess={handleBackgroundVideoUpload}
                    onUploadError={(error) => setError(`Background video upload failed: ${error}`)}
                    folder="slides/videos"
                    allowLibraryBrowse={true}
                    acceptTypes="video/*"
                  />
                </div>
              )}
            </div>
          ) : (
            <ImageUpload 
              onUploadSuccess={handleBackgroundVideoUpload}
              onUploadError={(error) => setError(`Background video upload failed: ${error}`)}
              folder="slides/videos"
              allowLibraryBrowse={true}
              acceptTypes="video/*"
            />
          )}
          <p className="text-xs text-gray-500 mt-1">
            Optional: Add a background video for your slide (will override the default video backgrounds)
          </p>
        </div>

        {/* Background Tint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <i className="fas fa-palette mr-2 text-gray-400"></i>
            Background Tint
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="background_tint_color" className="block text-sm font-medium text-gray-700 mb-2">
                Tint Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="background_tint_color"
                  name="background_tint_color"
                  value={formData.background_tint_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.background_tint_color}
                  onChange={handleInputChange}
                  name="background_tint_color"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Color overlay for the background
              </p>
            </div>

            <div>
              <label htmlFor="background_tint_opacity" className="block text-sm font-medium text-gray-700 mb-2">
                Tint Opacity
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  id="background_tint_opacity"
                  name="background_tint_opacity"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.background_tint_opacity}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 font-medium min-w-[3rem]">
                  {Math.round(formData.background_tint_opacity * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Opacity of the color overlay (0% = transparent, 100% = opaque)
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-align-left mr-2 text-gray-400"></i>
            Content {formData.slide_type === 'announcement' && <span className="text-red-500">*</span>}
          </label>
          <WYSIWYGEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder={
              formData.slide_type === 'announcement' 
                ? 'Enter your announcement text...'
                : formData.slide_type === 'event_promo'
                ? 'Enter event details...'
                : 'Optional caption for the photo...'
            }
            height={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.slide_type === 'announcement' && 'Main text content for the announcement'}
            {formData.slide_type === 'event_promo' && 'Event description and details'}
            {formData.slide_type === 'photo' && 'Optional caption or description for the photo'}
          </p>
        </div>

        {/* Duration and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <div>
            <label htmlFor="duration_seconds" className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-clock mr-2 text-gray-400"></i>
              Display Duration (seconds) *
            </label>
            <input
              type="number"
              id="duration_seconds"
              name="duration_seconds"
              value={formData.duration_seconds}
              onChange={handleInputChange}
              min="5"
              max="300"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              How long to display this slide (5-300 seconds)
            </p>
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-toggle-on mr-2 text-gray-400"></i>
              Status
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active_status"
                name="active_status"
                checked={formData.active_status}
                onChange={handleInputChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, active_status: !prev.active_status }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.active_status ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.active_status ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm text-gray-700">
                {formData.active_status ? 'Active (will appear in slideshow)' : 'Inactive (hidden from slideshow)'}
              </span>
            </div>
          </div>
        </div>

        {/* Preview */}
        {formData.title && (
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              <i className="fas fa-eye mr-2 text-gray-400"></i>
              Preview
            </h4>
            <div className="bg-gray-900 text-white p-6 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              {/* Background Video */}
              {formData.background_video && formData.background_video.secure_url && (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={formData.background_video.secure_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}

              {/* Background Image (if no video) */}
              {!formData.background_video && formData.image && formData.image.secure_url && (
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  src={formData.image.secure_url}
                  alt="Background"
                />
              )}

              {/* Tint Overlay */}
              {(formData.background_tint_color && formData.background_tint_opacity > 0) && (
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: formData.background_tint_color,
                    opacity: formData.background_tint_opacity
                  }}
                />
              )}

              {/* Content */}
              <div className="text-center z-10 relative">
                <div className="flex items-center justify-center mb-2">
                  <i className={`${getSelectedSlideType()?.icon} mr-2`}></i>
                  <span className="text-xs uppercase tracking-wider opacity-75">
                    {getSelectedSlideType()?.label}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{formData.title}</h3>
                {formData.content && (
                  <div 
                    className="text-lg opacity-90 prose prose-invert prose-sm max-w-none drop-shadow-lg"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                )}
                <div className="text-xs opacity-60 mt-4 drop-shadow">
                  Duration: {formData.duration_seconds}s
                </div>
              </div>
            </div>

            {/* Preview Info */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
              {formData.background_video && formData.background_video.secure_url && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  <i className="fas fa-video mr-1"></i>
                  Background Video
                </span>
              )}
              {formData.image && formData.image.secure_url && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  <i className="fas fa-image mr-1"></i>
                  Background Image
                </span>
              )}
              {formData.background_tint_opacity > 0 && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  <i className="fas fa-palette mr-1"></i>
                  Tint: {Math.round(formData.background_tint_opacity * 100)}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || !formData.title.trim() || (formData.slide_type === 'announcement' && !formData.content.trim())}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>{isEditing ? 'Update Slide' : 'Create Slide'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SlideForm; 