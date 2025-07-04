import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { adminAPI } from '../../services/api';
import WYSIWYGEditor from './WYSIWYGEditor';
import ImageUpload from '../ImageUpload';

const SortableSlideItem = ({ slide, onEdit, onDelete, onToggleActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md border-2 ${
        slide.active_status ? 'border-green-200' : 'border-gray-200'
      } hover:shadow-lg transition-shadow`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-grip-vertical text-lg"></i>
            </button>
            <div>
              <h3 className="font-medium text-gray-900">{slide.title}</h3>
              <p className="text-sm text-gray-500">
                {slide.slide_type.replace('_', ' ').toUpperCase()} • Order: {slide.display_order}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleActive(slide.id, !slide.active_status)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                slide.active_status
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {slide.active_status ? 'Active' : 'Inactive'}
            </button>
            
            <button
              onClick={() => onEdit(slide)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <i className="fas fa-edit"></i>
            </button>
            
            <button
              onClick={() => onDelete(slide.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Duration: {slide.duration_seconds}s</p>
          {slide.content && (
            <p className="mt-1 truncate">
              {slide.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SlideBuilder = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slide_type: 'announcement',
    content: '',
    duration_seconds: 8,
    active_status: true,
    image: null
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const slideTemplates = [
    {
      type: 'announcement',
      name: 'Announcement',
      icon: 'fas fa-bullhorn',
      description: 'General announcements and news'
    },
    {
      type: 'event_promo',
      name: 'Event Promotion',
      icon: 'fas fa-calendar-star',
      description: 'Promote upcoming events'
    },
    {
      type: 'photo',
      name: 'Photo Display',
      icon: 'fas fa-image',
      description: 'Showcase photos and images'
    },
    {
      type: 'weather',
      name: 'Weather Info',
      icon: 'fas fa-cloud-sun',
      description: 'Display weather information'
    }
  ];

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.slides.getAll();
      setSlides(response.data || []);
    } catch (err) {
      setError('Failed to load slides');
      console.error('Error fetching slides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = slides.findIndex(slide => slide.id === active.id);
      const newIndex = slides.findIndex(slide => slide.id === over.id);
      
      const newSlides = arrayMove(slides, oldIndex, newIndex);
      
      // Update display_order for all slides
      const updatedSlides = newSlides.map((slide, index) => ({
        ...slide,
        display_order: index + 1
      }));
      
      setSlides(updatedSlides);
      
      try {
        // Update order on server
        await adminAPI.slides.updateOrder(updatedSlides.map(slide => ({
          id: slide.id,
          display_order: slide.display_order
        })));
        
        setSuccess('Slide order updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(`Failed to update slide order: ${err.message || err}`);
        fetchSlides(); // Revert on error
      }
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      slide_type: slide.slide_type || 'announcement',
      content: slide.content || '',
      duration_seconds: slide.duration_seconds || 8,
      active_status: slide.active_status,
      image: null
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      slide_type: 'announcement',
      content: '',
      duration_seconds: 8,
      active_status: true,
      image: null
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key] && formData[key].secure_url) {
          submitData.append('slide[image_url]', formData[key].secure_url);
        } else if (key !== 'image') {
          submitData.append(`slide[${key}]`, formData[key]);
        }
      });

      if (editingSlide) {
        await adminAPI.slides.update(editingSlide.id, submitData);
        setSuccess('Slide updated successfully!');
      } else {
        await adminAPI.slides.create(submitData);
        setSuccess('Slide created successfully!');
      }

      setShowForm(false);
      fetchSlides();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save slide');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;

    try {
      await adminAPI.slides.delete(slideId);
      setSlides(slides.filter(slide => slide.id !== slideId));
      setSuccess('Slide deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to delete slide: ${err.message || err}`);
    }
  };

  const handleToggleActive = async (slideId, active) => {
    try {
      await adminAPI.slides.update(slideId, { slide: { active_status: active } });
      setSlides(slides.map(slide => 
        slide.id === slideId ? { ...slide, active_status: active } : slide
      ));
      setSuccess(`Slide ${active ? 'activated' : 'deactivated'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to update slide status: ${err.message || err}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = (uploadData) => {
    setFormData(prev => ({ ...prev, image: uploadData }));
  };

  if (loading && slides.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                <i className="fas fa-desktop mr-2 text-purple-500"></i>
                TV Slide Builder
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Create and manage slides for your TV display. Drag to reorder.
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              New Slide
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
      </div>

      {/* Slide List with Drag & Drop */}
      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides.map(slide => slide.id)}
            strategy={verticalListSortingStrategy}
          >
            {slides.map((slide) => (
              <SortableSlideItem
                key={slide.id}
                slide={slide}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </SortableContext>
        </DndContext>

        {slides.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <i className="fas fa-desktop text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No slides yet</h3>
            <p className="text-gray-600 mb-4">Create your first slide to get started with the TV display.</p>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <i className="fas fa-plus mr-2"></i>
              Create First Slide
            </button>
          </div>
        )}
      </div>

      {/* Slide Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingSlide ? 'Edit Slide' : 'Create New Slide'}
                </h3>
              </div>

              <div className="px-6 py-4 space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Slide Template
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {slideTemplates.map((template) => (
                      <button
                        key={template.type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, slide_type: template.type }))}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          formData.slide_type === template.type
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <i className={`${template.icon} text-2xl mb-2 ${
                          formData.slide_type === template.type ? 'text-purple-500' : 'text-gray-400'
                        }`}></i>
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter slide title..."
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <WYSIWYGEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Enter slide content..."
                    height={200}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image
                  </label>
                  <ImageUpload 
                    onUploadSuccess={handleImageUpload}
                    onUploadError={(error) => setError(`Image upload failed: ${error}`)}
                    folder="slides"
                    allowLibraryBrowse={true}
                  />
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration_seconds" className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      id="duration_seconds"
                      name="duration_seconds"
                      min="3"
                      max="60"
                      value={formData.duration_seconds}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center mt-8">
                    <input
                      type="checkbox"
                      id="active_status"
                      name="active_status"
                      checked={formData.active_status}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <label htmlFor="active_status" className="text-sm font-medium text-gray-700">
                      Active (show in rotation)
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      {editingSlide ? 'Update' : 'Create'} Slide
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideBuilder; 