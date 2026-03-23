// Cloudinary Configuration for PPYC
// Cloudinary is now ONLY used for dynamic CMS content (news articles, events).
// All static assets are served locally from /assets/.

// Cloudinary config - kept for CMS/admin-uploaded content only
const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqb8hp68j',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
};

// All static assets now use local paths
export const YACHT_CLUB_ASSETS = {
  // Hero Backgrounds
  heroes: {
    primaryMarina: '/assets/images/ppyc-images/sunset.jpg',
    sailingAction: '/assets/images/ppyc-images/ppyc-small-boat.jpg',
    sunsetMarina: '/assets/images/ppyc-images/sunset2.jpg',
    regattaAction: '/assets/images/ppyc-images/cloud.jpg',
  },

  // Section Backgrounds
  backgrounds: {
    communitySection: '/assets/images/ppyc-images/deck.jpg',
    eventsSection: '/assets/images/ppyc-images/float2.jpg',
    membershipSection: '/assets/images/ppyc-images/sunset3.jpg',
  },

  // Logo paths (unchanged - already local)
  logos: {
    mainLogo: '/assets/images/ppyclogo.png',
    smallLogo: '/assets/images/ppyclogo.png',
    favicon: '/assets/images/ppyclogo.png',
  },

  // Gallery Images - all local
  gallery: {
    marina: [
      '/assets/images/ppyc-images/J-Farr-pic-2.jpg',
      '/assets/images/ppyc-images/dockal.jpg',
      '/assets/images/ppyc-images/middaysun.jpg',
      '/assets/images/ppyc-images/sunset.jpg',
    ],
    events: [
      '/assets/images/ppyc-images/kickoffparty1.jpg',
      '/assets/images/ppyc-images/float.jpg',
      '/assets/images/ppyc-images/party1.jpg',
    ],
    sailing: [
      '/assets/images/ppyc-images/ppyc-small-boat.jpg',
      '/assets/images/ppyc-images/dinghy.jpg',
      '/assets/images/ppyc-images/dinghy2.jpg',
    ],
  },

  // Video Assets - local optimized files
  videos: {
    bostonBridge: '/assets/videos/bostonBridge.mp4',
    bostonWaterfront: '/assets/videos/bostonWaterfront.mp4',
    harborView: '/assets/videos/harborView.mp4',
    sailingBoat: '/assets/videos/sailingBoat.mp4',
    diveBoat: '/assets/videos/diveBoat.mp4',
    ultraHD: '/assets/videos/ultraHD.mp4',
    heroVideo: '/assets/videos/bostonBridge.mp4',
    eventsHero: '/assets/videos/sailingBoat.mp4',
    heroSlide: '/assets/videos/heroSlide.mp4',
  },

  // Video Posters - generated from first frame
  videoPosters: {
    bostonBridge: '/assets/videos/bostonBridge.jpg',
    bostonWaterfront: '/assets/videos/bostonWaterfront.jpg',
    harborView: '/assets/videos/harborView.jpg',
    sailingBoat: '/assets/videos/sailingBoat.jpg',
    diveBoat: '/assets/videos/diveBoat.jpg',
    ultraHD: '/assets/videos/ultraHD.jpg',
    heroVideo: '/assets/videos/bostonBridge.jpg',
    eventsHero: '/assets/videos/sailingBoat.jpg',
    heroSlide: '/assets/videos/heroSlide.jpg',
  },
};

// Optimize Cloudinary URL for dynamic CMS content (news, events)
// Only used for images served from the Rails API
export const optimizeCloudinaryUrl = (url, {
  width = 800,
  height,
  quality = 'auto:low',
  format = 'auto',
  crop = 'fill'
} = {}) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('/c_fill') || url.includes('/c_scale')
    || url.includes('/q_auto')) return url;

  const transforms = [
    `c_${crop}`, `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`, `f_${format}`,
  ].filter(Boolean).join(',');

  return url.replace('/upload/', `/upload/${transforms}/`);
};

export default cloudinaryConfig;
