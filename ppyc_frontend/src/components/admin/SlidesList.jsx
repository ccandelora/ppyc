import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        return 'fas fa-bullhorn';
      case 'event_promo':
        return 'fas fa-calendar-alt';
      case 'photo':
        return 'fas fa-image';
      default:
        return 'fas fa-desktop';
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
        <i className="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              <i className="fas fa-desktop mr-2 text-blue-500"></i>
              TV Slides Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage slides for the TV display system - drag to reorder
            </p>
          </div>
          <Link 
            to="/admin/slides/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <i className="fas fa-plus"></i>
            <span>New Slide</span>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {/* Slides List */}
      <div className="p-6">
        {slides.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-desktop text-4xl mb-2 opacity-30"></i>
            <p>No slides found. Create your first slide!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`border rounded-lg p-4 transition-all ${
                  slide.active_status 
                    ? 'border-gray-200 bg-white' 
                    : 'border-gray-100 bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Order Controls */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-up"></i>
                    </button>
                    <span className="text-sm font-semibold text-gray-500 text-center">
                      {slide.display_order}
                    </span>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === slides.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-down"></i>
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
                      <i className={`${getSlideTypeIcon(slide.slide_type)} text-gray-400 text-xl`}></i>
                    )}
                  </div>

                  {/* Slide Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{slide.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSlideTypeColor(slide.slide_type)}`}>
                        <i className={`${getSlideTypeIcon(slide.slide_type)} mr-1`}></i>
                        {slide.slide_type.replace('_', ' ')}
                      </span>
                    </div>
                    {slide.content && (
                      <p className="text-sm text-gray-600 truncate">
                        {slide.content.length > 100 
                          ? `${slide.content.substring(0, 100)}...` 
                          : slide.content
                        }
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {slide.duration_seconds}s
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center">
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
                    <span className="ml-2 text-sm text-gray-600">
                      {slide.active_status ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/slides/${slide.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Delete
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