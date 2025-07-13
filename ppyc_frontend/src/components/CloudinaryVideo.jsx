import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { generateVideoUrl, generatePosterUrl } from '../config/cloudinary';

const CloudinaryVideo = ({
  publicId,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  generatePoster = true,
  quality = 'auto',
  preload = 'auto',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Generate URLs
  const videoUrl = generateVideoUrl(publicId, { quality });
  const posterUrl = generatePoster ? generatePosterUrl(publicId) : undefined;

  // Handle video loading and playback
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const handleCanPlay = () => {
        setIsLoading(false);
        if (autoPlay && !isPlaying) {
          video.play().catch(console.error);
        }
      };

      const handlePlay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handleError = (error) => {
        console.error('Video loading error:', error);
        setHasError(true);
        setIsLoading(false);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('error', handleError);

      // Start loading the video
      video.load();

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('error', handleError);
        video.pause();
      };
    }
  }, [videoUrl, autoPlay, isPlaying]);

  return (
    <div className={`relative ${className}`}>
      {/* Poster Image (shown until video is ready) */}
      {posterUrl && isLoading && (
        <img
          src={posterUrl}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <video
        ref={videoRef}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        poster={posterUrl}
        preload={preload}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 0.5s ease-in-out' }}
        {...props}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading indicator */}
      {isLoading && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-sm">Error loading video</div>
        </div>
      )}
    </div>
  );
};

CloudinaryVideo.propTypes = {
  publicId: PropTypes.string.isRequired,
  className: PropTypes.string,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  playsInline: PropTypes.bool,
  generatePoster: PropTypes.bool,
  quality: PropTypes.string,
  preload: PropTypes.oneOf(['auto', 'metadata', 'none']),
};

export default CloudinaryVideo; 