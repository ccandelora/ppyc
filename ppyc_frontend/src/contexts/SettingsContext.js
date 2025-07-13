import React, { createContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    general: {},
    social: {},
    tv_display: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from admin API first (for authenticated users)
      const response = await adminAPI.settings.getAll();
      
      if (response.data.success) {
        setSettings(response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to fetch settings');
      }
    } catch (err) {
      // If admin API fails (likely due to auth), use default values
      console.warn('Could not fetch settings from admin API, using defaults:', err.message);
      setSettings({
        general: {
          site_title: 'Pleasant Park Yacht Club',
          site_description: 'A premier yacht club fostering maritime excellence since 1910',
          contact_email: 'secretary.ppyc@gmail.com',
          contact_phone: '(555) 123-4567',
          address: '123 Marina Drive, Boston, MA 02101'
        },
        social: {
          facebook_url: '',
          twitter_url: '',
          instagram_url: '',
          linkedin_url: ''
        },
        tv_display: {
          default_slide_duration: 8,
          enable_weather: true,
          enable_time: true,
          background_color: '#1e40af'
        }
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get a setting value with fallback
  const getSetting = (key, fallback = '') => {
    const [category, setting] = key.split('.');
    return settings[category]?.[setting] || fallback;
  };

  // Helper function to get boolean setting
  const getBooleanSetting = (key, fallback = false) => {
    const value = getSetting(key);
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return fallback;
  };

  // Helper function to get number setting
  const getNumberSetting = (key, fallback = 0) => {
    const value = getSetting(key);
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value) || fallback;
    return fallback;
  };

  const value = {
    settings,
    loading,
    error,
    fetchSettings,
    getSetting,
    getBooleanSetting,
    getNumberSetting,
    // Convenience getters for common settings
    siteTitle: getSetting('general.site_title', 'Pleasant Park Yacht Club'),
    siteDescription: getSetting('general.site_description', 'A premier yacht club fostering maritime excellence since 1910'),
    contactEmail: getSetting('general.contact_email', 'secretary.ppyc@gmail.com'),
    contactPhone: getSetting('general.contact_phone', '(555) 123-4567'),
    address: getSetting('general.address', '123 Marina Drive, Boston, MA 02101'),
    facebookUrl: getSetting('social.facebook_url'),
    twitterUrl: getSetting('social.twitter_url'),
    instagramUrl: getSetting('social.instagram_url'),
    linkedinUrl: getSetting('social.linkedin_url'),
    defaultSlideDuration: getNumberSetting('tv_display.default_slide_duration', 8),
    enableWeather: getBooleanSetting('tv_display.enable_weather', true),
    enableTime: getBooleanSetting('tv_display.enable_time', true),
    backgroundColor: getSetting('tv_display.background_color', '#1e40af')
  };

  return React.createElement(SettingsContext.Provider, { value }, children);
}; 