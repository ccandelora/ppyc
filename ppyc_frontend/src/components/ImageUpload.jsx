import React, { useState, useCallback } from 'react';
import ImageBrowser from './admin/ImageBrowser';

const ImageUpload = ({ onUploadSuccess, onUploadError, folder = 'general', allowLibraryBrowse = true, acceptTypes = 'image/*' }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const uploadToCloudinary = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `ppyc/${folder}`);
    
    console.log('🚀 Starting upload for:', file.name, 'Type:', file.type);
    
    // Send to our backend which handles the secure upload
    try {
      const response = await fetch('/api/v1/admin/images', {
        method: 'POST',
        body: formData,
        credentials: 'include', // For authentication
      });

      const result = await response.json();
      console.log('📤 Upload response:', result);
      
      if (result.success) {
        console.log('✅ Upload successful, calling onUploadSuccess with:', result.data);
        onUploadSuccess?.(result.data);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      onUploadError?.(error.message);
    }
  }, [folder, onUploadSuccess, onUploadError]);

  const handleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      // Upload files one by one
      for (const file of files) {
        const isValidType = acceptTypes === 'video/*' 
          ? file.type.startsWith('video/')
          : acceptTypes === 'image/*'
          ? file.type.startsWith('image/')
          : file.type.match(acceptTypes);
        
        if (!isValidType) {
          console.warn(`⚠️ Skipping invalid file type: ${file.type}`);
          continue;
        }

        // Check file size limits (100MB for videos, 10MB for images)
        const maxSize = acceptTypes === 'video/*' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB or 10MB in bytes
        const maxSizeMB = acceptTypes === 'video/*' ? 100 : 10;
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        
        if (file.size > maxSize) {
          const errorMessage = `File "${file.name}" (${fileSizeMB}MB) exceeds the ${maxSizeMB}MB limit for ${acceptTypes === 'video/*' ? 'videos' : 'images'}`;
          console.error(`❌ ${errorMessage}`);
          onUploadError?.(errorMessage);
          continue;
        }

        console.log(`✅ File size OK: ${file.name} (${fileSizeMB}MB)`);
        await uploadToCloudinary(file);
      }
    } finally {
      setUploading(false);
    }
  }, [uploadToCloudinary, acceptTypes, onUploadError]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleImageSelect = useCallback((imageData) => {
    if (!imageData) {
      console.log('❌ No image data received');
      return;
    }
    
    console.log('🖼️ Image selected:', imageData);
    
    // Normalize the image data
    const normalizedImageData = {
      url: imageData.url || imageData.secure_url,
      secure_url: imageData.secure_url || imageData.url,
      public_id: imageData.public_id,
      width: imageData.width,
      height: imageData.height,
      alt: imageData.alt || imageData.public_id.split('/').pop()
    };
    
    console.log('🖼️ Setting normalized image data:', normalizedImageData);
    
    // Update local state first
    setSelectedImage(normalizedImageData);
    
    // Then notify parent component
    console.log('🖼️ Notifying parent component with image data');
    onUploadSuccess?.(normalizedImageData);
    
    // Finally close the browser
    console.log('🖼️ Closing image browser');
    setShowBrowser(false);
  }, [onUploadSuccess]);

  const handleRemoveSelected = useCallback(() => {
    setSelectedImage(null);
    onUploadSuccess?.(null);
  }, [onUploadSuccess]);

  // If an image is selected, show the preview
  if (selectedImage) {
    return (
      <div className="w-full">
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Selected Image</h3>
            <button
              onClick={handleRemoveSelected}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              <i className="fas fa-times mr-1"></i>
              Remove
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{selectedImage.alt}</p>
              <p className="text-xs text-gray-500">
                {selectedImage.width} × {selectedImage.height}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBrowser(true);
            }}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <i className="fas fa-images mr-2"></i>
            Browse Library
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedImage(null);
            }}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <i className="fas fa-cloud-upload-alt mr-2"></i>
            Upload New
          </button>
        </div>
        
        {showBrowser && (
          <ImageBrowser
            onImageSelect={handleImageSelect}
            onClose={() => setShowBrowser(false)}
            selectedImage={selectedImage}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center
          transition-colors duration-200 ease-in-out
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptTypes}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          {uploading ? (
            <div className="text-blue-600">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              Uploading...
            </div>
          ) : (
            <>
              <p className="text-gray-600">
                <span className="font-medium text-blue-600 cursor-pointer">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                {acceptTypes === 'video/*' 
                  ? 'MP4, MOV, AVI up to 100MB' 
                  : 'PNG, JPG, GIF up to 10MB'
                }
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Browse Library Button */}
      {allowLibraryBrowse && !uploading && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBrowser(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-images mr-2"></i>
            Browse Media Library
          </button>
        </div>
      )}
      
      <p className="mt-2 text-xs text-gray-500">
        Images will be uploaded to: ppyc/{folder}
      </p>
      
      {/* Image Browser Modal */}
      {showBrowser && (
        <ImageBrowser
          onImageSelect={handleImageSelect}
          onClose={() => setShowBrowser(false)}
          selectedImage={selectedImage}
        />
      )}
    </div>
  );
};

export default ImageUpload; 