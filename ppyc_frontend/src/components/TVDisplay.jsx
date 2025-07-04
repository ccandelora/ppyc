import { useState, useEffect } from 'react';
import { slidesAPI } from '../services/api';
import WeatherWidget from './WeatherWidget';

const TVDisplay = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await slidesAPI.getAll();
        if (response.data && response.data.length > 0) {
          setSlides(response.data);
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0) return;

    const currentSlide = slides[currentSlideIndex];
    const duration = (currentSlide?.duration_seconds || 60) * 1000;

    const timer = setTimeout(() => {
      setCurrentSlideIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, duration);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, slides]);

  if (loading) {
    return (
      <div className="h-screen bg-yacht-navy-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-yacht-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-white font-bold text-4xl">⚓</span>
          </div>
          <p className="text-2xl">Loading TV Display...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-screen bg-yacht-navy-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-yacht-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-4xl">⚓</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Pleasant Park Yacht Club</h1>
          <p className="text-xl">Welcome to our clubhouse!</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  const renderSlideContent = () => {
    switch (currentSlide.slide_type) {
      case 'announcement':
        return (
          <div className="text-center text-white max-w-6xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8">
              {currentSlide.title}
            </h1>
            <div className="text-2xl md:text-4xl leading-relaxed whitespace-pre-line">
              {currentSlide.content}
            </div>
          </div>
        );

      case 'event_promo':
        return (
          <div className="text-center text-white max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-yellow-300 drop-shadow-lg">
                {currentSlide.title}
              </h1>
              <div className="text-2xl md:text-3xl leading-relaxed whitespace-pre-line drop-shadow-lg">
                {currentSlide.content}
              </div>
            </div>
          </div>
        );

      case 'photo':
        return (
          <div className="flex flex-col items-center justify-center h-full text-white">
            {/* Title and content overlay for photo slides */}
            <div className="text-center bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">
                {currentSlide.title}
              </h1>
              {currentSlide.content && (
                <div className="text-xl md:text-2xl leading-relaxed whitespace-pre-line drop-shadow-lg">
                  {currentSlide.content}
                </div>
              )}
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white text-center">
              {currentSlide.title}
            </h1>
            <WeatherWidget 
              location={currentSlide.location || 'Boston, MA'} 
              weatherType={currentSlide.weather_type || 'current'}
            />
          </div>
        );

      default:
        return (
          <div className="text-center text-white max-w-6xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8">
              {currentSlide.title}
            </h1>
            <div className="text-2xl md:text-4xl leading-relaxed whitespace-pre-line">
              {currentSlide.content}
            </div>
          </div>
        );
    }
  };

  // Get background media - prioritize slide-specific media, then default rotation
  const getBackgroundMedia = () => {
    // Priority 1: Slide-specific background video (highest priority)
    if (currentSlide.background_video_url) {
      return {
        type: 'video',
        src: currentSlide.background_video_url
      };
    }
    
    // Priority 2: Slide-specific background image
    if (currentSlide.image_url) {
      return {
        type: 'image',
        src: currentSlide.image_url
      };
    }
    
    // Priority 3: Default video rotation based on slide index (fallback)
    const videoSources = [
      "/assets/images/videos/13974154_3840_2160_50fps.mp4", // 4K video
      "/assets/images/videos/13963117_2560_1440_30fps.mp4", // HD video
      "/assets/images/videos/vecteezy_fan-pier-boston-waterfront_1624405.mov", // Boston waterfront
      "/assets/images/videos/vecteezy_the-boat-is-sailing-on-the-river-a-fishing-boat-departs_53333837.mp4", // Sailing boat by Yuriy Kraynov
      "/assets/images/videos/vecteezy_similan-islands-thailand-november-23-2016-dive-boat-near_8821366.mp4" // Dive boat by Igor Zhorov
    ];
    return {
      type: 'video',
      src: videoSources[currentSlideIndex % videoSources.length]
    };
  };

  const currentMedia = getBackgroundMedia();

  // Get background tint - use slide-specific tint if available
  const getBackgroundTint = () => {
    if (currentSlide.background_tint_color) {
      const opacity = currentSlide.background_tint_opacity || 0.5;
      return `${currentSlide.background_tint_color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
    }
    // Default gradient tint
    return 'bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-800/85';
  };

  const backgroundTint = getBackgroundTint();

  return (
    <div className="h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Dynamic Media Background */}
      <div className="absolute inset-0">
        {currentMedia.type === 'video' ? (
          <video 
            key={currentMedia.src} // Force re-render when video changes
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={currentMedia.src} type={currentMedia.src.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
          </video>
        ) : (
          <img 
            key={currentMedia.src} // Force re-render when image changes
            src={currentMedia.src}
            alt="Background"
            className="w-full h-full object-cover"
          />
        )}
        <div 
          className={`absolute inset-0 ${
            currentSlide.background_tint_color 
              ? '' 
              : 'bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-800/85'
          }`}
          style={currentSlide.background_tint_color ? {
            backgroundColor: backgroundTint
          } : {}}
        ></div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-28 h-28 border border-white/20 rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        {renderSlideContent()}
      </div>

      {/* Slide indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlideIndex 
                ? 'bg-white' 
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Club branding in corner */}
      <div className="absolute top-8 left-8 text-white/70 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fas fa-anchor text-white text-sm"></i>
          </div>
          <div>
            <p className="text-sm font-bold">Pleasant Park Yacht Club</p>
            <p className="text-xs">Est. 1910</p>
          </div>
        </div>
      </div>

      {/* Current time */}
      <div className="absolute top-8 right-8 text-white/70 text-xl font-mono z-20">
        {new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default TVDisplay; 