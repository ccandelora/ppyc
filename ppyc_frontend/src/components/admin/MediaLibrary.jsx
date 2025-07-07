import React, { useState, useEffect, useRef } from 'react';
import cloudinaryConfig from '../../config/cloudinary';
import { adminAPI } from '../../services/api';
import { loadScript } from '../../utils/scriptLoader';

const MediaLibrary = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useCloudinaryWidget, setUseCloudinaryWidget] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImageIds, setSelectedImageIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    if (!useCloudinaryWidget) {
      fetchAllImages();
    } else {
      // Load Cloudinary widget with optimized loader
      if (!window.cloudinary) {
        loadScript('https://media-library.cloudinary.com/global/all.js', {
          async: true,
          timeout: 15000
        }).then(() => {
          setIsLoading(false);
          initializeWidget();
        }).catch((error) => {
          console.error('Failed to load Cloudinary widget:', error);
          setError('Failed to load media library widget');
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
        initializeWidget();
      }
    }

    return () => {
      if (widgetRef.current && typeof widgetRef.current.destroy === 'function') {
        try {
          widgetRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying Cloudinary widget:', error);
        }
      }
    };
  }, [useCloudinaryWidget]);

  useEffect(() => {
    // Filter images based on search term
    if (searchTerm.trim()) {
      const filtered = allImages.filter(image =>
        image.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.format?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(allImages);
    }
  }, [searchTerm, allImages]);

  const fetchAllImages = async () => {
    try {
      setIsLoading(true);
      // Fetch images from ALL folders by not specifying a folder parameter
      const response = await adminAPI.images.getAll();
      const images = response.data.data.resources || [];
      setAllImages(images);
      setFilteredImages(images);
    } catch (err) {
      setError('Failed to fetch images');
      console.error('Error fetching images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeWidget = () => {
    if (window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;
      
      widgetRef.current = cloudinaryRef.current.createMediaLibrary({
        cloud_name: cloudinaryConfig.cloudName,
        api_key: cloudinaryConfig.apiKey,
        button_class: 'cloudinary-media-library-button',
        button_caption: 'Open Media Library',
        max_files: 10,
        multiple: true,
        insert_caption: 'Select Images',
        default_transformations: [[]],
        show_upload_more: true,
        show_advanced_search: true,
        show_folders: true,
        folder: {
          path: 'ppyc',
          resource_type: 'image'
        }
      }, {
        insertHandler: (data) => {
          setSelectedImages(data.assets || []);
          console.log('Selected images:', data.assets);
          
          if (window.onCloudinarySelect) {
            window.onCloudinarySelect(data.assets);
          }
        },
        showHandler: () => {
          console.log('Media Library opened');
        },
        hideHandler: () => {
          console.log('Media Library closed');
        }
      });
    }
  };

  const openMediaLibrary = () => {
    if (widgetRef.current) {
      widgetRef.current.show();
    }
  };

  const handleImageSelect = (publicId) => {
    setSelectedImageIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(publicId)) {
        newSet.delete(publicId);
      } else {
        newSet.add(publicId);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedImageIds.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedImageIds.size} image(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedImageIds).map(publicId =>
        adminAPI.images.delete(publicId)
      );
      
      await Promise.all(deletePromises);
      
      setAllImages(prev => prev.filter(img => !selectedImageIds.has(img.public_id)));
      setSelectedImageIds(new Set());
      setSuccess(`Successfully deleted ${selectedImageIds.size} image(s)`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete images');
      console.error('Error deleting images:', err);
    }
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    setSuccess('Image URL copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  const getImageFolder = (publicId) => {
    const parts = publicId.split('/');
    return parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fas fa-anchor fa-spin text-blue-600 text-2xl"></i>
        <span className="ml-3 text-gray-600">
          {useCloudinaryWidget ? 'Loading Cloudinary Media Library...' : 'Loading images...'}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              <i className="fas fa-images mr-2 text-purple-500"></i>
              Media Library
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage all your images from across your entire Cloudinary account
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUseCloudinaryWidget(false)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  !useCloudinaryWidget 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Custom View
              </button>
              <button
                onClick={() => setUseCloudinaryWidget(true)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  useCloudinaryWidget 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Cloudinary Widget
              </button>
            </div>

            {useCloudinaryWidget ? (
              <button
                onClick={openMediaLibrary}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <i className="fas fa-folder-open mr-2"></i>
                Open Media Library
              </button>
            ) : (
              <button
                onClick={fetchAllImages}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <i className="fas fa-check-circle mr-2"></i>
          {success}
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {useCloudinaryWidget ? (
          // Cloudinary Widget View
          <>
            {/* Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <i className="fas fa-search text-purple-500 text-2xl mb-2"></i>
                <h3 className="font-semibold text-gray-800 mb-1">Advanced Search</h3>
                <p className="text-sm text-gray-600">Search across all images, folders, and metadata</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <i className="fas fa-folder text-purple-500 text-2xl mb-2"></i>
                <h3 className="font-semibold text-gray-800 mb-1">Folder Management</h3>
                <p className="text-sm text-gray-600">Organize images in folders and collections</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <i className="fas fa-cloud-upload-alt text-purple-500 text-2xl mb-2"></i>
                <h3 className="font-semibold text-gray-800 mb-1">Upload & Transform</h3>
                <p className="text-sm text-gray-600">Upload images and apply transformations</p>
              </div>
            </div>

            {/* Selected Images from Widget */}
            {selectedImages.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Selected Images ({selectedImages.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  {selectedImages.map((asset, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={asset.secure_url}
                          alt={asset.public_id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg">
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => copyImageUrl(asset.secure_url)}
                            className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 transition-all"
                            title="Copy URL"
                          >
                            <i className="fas fa-copy text-xs"></i>
                          </button>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                        <p className="text-white text-xs truncate">
                          {asset.public_id.split('/').pop()}
                        </p>
                        <p className="text-white text-xs opacity-75">
                          {asset.width} × {asset.height}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedImages([])}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  <i className="fas fa-times mr-1"></i>
                  Clear Selection
                </button>
              </div>
            )}

            {/* Widget Instructions */}
            {selectedImages.length === 0 && (
              <div className="text-center py-12">
                <i className="fas fa-images text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Access Your Complete Media Library
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Click "Open Media Library" to browse, search, upload, and manage all your images 
                  with Cloudinary's professional interface. This shows images from all folders in your account.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• View all images across all folders</p>
                  <p>• Advanced search and filtering</p>
                  <p>• Upload multiple images with drag & drop</p>
                  <p>• Automatic duplicate detection</p>
                  <p>• Professional image transformations</p>
                </div>
              </div>
            )}
          </>
        ) : (
          // Custom View
          <>
            {/* Search and Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {filteredImages.length} of {allImages.length} images
                </span>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedImageIds.size > 0 && (
              <div className="mb-6 flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-700">
                  {selectedImageIds.size} image(s) selected
                </span>
                <button
                  onClick={handleDeleteSelected}
                  className="text-red-600 hover:text-red-800 px-3 py-1 rounded"
                >
                  <i className="fas fa-trash mr-1"></i>
                  Delete
                </button>
              </div>
            )}

            {/* Images Display */}
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-images text-gray-400 text-4xl mb-4"></i>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No images found matching your search' : 'No images found'}
                </p>
                <button
                  onClick={fetchAllImages}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Refresh Images
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.public_id}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIds.has(image.public_id)
                        ? 'border-purple-500 ring-2 ring-purple-200'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(image.public_id)}
                  >
                    <div className="aspect-square">
                      <img
                        src={image.url}
                        alt={image.public_id}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                      <div className="absolute top-2 right-2">
                        <div className={`w-4 h-4 rounded border-2 ${
                          selectedImageIds.has(image.public_id)
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-white bg-white bg-opacity-80'
                        }`}>
                          {selectedImageIds.has(image.public_id) && (
                            <i className="fas fa-check text-white text-xs"></i>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-2 left-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyImageUrl(image.url);
                          }}
                          className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 transition-all"
                          title="Copy URL"
                        >
                          <i className="fas fa-copy text-xs"></i>
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs truncate">
                        {image.public_id.split('/').pop()}
                      </p>
                      <p className="text-white text-xs opacity-75">
                        {image.width} × {image.height} • {getImageFolder(image.public_id)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredImages.map((image) => (
                  <div
                    key={image.public_id}
                    className={`flex items-center space-x-4 p-3 rounded hover:bg-gray-50 ${
                      selectedImageIds.has(image.public_id) ? 'bg-purple-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedImageIds.has(image.public_id)}
                      onChange={() => handleImageSelect(image.public_id)}
                      className="rounded border-gray-300 text-purple-600"
                    />
                    <img
                      src={image.url}
                      alt={image.public_id}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {image.public_id.split('/').pop()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {image.width} × {image.height} • {image.format?.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Folder: {getImageFolder(image.public_id)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyImageUrl(image.url);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Copy URL"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary; 