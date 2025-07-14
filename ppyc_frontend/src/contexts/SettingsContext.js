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

  // Cache settings in localStorage
  const CACHE_KEY = 'ppyc_settings_cache';
  const CACHE_TIMESTAMP_KEY = 'ppyc_settings_cache_timestamp';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Load settings from cache or API
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cachedSettings = getCachedSettings();
      if (cachedSettings) {
        setSettings(cachedSettings);
        setLoading(false);
        return;
      }

      // Try to fetch from admin API
      await fetchSettings();
    } catch (err) {
      console.error('Error loading settings:', err);
      setDefaultSettings();
    } finally {
      setLoading(false);
    }
  };

  const getCachedSettings = () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age < CACHE_DURATION) {
          return JSON.parse(cachedData);
        }
      }
    } catch (err) {
      console.warn('Error reading from cache:', err);
    }
    return null;
  };

  const setCachedSettings = (settingsData) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(settingsData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.warn('Error writing to cache:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      // Try to fetch from admin API first (for authenticated users)
      const response = await adminAPI.settings.getAll();
      
      if (response.data.success) {
        const settingsData = response.data.data;
        setSettings(settingsData);
        setCachedSettings(settingsData);
      } else {
        throw new Error(response.data.error || 'Failed to fetch settings');
      }
    } catch (err) {
      // If admin API fails (likely due to auth), use default values
      console.warn('Could not fetch settings from admin API, using defaults:', err.message);
      setDefaultSettings();
    }
  };

  const setDefaultSettings = () => {
    const defaultSettings = {
      general: {
        site_title: 'Pleasant Park Yacht Club',
        site_description: 'A premier yacht club fostering maritime excellence since 1910',
        contact_email: 'secretary.ppyc@gmail.com',
        contact_phone: '(617)846-7124',
        address: '562 Pleasant Street, Winthrop MA 02152'
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
    };
    
    setSettings(defaultSettings);
    setCachedSettings(defaultSettings);
  };

  // Force refresh settings (for admin users)
  const refreshSettings = async () => {
    // Clear cache
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    
    // Fetch fresh data
    await fetchSettings();
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
    refreshSettings,
    getSetting,
    getBooleanSetting,
    getNumberSetting,
    
    // Convenience getters for common settings
    siteTitle: getSetting('general.site_title', 'Pleasant Park Yacht Club'),
    siteDescription: getSetting('general.site_description', 'A premier yacht club fostering maritime excellence since 1910'),
    contactEmail: getSetting('general.contact_email', 'secretary.ppyc@gmail.com'),
    contactPhone: getSetting('general.contact_phone', '(617)846-7124'),
    address: getSetting('general.address', '562 Pleasant Street, Winthrop MA 02152'),
    
    // Social media links
    facebookUrl: getSetting('social.facebook_url'),
    twitterUrl: getSetting('social.twitter_url'),
    instagramUrl: getSetting('social.instagram_url'),
    linkedinUrl: getSetting('social.linkedin_url'),
    
    // TV display settings
    defaultSlideDuration: getNumberSetting('tv_display.default_slide_duration', 8),
    enableWeather: getBooleanSetting('tv_display.enable_weather', true),
    enableTime: getBooleanSetting('tv_display.enable_time', true),
    backgroundColor: getSetting('tv_display.background_color', '#1e40af')
  };

  return React.createElement(SettingsContext.Provider, { value }, children);
}; 