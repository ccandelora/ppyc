import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Defer video loading until after critical content renders
    const loadVideo = () => {
      if (videoRef.current) {
        videoRef.current.src = "https://res.cloudinary.com/dqb8hp68j/video/upload/q_auto,f_auto/v1751693180/ppyc/ppyc/slides/videos/cloudinaryfile_wttzjq.mp4";
        videoRef.current.load();
        setVideoLoaded(true);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadVideo);
    } else {
      setTimeout(loadVideo, 1000);
    }
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="https://res.cloudinary.com/dqb8hp68j/video/upload/q_auto,f_auto,w_1280,so_0/v1751693180/ppyc/ppyc/slides/videos/cloudinaryfile_wttzjq.jpg"
          className="w-full h-full object-cover"
        >
          {/* Source set dynamically via useEffect */}
          Your browser does not support the video tag.
        </video>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/80"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <img
            src="/assets/images/ppyclogo.webp"
            alt="Pleasant Park Yacht Club"
            className="w-24 h-24 mx-auto mb-6 opacity-90"
            width="96"
            height="96"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
          Pleasant Park
          <span className="block text-4xl md:text-6xl font-light text-blue-200">Yacht Club</span>
        </h1>

        <div className="w-24 h-1 bg-gold-400 mx-auto mb-8"></div>

        <p className="text-xl md:text-2xl font-light mb-4 leading-relaxed">
          Est. 1910
        </p>

        <p className="text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
          A tradition of excellence in navigation, seamanship, and fellowship on the Great Lakes
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/about"
            className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Discover Our Heritage
          </Link>
          <Link
            to="/membership"
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
          >
            Join Our Community
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
