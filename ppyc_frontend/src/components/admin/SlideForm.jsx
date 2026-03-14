import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageUpload from '../ImageUpload';
import WYSIWYGEditor from './WYSIWYGEditor';
import { adminAPI } from '../../services/api';
import { logError } from '../../utils/safeLogger';
import { ICON_NAMES } from '../../config/fontawesome';

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
    weather_type: 'forecast',
    background_video: null,
    background_tint_color: '#000000',
    background_tint_opacity: 0.5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const slideTypes = [
    { value: 'announcement', label: 'Announcement', icon: ICON_NAMES.ANNOUNCEMENT, color: 'text-blue-600', description: 'General announcements and news' },
    { value: 'event_promo', label: 'Event Promotion', icon: ICON_NAMES.CALENDAR_ALT, color: 'text-green-600', description: 'Promote upcoming events' },
    { value: 'photo', label: 'Photo Slide', icon: ICON_NAMES.IMAGE, color: 'text-purple-600', description: 'Display photos with optional text' },
    { value: 'weather', label: 'Weather Display', icon: ICON_NAMES.CLOUD_SUN, color: 'text-orange-600', description: 'Show 3-day weather forecast' }
  ];

  useEffect(() => {
    if (!isEditing) return;
    const controller = new AbortController();
    let cancelled = false;

    const fetchSlide = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.slides.getById(id, { signal: controller.signal });
        if (cancelled) return;
        const slide = response.data;
        setFormData({
          title: slide.title || '',
          slide_type: slide.slide_type || 'announcement',
          content: slide.content || '',
          duration_seconds: slide.duration_seconds || 60,
          active_status: slide.active_status !== undefined ? slide.active_status : true,
          image: slide.image_url ? { secure_url: slide.image_url } : null,
          location: slide.location || '',
          weather_type: 'forecast',
          background_video: slide.background_video_url ? { secure_url: slide.background_video_url } : null,
          background_tint_color: slide.background_tint_color || '#000000',
          background_tint_opacity: slide.background_tint_opacity !== undefined ? slide.background_tint_opacity : 0.5
        });
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          setError('Failed to fetch slide');
          logError('Error fetching slide:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSlide();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id, isEditing]);

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
    if (!uploadData) {
      setFormData(prev => ({
        ...prev,
        image: null
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      image: {
        secure_url: uploadData.secure_url || uploadData.url,
        public_id: uploadData.public_id,
        width: uploadData.width,
        height: uploadData.height,
        alt: uploadData.alt || uploadData.public_id.split('/').pop()
      }
    }));
    
    // Show success message
    setSuccess('Image selected successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleBackgroundVideoUpload = (uploadData) => {
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
    e.stopPropagation(); // Prevent event bubbling
    
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
      
      // Add image if selected
      if (formData.image && (formData.image.secure_url || formData.image.url)) {
        formDataToSend.append('slide[image_url]', formData.image.secure_url || formData.image.url);
        if (formData.image.public_id) {
          formDataToSend.append('slide[image_public_id]', formData.image.public_id);
        }
      }

      if (formData.background_video && formData.background_video.secure_url) {
        formDataToSend.append('slide[background_video_url]', formData.background_video.secure_url);
      }

      // Add background tint settings
      if (formData.background_tint_color) {
        formDataToSend.append('slide[background_tint_color]', formData.background_tint_color);
      }
      if (formData.background_tint_opacity !== undefined) {
        formDataToSend.append('slide[background_tint_opacity]', formData.background_tint_opacity);
      }

      // Add weather-specific fields
      if (formData.slide_type === 'weather') {
        formDataToSend.append('slide[location]', formData.location || '');
        formDataToSend.append('slide[weather_type]', 'forecast');
      }

      // Save the slide
      if (isEditing) {
        await adminAPI.slides.update(id, formDataToSend);
      } else {
        await adminAPI.slides.create(formDataToSend);
      }

      // Show success message
      setSuccess('Slide saved successfully!');
      setLoading(false);

      // Wait for success message to be shown before navigating
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/admin/slides');
    } catch (err) {
      logError('Error saving slide:', err);
      setError(err.response?.data?.message || 'Failed to save slide');
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
        <FontAwesomeIcon icon={ICON_NAMES.LOADING} spin className="text-3xl text-blue-500" />
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
              <FontAwesomeIcon icon={ICON_NAMES.EDIT} className="mr-2 text-blue-500" />
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

      {/* Image Upload Section - Outside Form */}
      <div className="p-6 border-b border-gray-200">
        <div>
          <label htmlFor="slide_image" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={ICON_NAMES.IMAGE} className="mr-2 text-gray-400" />
            Slide Image {formData.slide_type === 'photo' && <span className="text-red-500">*</span>}
          </label>
          <div id="slide_image">
            {formData.image && formData.image.secure_url ? (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={ICON_NAMES.IMAGE} className="text-blue-600 mr-2" />
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
                    <FontAwesomeIcon icon={ICON_NAMES.CLOSE} />
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
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.slide_type === 'photo' 
              ? 'Image is required for photo slides'
              : 'Optional: Add a background image for your slide'
            }
          </p>
        </div>
      </div>

      {/* Background Video Upload Section - Outside Form */}
      <div className="p-6 border-b border-gray-200">
        <div>
          <label htmlFor="background_video" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={ICON_NAMES.VIDEO} className="mr-2 text-gray-400" />
            Background Video
          </label>
          <div id="background_video">
            {formData.background_video && formData.background_video.secure_url ? (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={ICON_NAMES.VIDEO} className="text-green-600 mr-2" />
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
                    <FontAwesomeIcon icon={ICON_NAMES.CLOSE} />
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
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Optional: Add a background video for your slide (will override the default video backgrounds)
          </p>
        </div>
      </div>

      {/* Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(e);
        }}
        className="p-6 space-y-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={ICON_NAMES.HEADING} className="mr-2 text-gray-400" />
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="Enter slide title..."
          />
        </div>

        {/* Slide Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <FontAwesomeIcon icon={ICON_NAMES.LAYER_GROUP} className="mr-2 text-gray-400" />
            Slide Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {slideTypes.map((type) => (
              <div key={type.value}>
                <input
                  type="radio"
                  id={`slide_type_${type.value}`}
                  name="slide_type"
                  value={type.value}
                  checked={formData.slide_type === type.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <label
                  htmlFor={`slide_type_${type.value}`}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.slide_type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <FontAwesomeIcon icon={type.icon} className={`${type.color} text-2xl mb-2`} />
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
              <label htmlFor="weather_location" className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={ICON_NAMES.LOCATION} className="mr-2 text-gray-400" />
                Location *
              </label>
              <input
                type="text"
                id="weather_location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required={formData.slide_type === 'weather'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Boston, MA or 42.3601,-71.0589"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter city name, ZIP code, or coordinates
              </p>
            </div>

            <p className="text-sm text-gray-600">
              <FontAwesomeIcon icon={ICON_NAMES.CLOUD_SUN} className="mr-2 text-gray-400" />
              3-day forecast for the location below
            </p>
          </div>
        )}

        {/* Background Tint Color */}
        <div>
          <label htmlFor="background_tint_color" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon="palette" className="mr-2 text-gray-400" />
            Background Tint Color
          </label>
          <input
            type="color"
            id="background_tint_color"
            name="background_tint_color"
            value={formData.background_tint_color}
            onChange={handleInputChange}
            className="h-10 w-20"
          />
        </div>

        {/* Background Tint Opacity */}
        <div>
          <label htmlFor="background_tint_opacity" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon="adjust" className="mr-2 text-gray-400" />
            Background Tint Opacity
          </label>
          <input
            type="range"
            id="background_tint_opacity"
            name="background_tint_opacity"
            min="0"
            max="1"
            step="0.1"
            value={formData.background_tint_opacity}
            onChange={handleInputChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Transparent</span>
            <span>Solid</span>
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={ICON_NAMES.ALIGN_LEFT} className="mr-2 text-gray-400" />
            Content {formData.slide_type === 'announcement' && <span className="text-red-500">*</span>}
          </label>
          <WYSIWYGEditor
            key={`slide-editor-${id ?? 'new'}`}
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
              <FontAwesomeIcon icon={ICON_NAMES.CLOCK} className="mr-2 text-gray-400" />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              How long to display this slide (5-300 seconds)
            </p>
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon="toggle-on" className="mr-2 text-gray-400" />
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
              <FontAwesomeIcon icon="eye" className="mr-2 text-gray-400" />
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
                  <FontAwesomeIcon icon={getSelectedSlideType()?.icon} className="mr-2" />
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
                  <FontAwesomeIcon icon={ICON_NAMES.VIDEO} className="mr-1" />
                  Background Video
                </span>
              )}
              {formData.image && formData.image.secure_url && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  <FontAwesomeIcon icon={ICON_NAMES.IMAGE} className="mr-1" />
                  Background Image
                </span>
              )}
              {formData.background_tint_opacity > 0 && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  <FontAwesomeIcon icon="palette" className="mr-1" />
                  Tint: {Math.round(formData.background_tint_opacity * 100)}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCancel();
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={ICON_NAMES.LOADING} spin className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={ICON_NAMES.SAVE} className="mr-2" />
                Save Slide
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SlideForm; 