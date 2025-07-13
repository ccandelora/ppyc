// Cloudinary Asset Configuration for PPYC
// Professional yacht club assets optimized for performance and quality

// Base Cloudinary configuration
const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
};

// Asset categories for yacht club content
export const YACHT_CLUB_ASSETS = {
  // Hero Backgrounds - Large format, optimized for web
  heroes: {
    primaryMarina: `https://res.cloudinary.com/demo/image/upload/c_fill,w_1920,h_1080,q_auto,f_auto/sample`,
    sailingAction: `https://res.cloudinary.com/demo/image/upload/c_fill,w_1920,h_1080,q_auto,f_auto/couple`,
    sunsetMarina: `https://res.cloudinary.com/demo/image/upload/c_fill,w_1920,h_1080,q_auto,f_auto/lake`,
    regattaAction: `https://res.cloudinary.com/demo/image/upload/c_fill,w_1920,h_1080,q_auto,f_auto/mountain`,
  },

  // Section Backgrounds - Medium format, subtle overlays
  backgrounds: {
    communitySection: `https://res.cloudinary.com/demo/image/upload/c_fill,w_1920,h_800,q_auto,f_auto/couple`,
    eventsSection: `https://res.cloudinary.com/demo/image/upload/c_fill,w_1920,h_600,q_auto,f_auto/sample`,
    membershipSection: `https://res.cloudinary.com/demo/image/upload/c_fill,w_1920,h_600,q_auto,f_auto/lake`,
  },

  // Logo paths
  logos: {
    mainLogo: `/assets/images/ppyclogo.png`,
    smallLogo: `/assets/images/ppyclogo.png`,
    favicon: `/assets/images/ppyclogo.png`,
  },

  // Gallery Images - Various sizes for different contexts
  gallery: {
    // Marina and facilities - using demo cloud for sample images
    marina: [
      `https://res.cloudinary.com/dqb8hp68j/image/upload/v1751928001/ppyc/people/members/j-farr-pic-2`,
      `https://res.cloudinary.com/dqb8hp68j/image/upload/v1751928021/ppyc/general/misc/middaysun.jpg`,
      `https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,q_auto,f_auto/v1/samples/landscapes/water-sunset`,
    ],
    // Events and activities - using demo cloud for sample images
    events: [
      `https://res.cloudinary.com/dqb8hp68j/image/upload/v1751928021/ppyc/events/parties/kickoffparty1.jpg`,
      `https://res.cloudinary.com/dqb8hp68j/image/upload/v1751928001/ppyc/people/members/j-farr-pic-2`,
      `https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400,q_auto,f_auto/v1/samples/landscapes/sea-beach-boardwalk`,
    ],
    // Sailing and racing - using demo cloud for sample images
    sailing: [
      `https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,q_auto,f_auto/v1/samples/landscapes/beach-boat`,
      `https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,q_auto,f_auto/v1/samples/landscapes/water-sunset`,
      `https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,q_auto,f_auto/v1/samples/landscapes/nature-mountains`,
    ],
  },

  // Video Assets - Optimized for web delivery
  videos: {
    bostonBridge: 'ppyc/ppyc/website/cloudinaryfile_yahsta',
    bostonWaterfront: 'ppyc/ppyc/website/cloudinaryfile_zg0as1',
    harborView: 'ppyc/ppyc/website/cloudinaryfile_hxnxal',
    sailingBoat: 'ppyc/ppyc/website/cloudinaryfile_br2gtv',
    diveBoat: 'ppyc/ppyc/website/cloudinaryfile_jelvbp',
    ultraHD: 'ppyc/ppyc/website/cloudinaryfile_r3gj77',
    heroVideo: 'ppyc/ppyc/website/cloudinaryfile_yahsta',  // About page hero
    eventsHero: 'ppyc/ppyc/website/cloudinaryfile_br2gtv', // Events page hero
  },
};

// Helper functions for dynamic asset generation
export const generateAssetUrl = (publicId, transformations = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    effect = '',
    overlay = '',
  } = transformations;

  const transformString = [
    `c_${crop}`,
    width !== 'auto' && `w_${width}`,
    height !== 'auto' && `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    effect && `e_${effect}`,
    overlay && `l_${overlay}`,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformString}/${publicId}`;
};

export const generateVideoUrl = (publicId, options = {}) => {
  const {
    quality = 'auto',
  } = options;

  // Standard video optimizations
  const videoParams = [
    'q_' + quality,
    'f_auto',
    'c_scale',
    'w_960',
    'so_0'          // Start from beginning
  ].join(',');

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/video/upload/${videoParams}/${publicId}`;
};

// Generate a high-quality poster
export const generatePosterUrl = (publicId) => {
  const posterParams = [
    'q_auto:best',    // Best quality for the poster
    'f_auto',         // Auto format
    'w_960',          // Match video width
    'c_scale',        // Scale transformation
    'so_0',           // Start from first frame
    'vs_1'            // Single frame
  ].join(',');
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/video/upload/${posterParams}/${publicId}.jpg`;
};

// Responsive image sets for different breakpoints
export const getResponsiveImageSet = (publicId, baseTransformations = {}) => {
  const breakpoints = [
    { width: 320, descriptor: '320w' },
    { width: 640, descriptor: '640w' },
    { width: 768, descriptor: '768w' },
    { width: 1024, descriptor: '1024w' },
    { width: 1280, descriptor: '1280w' },
    { width: 1920, descriptor: '1920w' },
  ];

  const srcSet = breakpoints.map(({ width, descriptor }) => {
    const url = generateAssetUrl(publicId, { ...baseTransformations, width });
    return `${url} ${descriptor}`;
  }).join(', ');

  return {
    srcSet,
    src: generateAssetUrl(publicId, { ...baseTransformations, width: 1920 }),
    sizes: '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1920px',
  };
};

// SEO optimized image component helper
export const createOptimizedImageProps = (publicId, alt, transformations = {}) => {
  const responsive = getResponsiveImageSet(publicId, transformations);
  return {
    ...responsive,
    alt,
    loading: 'lazy',
    decoding: 'async',
    style: { aspectRatio: transformations.aspectRatio || 'auto' },
  };
};

export default cloudinaryConfig; 