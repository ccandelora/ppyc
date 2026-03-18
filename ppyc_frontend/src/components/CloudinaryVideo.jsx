import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { generateVideoUrl, generatePosterUrl } from '../config/cloudinary';
import { logError } from '../utils/safeLogger';

const CloudinaryVideo = ({
  publicId,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  generatePoster = true,
  quality = 'auto',
  preload = 'none',
  ...props
}) => {
  const [videoStarted, setVideoStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  // Generate URLs
  const videoUrl = generateVideoUrl(publicId, { quality });
  const posterUrl = generatePoster ? generatePosterUrl(publicId) : undefined;

  // Defer video loading — don't call video.load() eagerly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        const video = videoRef.current;

        video.addEventListener('playing', () => setVideoStarted(true), { once: true });
        video.addEventListener('error', (e) => {
          logError('Video loading error:', e);
          setHasError(true);
        }, { once: true });

        // Now trigger the load + play
        video.load();
        video.play().catch(() => {});
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [videoUrl]);

  return (
    <div className={`relative ${className}`}>
      {/* Poster image — high priority since it's often the LCP element */}
      {posterUrl && !videoStarted && (
        <img
          src={posterUrl}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
        />
      )}

      <video
        ref={videoRef}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload="none"
        className={`w-full h-full object-cover ${videoStarted ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.5s ease-in-out' }}
        {...props}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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
