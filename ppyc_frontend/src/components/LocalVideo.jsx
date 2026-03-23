import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const LocalVideo = ({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'none',
  ...props
}) => {
  const [videoStarted, setVideoStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handlePlaying = () => setVideoStarted(true);
    const handleError = () => setHasError(true);

    video.addEventListener('playing', handlePlaying, { once: true });
    video.addEventListener('error', handleError, { once: true });

    const timer = setTimeout(() => {
      video.load();
      video.play().catch(() => {});
    }, 200);

    return () => {
      clearTimeout(timer);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      video.pause();
    };
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {poster && !videoStarted && (
        <img
          src={poster}
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
        preload={preload}
        className={`w-full h-full object-cover ${videoStarted ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.5s ease-in-out' }}
        {...props}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-sm">Error loading video</div>
        </div>
      )}
    </div>
  );
};

LocalVideo.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  className: PropTypes.string,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  playsInline: PropTypes.bool,
  preload: PropTypes.oneOf(['auto', 'metadata', 'none']),
};

export default LocalVideo;
