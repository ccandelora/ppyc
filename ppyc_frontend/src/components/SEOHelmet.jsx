import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SEOHelmet({ title, description, image, keywords, type = 'website' }) {
  const location = useLocation();

  // Default SEO values
  const defaultSEO = {
    title: 'Pleasant Park Yacht Club - Premier Boston Marina & Sailing Community Est. 1910',
    description: 'Pleasant Park Yacht Club, established 1910, offers premier marina services, sailing instruction, yacht club dining, and maritime community in Boston. Join our sailing legacy!',
    image: 'https://srv894370.hstgr.cloud/assets/images/ppyc-images/ppyc-hero.png',
    keywords: 'yacht club, marina, Boston sailing, boat slips, sailing instruction, waterfront dining, maritime community, yacht services, boat storage, Boston harbor'
  };

  // Page-specific SEO data
  const pageSEO = {
    '/': {
      title: 'Pleasant Park Yacht Club - Premier Boston Marina & Sailing Community Est. 1910',
      description: 'Discover Pleasant Park Yacht Club, Boston\'s premier marina community since 1910. Full-service marina, sailing instruction, waterfront dining, and maritime heritage.',
      keywords: 'PPYC, yacht club Boston, marina services, sailing lessons, boat slips Boston, waterfront dining'
    },
    '/about': {
      title: 'About PPYC - Boston\'s Premier Yacht Club Since 1910',
      description: 'Learn about Pleasant Park Yacht Club\'s rich history, maritime traditions, and commitment to sailing excellence in Boston harbor since 1910.',
      keywords: 'yacht club history, Boston maritime, sailing community, PPYC heritage, boat club tradition'
    },
    '/heritage': {
      title: 'Heritage & History - Pleasant Park Yacht Club Boston',
      description: 'Explore over a century of maritime heritage at Pleasant Park Yacht Club. Discover our rich history, traditions, and legacy in Boston\'s sailing community.',
      keywords: 'yacht club heritage, maritime history Boston, sailing tradition, PPYC legacy, boat club history'
    },
    '/events': {
      title: 'Events & Activities - Pleasant Park Yacht Club',
      description: 'Join PPYC for exciting yacht club events, regattas, social gatherings, and sailing activities. View our calendar of upcoming marina and clubhouse events.',
      keywords: 'yacht club events, sailing regattas, marina activities, boat club social events, PPYC calendar'
    },
    '/news': {
      title: 'News & Updates - Pleasant Park Yacht Club Boston',
      description: 'Stay updated with the latest news, announcements, and stories from Pleasant Park Yacht Club. Marina updates, sailing news, and community highlights.',
      keywords: 'yacht club news, marina updates, sailing announcements, PPYC stories, boat club updates'
    },
    '/marina': {
      title: 'Marina Services - Full Service Boston Harbor Marina | PPYC',
      description: 'Complete marina services at Pleasant Park Yacht Club. 200 boat slips, fuel dock, maintenance, winter storage, and professional harbor services in Boston.',
      keywords: 'Boston marina, boat slips, marina services, fuel dock, boat storage, harbor services, yacht services'
    },
    '/membership': {
      title: 'Membership - Join Pleasant Park Yacht Club Boston',
      description: 'Become a member of Boston\'s premier yacht club. Explore membership benefits, marina privileges, dining access, and sailing community at Pleasant Park Yacht Club.',
      keywords: 'yacht club membership, join boat club Boston, marina membership, sailing club membership, PPYC member benefits'
    }
  };

  useEffect(() => {
    // Get SEO data for current page
    const currentPageSEO = pageSEO[location.pathname] || {};
    const finalTitle = title || currentPageSEO.title || defaultSEO.title;
    const finalDescription = description || currentPageSEO.description || defaultSEO.description;
    const finalImage = image || currentPageSEO.image || defaultSEO.image;
    const finalKeywords = keywords || currentPageSEO.keywords || defaultSEO.keywords;

    // Update document title
    document.title = finalTitle;

    // Update or create meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    
    // Update Open Graph tags
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:image', finalImage);
    updateMetaProperty('og:url', `https://srv894370.hstgr.cloud${location.pathname}`);
    updateMetaProperty('og:type', type);

    // Update Twitter Card tags
    updateMetaName('twitter:title', finalTitle);
    updateMetaName('twitter:description', finalDescription);
    updateMetaName('twitter:image', finalImage);

    // Update canonical URL
    updateCanonicalUrl(`https://srv894370.hstgr.cloud${location.pathname}`);

  }, [location.pathname, title, description, image, keywords, type]);

  return null;
}

// Helper function to update meta tags by name
function updateMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Helper function to update meta tags by property (for Open Graph)
function updateMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Helper function to update meta tags by name (for Twitter)
function updateMetaName(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Helper function to update canonical URL
function updateCanonicalUrl(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

export default SEOHelmet; 