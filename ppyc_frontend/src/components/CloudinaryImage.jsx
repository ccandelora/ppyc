import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { auto as autoFormat } from '@cloudinary/url-gen/actions/delivery';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { cloudinaryConfig } from '../config/cloudinary';

// Create Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloudName
  }
});

const CloudinaryImage = ({ 
  publicId, 
  alt, 
  width, 
  height, 
  className = '',
  crop = 'fill',
  quality: imageQuality = 'auto',
  ...props 
}) => {
  if (!publicId) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} {...props}>
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  // Create the image with transformations
  const myImage = cld.image(publicId);
  
  // Apply automatic optimizations
  myImage
    .delivery(autoFormat()) // Automatic format selection (WebP, AVIF, etc.)
    .delivery(quality(imageQuality)); // Automatic quality optimization
  
  // Apply resize if dimensions provided
  if (width || height) {
    if (crop === 'fill') {
      myImage.resize(auto().width(width).height(height));
    }
  }

  return (
    <AdvancedImage 
      cldImg={myImage} 
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default CloudinaryImage; 