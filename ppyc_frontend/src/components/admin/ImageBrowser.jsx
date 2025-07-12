import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const ImageBrowser = ({ onImageSelect, onClose, selectedImage = null }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching images from media library...');
      const response = await adminAPI.images.getAll();
      
      if (!response?.data?.data?.resources) {
        throw new Error('Invalid response format from server');
      }
      
      const images = response.data.data.resources.map(image => ({
        url: image.url,
        secure_url: image.url, // Cloudinary URLs are always secure
        public_id: image.public_id,
        width: image.width,
        height: image.height,
        resource_type: image.resource_type,
        format: image.format,
        created_at: image.created_at
      }));
      
      console.log(`✅ Fetched ${images.length} images successfully`);
      setImages(images);
    } catch (err) {
      console.error('❌ Error fetching images:', err);
      setError(err.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    console.log('🖼️ Image selected:', image);
    const selectedImageData = {
      url: image.url,
      secure_url: image.url,
      public_id: image.public_id,
      width: image.width,
      height: image.height,
      alt: image.public_id.split('/').pop(),
      resource_type: image.resource_type
    };
    console.log('🖼️ Sending image data to parent:', selectedImageData);
    onImageSelect(selectedImageData);
    
    // Add a small delay before closing to ensure the selection is processed
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const filteredImages = images.filter(image => {
    if (!searchTerm) return true;
    return image.public_id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <i className="fas fa-anchor fa-spin text-blue-600 text-2xl mb-4"></i>
            <p className="text-gray-600">Loading images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              <i className="fas fa-images mr-2 text-purple-500"></i>
              Select Image
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose an image from your media library
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}

        {/* Images Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-images text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-500 mb-4">No images found</p>
              <p className="text-sm text-gray-400">
                Upload images to your media library first
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.public_id}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage?.public_id === image.public_id
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleImageSelect(image);
                  }}
                >
                  <div className="aspect-square">
                    <img
                      src={image.url}
                      alt={image.public_id}
                      className="w-full h-full object-cover"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white bg-opacity-90 rounded-full p-2">
                        <i className="fas fa-check text-purple-600"></i>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected indicator */}
                  {selectedImage?.public_id === image.public_id && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1">
                      <i className="fas fa-check text-xs"></i>
                    </div>
                  )}
                  
                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">
                      {image.public_id.split('/').pop()}
                    </p>
                    <p className="text-white text-xs opacity-80">
                      {image.width} × {image.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {filteredImages.length} images available
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {selectedImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onImageSelect(null);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageBrowser; 