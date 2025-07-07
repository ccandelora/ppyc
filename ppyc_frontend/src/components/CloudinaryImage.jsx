import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import CLOUDINARY_CONFIG from '../config/cloudinary';

// Create Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CONFIG.cloudName
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
  priority = false,
  useAdvancedImage = false, // Option to use Cloudinary's advanced features
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
    .delivery(format('auto')) // Automatic format selection (WebP, AVIF, etc.)
    .delivery(quality(imageQuality)); // Quality optimization
  
  // Apply resize if dimensions provided
  if (width || height) {
    if (crop === 'fill') {
      myImage.resize(fill().width(width).height(height));
    }
  }

  // Use AdvancedImage for complex transformations, simple img for performance
  if (useAdvancedImage) {
    return (
      <AdvancedImage 
        cldImg={myImage} 
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  // Use simple img tag for best performance
  return (
    <img 
      src={myImage.toURL()}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
};

export default CloudinaryImage; 