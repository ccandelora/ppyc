import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { adminAPI } from '../../services/api';

const PAGE_SIZE = 24;

const normalizeResource = (image) => ({
  url: image.url,
  secure_url: image.url,
  public_id: image.public_id,
  width: image.width,
  height: image.height,
  resource_type: image.resource_type,
  format: image.format,
  created_at: image.created_at,
});

const isImageResource = (resource) => resource?.resource_type !== 'video';

const ImageBrowser = ({ onImageSelect, onClose, selectedImage = null, uploadFolder = 'general' }) => {
  const [images, setImages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const loadPage = useCallback(async (cursor = null, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      const response = await adminAPI.images.getPage(PAGE_SIZE, cursor);
      const data = response?.data?.data;
      if (!data?.resources) throw new Error('Invalid response format from server');
      const list = data.resources.filter(isImageResource).map(normalizeResource);
      setImages((prev) => (append ? [...prev, ...list] : list));
      setNextCursor(data.next_cursor ?? null);
    } catch (err) {
      setError(err.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleUploadFiles = useCallback(async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          continue;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', uploadFolder);
        const response = await adminAPI.images.upload(formData);
        const resource = response?.data?.data;
        if (resource) {
          uploaded.push(normalizeResource(resource));
        }
      }

      if (uploaded.length === 0) {
        setError('No valid image files were uploaded. Please use PNG, JPG, GIF, or WEBP.');
        return;
      }

      setImages((prev) => [...uploaded, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }, [uploadFolder]);

  const handleImageSelect = (image) => {
    const selectedImageData = {
      url: image.url,
      secure_url: image.url,
      public_id: image.public_id,
      width: image.width,
      height: image.height,
      alt: image.public_id.split('/').pop(),
      resource_type: image.resource_type
    };
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
            <FontAwesomeIcon icon="anchor" spin className="text-blue-600 text-2xl mb-4" />
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
              <FontAwesomeIcon icon="images" className="mr-2 text-purple-500" />
              Select Image
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose an image from your media library
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              multiple
              onChange={handleUploadFiles}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
            >
              <FontAwesomeIcon icon={uploading ? 'spinner' : 'cloud-upload-alt'} spin={uploading} className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <FontAwesomeIcon icon="times" className="text-xl" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <FontAwesomeIcon icon="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
            {error}
          </div>
        )}

        {/* Images Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon="images" className="text-gray-400 text-4xl mb-4" />
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
                        <FontAwesomeIcon icon="check" className="text-purple-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected indicator */}
                  {selectedImage?.public_id === image.public_id && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1">
                      <FontAwesomeIcon icon="check" className="text-xs" />
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
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-gray-500">
            {searchTerm
              ? `${filteredImages.length} of ${images.length} shown`
              : `${images.length} loaded${nextCursor ? '+' : ''}`}
          </div>
          <div className="flex items-center space-x-2">
            {nextCursor && !searchTerm && (
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => loadPage(nextCursor, true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            )}
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