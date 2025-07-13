import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import { YACHT_CLUB_ASSETS } from '../config/cloudinary';
import CloudinaryVideo from './CloudinaryVideo';
import WeatherWidget from './WeatherWidget';
import { useApiCache } from '../hooks/useApiCache';
import { slidesAPI } from '../services/api';
import { useSettings } from '../hooks/useSettings';

const TVDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { data: response, isLoading: slidesLoading, error: slidesError } = useApiCache(slidesAPI.getAll, 'slides-all', { ttl: 30000 });
  const slides = response?.data || [];
  const { siteTitle, enableWeather, enableTime, defaultSlideDuration } = useSettings();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate slides based on their duration
  useEffect(() => {
    if (slides && slides.length > 0) {
      const currentSlide = slides[currentSlideIndex];
      const duration = currentSlide?.duration_seconds * 1000 || (defaultSlideDuration * 1000);
      const interval = setInterval(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, duration);
      return () => clearInterval(interval);
    }
  }, [slides, currentSlideIndex, defaultSlideDuration]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/New_York'
    });
  };

  // Default background video when no slides are available
  const renderDefaultBackground = () => (
    <CloudinaryVideo
      publicId={YACHT_CLUB_ASSETS.videos.ultraHD}
      className="absolute inset-0 w-full h-full object-cover opacity-50"
      autoPlay
      loop
      muted
      playsInline
    />
  );

  // Loading state with background video
  if (slidesLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
        {renderDefaultBackground()}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 p-12 rounded-3xl backdrop-blur-lg">
            <div className="text-6xl text-white flex items-center">
              <FontAwesomeIcon icon={ICON_NAMES.LOADING} spin className="mr-6" />
              Loading content...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with background video
  if (slidesError) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
        {renderDefaultBackground()}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 p-12 rounded-3xl backdrop-blur-lg">
            <div className="text-6xl text-red-500 flex items-center">
              <FontAwesomeIcon icon={ICON_NAMES.WARNING} className="mr-6" />
              Unable to load content
            </div>
            <div className="text-2xl text-gray-400 mt-4">
              {slidesError.message || 'Please check your connection and try again'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No slides state with background video
  if (!slides || slides.length === 0) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
        {renderDefaultBackground()}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 p-12 rounded-3xl backdrop-blur-lg text-center">
            <img src="/ppyc-logo.png" alt="PPYC Logo" className="w-48 h-48 mb-8 mx-auto object-contain" />
            <div className="text-6xl text-white">Welcome to {siteTitle}</div>
            <div className="text-3xl text-gray-400 mt-4">Please add slides in the admin panel</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {/* Main Content */}
      {slides[currentSlideIndex] && (
        <div className="absolute inset-0">
          {/* Background */}
          {slides[currentSlideIndex].background_video_url ? (
            // Check if it's a full URL (uploaded video) or a public ID (Cloudinary asset)
            slides[currentSlideIndex].background_video_url.startsWith('http') ? (
              <video
                src={slides[currentSlideIndex].background_video_url}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <CloudinaryVideo
                publicId={slides[currentSlideIndex].background_video_url}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            )
          ) : slides[currentSlideIndex].image_url ? (
            <img
              src={slides[currentSlideIndex].image_url}
              alt={slides[currentSlideIndex].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            renderDefaultBackground()
          )}

          {/* Background Tint */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: slides[currentSlideIndex].background_tint_color || '#000000',
              opacity: slides[currentSlideIndex].background_tint_opacity || 0.5
            }}
          />

          {/* Content Overlay */}
          <div className="absolute inset-0">
            {/* Header */}
            <div className="p-8 flex justify-between items-start">
                          <div className="flex items-center">
              <img src="/ppyc-logo.png" alt="PPYC Logo" className="h-16 mr-6 object-contain" />
              <div>
                {enableTime && (
                  <>
                    <div className="text-6xl font-bold text-white">
                      {formatTime(currentTime)}
                    </div>
                    <div className="text-2xl text-gray-300 mt-2">
                      {formatDate(currentTime)}
                    </div>
                  </>
                )}
              </div>
            </div>
            {enableWeather && <WeatherWidget className="text-3xl" showMarine={true} />}
            </div>

            {/* Slide Content */}
            <div className="flex-1 flex items-center justify-center p-16">
              <div className="text-center max-w-6xl">
                {slides[currentSlideIndex].slide_type === 'announcement' && (
                  <div className="text-xl uppercase tracking-widest text-gray-300 mb-4">
                    ANNOUNCEMENT
                  </div>
                )}
                <h1 className="text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
                  {slides[currentSlideIndex].title}
                </h1>
                <div 
                  className="text-4xl text-gray-100 leading-relaxed prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: slides[currentSlideIndex].content }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex justify-between items-center">
                <div className="text-3xl text-white">
                  <FontAwesomeIcon icon={ICON_NAMES.SHIP} className="mr-4" />
                  {siteTitle}
                </div>
                <div className="text-2xl text-gray-300">
                  <FontAwesomeIcon icon={ICON_NAMES.LOCATION} className="mr-2" />
                  Winthrop, MA
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{
            width: `${((currentSlideIndex + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}

export default TVDisplay; 