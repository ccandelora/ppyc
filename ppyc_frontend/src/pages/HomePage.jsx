import React, { Suspense } from 'react';

// Static components - load immediately
import HeroSection from '../components/home/HeroSection';
import HeritageSection from '../components/home/HeritageSection';
import HistoricalPhotosSection from '../components/home/HistoricalPhotosSection';
import MembershipCTASection from '../components/home/MembershipCTASection';

// Dynamic components - lazy load for better performance
const UpcomingEventsSection = React.lazy(() => import('../components/home/UpcomingEventsSection'));
const LatestNewsSection = React.lazy(() => import('../components/home/LatestNewsSection'));

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Static sections load immediately */}
      <HeroSection />
      <HeritageSection />
      <HistoricalPhotosSection />
      
      {/* Dynamic sections with lazy loading and suspense */}
      <Suspense fallback={null}>
        <UpcomingEventsSection />
      </Suspense>
      
      <Suspense fallback={null}>
        <LatestNewsSection />
      </Suspense>
      
      {/* Static CTA section */}
      <MembershipCTASection />
    </div>
  );
}

export default HomePage; 