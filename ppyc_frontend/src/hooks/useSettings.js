import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

export const useSettings = () => {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
};

// Helper hook for common settings operations
export const useSettingsHelpers = () => {
  const settings = useSettings();
  
  return {
    ...settings,
    
    // Contact information helpers
    getContactInfo: () => ({
      email: settings.contactEmail,
      phone: settings.contactPhone,
      address: settings.address
    }),
    
    // Social media helpers
    getSocialLinks: () => ({
      facebook: settings.facebookUrl,
      twitter: settings.twitterUrl,
      instagram: settings.instagramUrl,
      linkedin: settings.linkedinUrl
    }),
    
    // Get all populated social links (filter out empty ones)
    getActiveSocialLinks: () => {
      const links = {};
      if (settings.facebookUrl) links.facebook = settings.facebookUrl;
      if (settings.twitterUrl) links.twitter = settings.twitterUrl;
      if (settings.instagramUrl) links.instagram = settings.instagramUrl;
      if (settings.linkedinUrl) links.linkedin = settings.linkedinUrl;
      return links;
    },
    
    // Site information helpers
    getSiteInfo: () => ({
      title: settings.siteTitle,
      description: settings.siteDescription
    }),
    
    // Check if settings are cached
    isCached: () => {
      try {
        const cached = localStorage.getItem('ppyc_settings_cache');
        const timestamp = localStorage.getItem('ppyc_settings_cache_timestamp');
        return !!(cached && timestamp);
      } catch {
        return false;
      }
    },
    
    // Get cache age in hours
    getCacheAge: () => {
      try {
        const timestamp = localStorage.getItem('ppyc_settings_cache_timestamp');
        if (!timestamp) return null;
        
        const age = Date.now() - parseInt(timestamp);
        return Math.round(age / (1000 * 60 * 60)); // Convert to hours
      } catch {
        return null;
      }
    }
  };
};

export default useSettings; 