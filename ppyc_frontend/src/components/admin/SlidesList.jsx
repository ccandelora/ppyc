import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { adminAPI } from '../../services/api';

const SlidesList = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.slides.getAll();
      setSlides(response.data);
    } catch (err) {
      setError('Failed to fetch slides');
      console.error('Error fetching slides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) {
      return;
    }

    try {
      await adminAPI.slides.delete(slideId);
      setSlides(slides.filter(slide => slide.id !== slideId));
    } catch (err) {
      setError('Failed to delete slide');
      console.error('Error deleting slide:', err);
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      const updatedSlide = { ...slide, active_status: !slide.active_status };
      await adminAPI.slides.update(slide.id, { slide: updatedSlide });
      
      setSlides(slides.map(s => 
        s.id === slide.id ? { ...s, active_status: !s.active_status } : s
      ));
    } catch (err) {
      setError('Failed to update slide status');
      console.error('Error updating slide:', err);
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    const newSlides = [...slides];
    [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
    
    // Update display_order for reordered slides
    const updatedSlides = newSlides.map((slide, idx) => ({
      ...slide,
      display_order: idx + 1
    }));
    
    await reorderSlides(updatedSlides);
  };

  const handleMoveDown = async (index) => {
    if (index === slides.length - 1) return;
    
    const newSlides = [...slides];
    [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    
    // Update display_order for reordered slides
    const updatedSlides = newSlides.map((slide, idx) => ({
      ...slide,
      display_order: idx + 1
    }));
    
    await reorderSlides(updatedSlides);
  };

  const reorderSlides = async (reorderedSlides) => {
    try {
      const slidesData = reorderedSlides.map(slide => ({
        id: slide.id,
        display_order: slide.display_order
      }));
      
      const response = await adminAPI.slides.reorder(slidesData);
      setSlides(response.data);
    } catch (err) {
      setError('Failed to reorder slides');
      console.error('Error reordering slides:', err);
    }
  };

  const getSlideTypeIcon = (type) => {
    switch (type) {
      case 'announcement':
        return 'bullhorn';
      case 'event_promo':
        return 'calendar-alt';
      case 'photo':
        return 'image';
      default:
        return 'desktop';
    }
  };

  const getSlideTypeColor = (type) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800';
      case 'event_promo':
        return 'bg-green-100 text-green-800';
      case 'photo':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <FontAwesomeIcon icon="desktop" className="mr-2 text-blue-500" />
              <span className="hidden sm:inline">TV Slides Management</span>
              <span className="sm:hidden">TV Slides</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1 hidden sm:block">
              Manage slides for the TV display system - drag to reorder
            </p>
          </div>
          <Link 
            to="/admin/slides/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <FontAwesomeIcon icon="plus" />
            <span>New Slide</span>
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

      {/* Slides List */}
      <div className="p-2 sm:p-6">
        {slides.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon icon="desktop" className="text-4xl mb-2 opacity-30" />
            <p>No slides found. Create your first slide!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {slides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`border rounded-lg transition-all ${
                  slide.active_status 
                    ? 'border-gray-200 bg-white' 
                    : 'border-gray-100 bg-gray-50 opacity-75'
                }`}
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="p-3 flex items-start space-x-3">
                    {/* Slide Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {slide.image_url ? (
                        <img 
                          src={slide.image_url} 
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FontAwesomeIcon icon={getSlideTypeIcon(slide.slide_type)} className="text-gray-400 text-2xl" />
                      )}
                    </div>

                    {/* Slide Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col space-y-1">
                        <h3 className="font-medium text-gray-900 truncate">{slide.title}</h3>
                        <span className={`self-start inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSlideTypeColor(slide.slide_type)}`}>
                          <FontAwesomeIcon icon={getSlideTypeIcon(slide.slide_type)} className="mr-1" />
                          {slide.slide_type.replace('_', ' ')}
                        </span>
                      </div>
                      {slide.content && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {slide.content}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Duration: {slide.duration_seconds}s
                      </div>
                    </div>
                  </div>

                  {/* Mobile Controls */}
                  <div className="border-t border-gray-100 p-2 flex items-center justify-between bg-gray-50 rounded-b-lg">
                    <div className="flex items-center space-x-4">
                      {/* Order Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                        >
                          <FontAwesomeIcon icon="chevron-up" className="text-lg" />
                        </button>
                        <span className="text-sm font-medium text-gray-500">
                          {slide.display_order}
                        </span>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === slides.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                        >
                          <FontAwesomeIcon icon="chevron-down" className="text-lg" />
                        </button>
                      </div>

                      {/* Status Toggle */}
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          slide.active_status ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            slide.active_status ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/slides/${slide.id}/edit`}
                        className="p-2 text-blue-500 hover:text-blue-600 touch-manipulation"
                      >
                        <FontAwesomeIcon icon="edit" className="text-lg" />
                      </Link>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="p-2 text-red-500 hover:text-red-600 touch-manipulation"
                      >
                        <FontAwesomeIcon icon="trash" className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center space-x-4 p-4">
                  {/* Order Controls */}
                  <div className="flex flex-col space-y-1 flex-shrink-0">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon="chevron-up" />
                    </button>
                    <span className="text-sm font-semibold text-gray-500 text-center">
                      {slide.display_order}
                    </span>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === slides.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon="chevron-down" />
                    </button>
                  </div>

                  {/* Slide Image */}
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {slide.image_url ? (
                      <img 
                        src={slide.image_url} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FontAwesomeIcon icon={getSlideTypeIcon(slide.slide_type)} className="text-gray-400 text-xl" />
                    )}
                  </div>

                  {/* Slide Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{slide.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSlideTypeColor(slide.slide_type)}`}>
                        <FontAwesomeIcon icon={getSlideTypeIcon(slide.slide_type)} className="mr-1" />
                        {slide.slide_type.replace('_', ' ')}
                      </span>
                    </div>
                    {slide.content && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {slide.content}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {slide.duration_seconds}s
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    {/* Status Toggle */}
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        slide.active_status ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          slide.active_status ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>

                    <Link
                      to={`/admin/slides/${slide.id}/edit`}
                      className="p-2 text-blue-500 hover:text-blue-600"
                    >
                      <FontAwesomeIcon icon="edit" />
                    </Link>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <FontAwesomeIcon icon="trash" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidesList; 