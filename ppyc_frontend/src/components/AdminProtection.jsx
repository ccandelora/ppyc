import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function AdminProtection() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Add or remove admin protection meta tags based on current route
    if (isAdminRoute) {
      // Add meta tags to prevent indexing
      addMetaTag('robots', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
      addMetaTag('googlebot', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
      addMetaTag('bingbot', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
      
      // Add security headers via meta tags
      addMetaTag('referrer', 'no-referrer');
      addMetaTag('format-detection', 'telephone=no');
      
      // Update page title for admin pages
      document.title = 'Admin Dashboard - PPYC';
      
      // Add security warning in console for admin pages
      console.warn('🔒 Admin area - Unauthorized access is prohibited');
    } else {
      // Remove admin protection meta tags for public pages
      removeMetaTag('robots');
      removeMetaTag('googlebot');
      removeMetaTag('bingbot');
      removeMetaTag('referrer');
      removeMetaTag('format-detection');
    }

    // Cleanup function
    return () => {
      if (isAdminRoute) {
        removeMetaTag('robots');
        removeMetaTag('googlebot');
        removeMetaTag('bingbot');
        removeMetaTag('referrer');
        removeMetaTag('format-detection');
      }
    };
  }, [isAdminRoute]);

  return null;
}

// Helper function to add meta tags
function addMetaTag(name, content) {
  // Remove existing tag if it exists
  removeMetaTag(name);
  
  // Create new meta tag
  const meta = document.createElement('meta');
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
}

// Helper function to remove meta tags
function removeMetaTag(name) {
  const existingTag = document.querySelector(`meta[name="${name}"]`);
  if (existingTag) {
    existingTag.remove();
  }
}

export default AdminProtection; 