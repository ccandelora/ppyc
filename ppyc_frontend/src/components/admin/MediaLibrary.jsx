import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { adminAPI } from '../../services/api';
import { useApiCache } from '../../hooks/useApiCache';
import cloudinaryConfig from '../../config/cloudinary';

const MediaLibrary = () => {
  // State management
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [selectedVideoModal, setSelectedVideoModal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadFolder, setUploadFolder] = useState('');
  const [localError, setLocalError] = useState(null);

  // Refs
  const fileInputRef = useRef(null);

  // Use API cache for fetching images
  const { data: allImages, error: cacheError, isLoading: cacheLoading, refetch } = useApiCache(
    () => adminAPI.images.getAll(),
    'allImages'
  );

  // Filter images based on search and media type
  useEffect(() => {
    if (allImages?.data?.resources) {
      let filtered = [...allImages.data.resources];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(img => 
          img.public_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply media type filter
      if (mediaFilter !== 'all') {
        filtered = filtered.filter(img => 
          mediaFilter === 'videos' ? isVideo(img) : !isVideo(img)
        );
      }
      
      setFilteredImages(filtered);
    } else {
      setFilteredImages([]);
    }
  }, [allImages, searchTerm, mediaFilter]);

  // Error display component
  const ErrorDisplay = () => {
    const error = localError || cacheError;
    if (!error) return null;
    
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message || error}</span>
        {localError && (
          <button
            onClick={() => setLocalError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <FontAwesomeIcon icon="times" />
          </button>
        )}
      </div>
    );
  };

  // Loading display component
  const LoadingDisplay = () => {
    if (!cacheLoading) return null;

    return (
      <div className="flex items-center justify-center p-4">
        <FontAwesomeIcon icon="spinner" spin className="text-blue-500 text-2xl" />
        <span className="ml-2">Loading media...</span>
      </div>
    );
  };

  // Effects
  useEffect(() => {
    console.log('🔄 MediaLibrary mounted');
    console.log('🌐 Current URL:', window.location.href);
    console.log('🍪 Document cookies:', document.cookie);
    console.log('📦 Using cached data approach...');
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedVideoModal(null);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // API Functions - Remove the fetchAllImages function since we're using cache
  const handleImageSelect = (publicId) => {
    setSelectedImages(prev => 
      prev.includes(publicId) 
        ? prev.filter(id => id !== publicId)
        : [...prev, publicId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} selected media file(s)?`)) {
      return;
    }
    
    try {
      for (const publicId of selectedImages) {
        await adminAPI.images.delete(publicId);
      }
      setSuccess(`Successfully deleted ${selectedImages.length} media file(s)`);
      setSelectedImages([]);
      // Refresh the cache after deletion
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      setLocalError(`Failed to delete media files: ${error.message}`);
    }
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    setSuccess('📋 URL copied to clipboard!');
  };

  const getImageFolder = (publicId) => {
    const parts = publicId.split('/');
    return parts.length > 1 ? parts.slice(0, -1).join('/') : 'Root';
  };

  const isVideo = (resource) => {
    return resource.resource_type === 'video' || 
           (resource.format && ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'].includes(resource.format.toLowerCase()));
  };

  const getVideoThumbnail = (publicId) => {
    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/video/upload/w_400,h_300,c_fill,f_jpg/${publicId}.jpg`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Create preview for selected files
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setUploadPreview(previews);
    setShowUploadModal(true);
  };

  const uploadFiles = async () => {
    if (uploadPreview.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadResults = [];
      
      for (let i = 0; i < uploadPreview.length; i++) {
        const preview = uploadPreview[i];
        const formData = new FormData();
        
        // Upload each file individually
        formData.append('file', preview.file);
        formData.append('folder', uploadFolder);
        formData.append('tags', 'ppyc,admin-upload');
        formData.append('context', JSON.stringify({
          source: 'admin-panel',
          uploaded_by: 'admin',
          upload_date: new Date().toISOString()
        }));
        
        try {
          const response = await adminAPI.images.upload(formData);
          
          if (response.data) {
            uploadResults.push(response.data);
            setUploadQueue(prev => [...prev, response.data]);
          }
          
          setUploadProgress(((i + 1) / uploadPreview.length) * 100);
        } catch (fileError) {
          console.error(`Failed to upload ${preview.name}:`, fileError);
          setLocalError(`Failed to upload ${preview.name}: ${fileError.message}`);
        }
      }
      
      if (uploadResults.length > 0) {
        setSuccess(`Successfully uploaded ${uploadResults.length} of ${uploadPreview.length} file(s)`);
        // Invalidate cache and refresh the images list
        refetch();
      }
      
      setShowUploadModal(false);
      setUploadPreview([]);
      
      // Clean up preview URLs
      uploadPreview.forEach(preview => {
        URL.revokeObjectURL(preview.preview);
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      setLocalError('Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removePreview = (index) => {
    setUploadPreview(prev => prev.filter((_, i) => i !== index));
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadPreview([]);
    // Clean up preview URLs
    uploadPreview.forEach(preview => {
      URL.revokeObjectURL(preview.preview);
    });
  };



  if (cacheLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon="anchor" className="fa-spin text-blue-600 text-2xl" />
        <span className="ml-3 text-gray-600">Loading media files...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
              <FontAwesomeIcon icon="images" className="mr-2 text-purple-500" />
              <span className="hidden sm:inline">Media Library</span>
              <span className="sm:hidden">Media</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
              Manage all your images and videos from across your entire Cloudinary account
            </p>
          </div>
          
          {/* Compact Controls */}
          <div className="flex items-center gap-2">
            {/* View Toggle - Compact */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                title="Grid View"
              >
                <FontAwesomeIcon icon="th" className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                title="List View"
              >
                <FontAwesomeIcon icon="list" className="text-sm" />
              </button>
            </div>

            {/* Action Buttons - Icon Only */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                title="Upload Files"
              >
                <FontAwesomeIcon icon="cloud-upload-alt" className="text-sm" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={refetch}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                title="Refresh"
              >
                <FontAwesomeIcon icon="sync-alt" className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon="check-circle" className="mr-2" />
          {success}
        </div>
      )}

      {ErrorDisplay()}
      {LoadingDisplay()}

      {/* Main Content */}
      <div className="p-6">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <FontAwesomeIcon icon="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search media files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          {/* Media Type Filter */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMediaFilter('all')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                mediaFilter === 'all' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="All Media"
            >
              <FontAwesomeIcon icon="layer-group" className="mr-1" />
              All
            </button>
            <button
              onClick={() => setMediaFilter('images')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                mediaFilter === 'images' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Images Only"
            >
              <FontAwesomeIcon icon="image" className="mr-1" />
              Images
            </button>
            <button
              onClick={() => setMediaFilter('videos')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                mediaFilter === 'videos' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Videos Only"
            >
              <FontAwesomeIcon icon="video" className="mr-1" />
              Videos
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                title="Grid View"
              >
                <FontAwesomeIcon icon="th" className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                title="List View"
              >
                <FontAwesomeIcon icon="list" className="text-sm" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              <span className="hidden sm:inline">
                {filteredImages.length} of {allImages?.data?.resources?.length || 0} total
              </span>
              <span className="sm:hidden">
                {filteredImages.length}/{allImages?.data?.resources?.length || 0}
              </span>
              <div className="text-xs text-gray-400 mt-1">
                <span className="mr-2">
                  <FontAwesomeIcon icon="image" className="mr-1" />
                  {allImages?.data?.resources?.filter(f => !isVideo(f))?.length || 0}
                </span>
                <span>
                  <FontAwesomeIcon icon="video" className="mr-1" />
                  {allImages?.data?.resources?.filter(f => isVideo(f))?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedImages.length > 0 && (
          <div className="mb-6 flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedImages.length} file(s) selected
            </span>
            <button
              onClick={handleDeleteSelected}
              className="text-red-600 hover:text-red-800 px-3 py-1 rounded"
            >
              <FontAwesomeIcon icon="trash" className="mr-1" />
              Delete
            </button>
          </div>
        )}

        {/* Media Display */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon="images" className="text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No media files found matching your search' : 'No media files found'}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              This library displays both images and videos from your Cloudinary account
            </p>
            <button
              onClick={refetch}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Refresh Media Library
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.public_id}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImages.includes(image.public_id)
                    ? 'border-purple-500 ring-2 ring-purple-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => handleImageSelect(image.public_id)}
                onDoubleClick={() => {
                  if (isVideo(image)) {
                    // Open video in modal viewer
                    setSelectedVideoModal(image);
                  }
                }}
              >
                <div className="aspect-square relative">
                  {isVideo(image) ? (
                    <>
                      <img
                        src={getVideoThumbnail(image.public_id)}
                        alt={image.public_id}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-70 rounded-full p-3 group-hover:bg-opacity-80 transition-all">
                          <FontAwesomeIcon icon="video" className="text-white text-lg" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        VIDEO
                      </div>
                    </>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.public_id}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                  <div className="absolute top-2 right-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedImages.includes(image.public_id)
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-white bg-white bg-opacity-80'
                    }`}>
                      {selectedImages.includes(image.public_id) && (
                        <FontAwesomeIcon icon="check" className="text-white text-xs" />
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
                      <FontAwesomeIcon icon="copy" className="text-xs" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">
                    {image.public_id.split('/').pop()}
                  </p>
                  <p className="text-white text-xs opacity-75">
                    {isVideo(image) ? (
                      <>
                        {image.duration && formatDuration(image.duration)} • {formatFileSize(image.bytes)}
                        <br />
                        {image.format?.toUpperCase()} Video • {getImageFolder(image.public_id)}
                      </>
                    ) : (
                      <>
                        {image.width} × {image.height} • {getImageFolder(image.public_id)}
                      </>
                    )}
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
                  selectedImages.includes(image.public_id) ? 'bg-purple-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.public_id)}
                  onChange={() => handleImageSelect(image.public_id)}
                  className="rounded border-gray-300 text-purple-600"
                />
                <div className="relative">
                  {isVideo(image) ? (
                    <>
                      <img
                        src={getVideoThumbnail(image.public_id)}
                        alt={image.public_id}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FontAwesomeIcon icon="video" className="text-white text-xs drop-shadow-md" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.public_id}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <span 
                      className={`${isVideo(image) ? 'cursor-pointer hover:text-purple-600' : ''}`}
                      onClick={() => {
                        if (isVideo(image)) {
                          setSelectedVideoModal(image);
                        }
                      }}
                    >
                      {image.public_id.split('/').pop()}
                    </span>
                    {isVideo(image) && (
                      <span className="ml-2 px-1 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                        VIDEO
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isVideo(image) ? (
                      <>
                        {image.duration && formatDuration(image.duration)} • {formatFileSize(image.bytes)} • {image.format?.toUpperCase()}
                      </>
                    ) : (
                      <>
                        {image.width} × {image.height} • {image.format?.toUpperCase()}
                      </>
                    )}
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
                    <FontAwesomeIcon icon="copy" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media Count Display */}
        {allImages?.data?.resources?.length > 0 && (
          <div className="flex items-center justify-center py-6 mt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span>
                Showing {filteredImages.length} of {allImages?.data?.resources?.length} media files
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon="cloud-upload-alt" className="text-green-600 text-xl" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Uploading files...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(uploadProgress)}% complete</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Upload Files</h2>
              <button
                onClick={closeUploadModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon="times" className="text-xl" />
              </button>
            </div>

            {/* Folder Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload to folder:
              </label>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="ppyc/uploads">ppyc/uploads</option>
                <option value="ppyc/events">ppyc/events</option>
                <option value="ppyc/marina">ppyc/marina</option>
                <option value="ppyc/historical">ppyc/historical</option>
                <option value="ppyc/facilities">ppyc/facilities</option>
                <option value="ppyc/activities">ppyc/activities</option>
                <option value="ppyc/people">ppyc/people</option>
                <option value="ppyc/graphics">ppyc/graphics</option>
                <option value="ppyc/nature">ppyc/nature</option>
                <option value="ppyc/seasonal">ppyc/seasonal</option>
                <option value="ppyc/website">ppyc/website</option>
              </select>
            </div>

            {/* File Previews */}
            {uploadPreview.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Files to upload ({uploadPreview.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                  {uploadPreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        {preview.type.startsWith('image/') ? (
                          <img
                            src={preview.preview}
                            alt={preview.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FontAwesomeIcon icon="video" className="text-gray-400 text-2xl" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removePreview(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <FontAwesomeIcon icon="times" className="text-xs" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                        <p className="text-white text-xs truncate">{preview.name}</p>
                        <p className="text-white text-xs opacity-75">
                          {(preview.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Queue Status */}
            {uploadQueue.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Recently uploaded ({uploadQueue.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadQueue.slice(-5).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <FontAwesomeIcon icon="check-circle" className="text-green-500" />
                      <span className="text-gray-700 truncate">{item.public_id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                <FontAwesomeIcon icon="plus" className="mr-1" />
                Add more files
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={closeUploadModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={uploadFiles}
                  disabled={uploadPreview.length === 0 || isUploading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isUploading ? (
                    <>
                      <FontAwesomeIcon icon="spinner" className="fa-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon="cloud-upload-alt" className="mr-2" />
                      Upload {uploadPreview.length} file(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedVideoModal.public_id.split('/').pop()}
              </h2>
              <button
                onClick={() => {
                  setSelectedVideoModal(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon="times" className="text-xl" />
              </button>
            </div>
            
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <video
                src={selectedVideoModal.url}
                controls
                autoPlay
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Duration:</strong> {formatDuration(selectedVideoModal.duration) || 'Unknown'}</p>
              <p><strong>Size:</strong> {formatFileSize(selectedVideoModal.bytes)}</p>
              <p><strong>Format:</strong> {selectedVideoModal.format?.toUpperCase()}</p>
              <p><strong>Folder:</strong> {getImageFolder(selectedVideoModal.public_id)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary; 