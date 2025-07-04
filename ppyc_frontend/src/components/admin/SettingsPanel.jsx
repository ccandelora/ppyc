import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPanel = () => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [settings, setSettings] = useState({
    general: {
      site_title: 'Pleasant Park Yacht Club',
      site_description: 'A premier yacht club fostering maritime excellence since 1910',
      contact_email: 'info@ppyc.com',
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

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setError('');
  };

  const handleSaveSection = async (section) => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError(`Failed to save ${section} settings`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: 'fas fa-cog' },
    { id: 'social', name: 'Social Media', icon: 'fab fa-facebook' },
    { id: 'tv_display', name: 'TV Display', icon: 'fas fa-tv' }
  ];

  if (!hasPermission('can_manage_users')) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <i className="fas fa-lock text-gray-400 text-4xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          <i className="fas fa-cog mr-2 text-blue-500"></i>
          Site Settings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure your yacht club website settings
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <i className="fas fa-check-circle mr-2"></i>
          {success}
        </div>
      )}

      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-1/4 bg-gray-50 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={settings.general.site_title}
                    onChange={(e) => handleInputChange('general', 'site_title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your site title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.general.site_description}
                    onChange={(e) => handleInputChange('general', 'site_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your yacht club"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.contact_email}
                      onChange={(e) => handleInputChange('general', 'contact_email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="info@ppyc.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.general.contact_phone}
                      onChange={(e) => handleInputChange('general', 'contact_phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={settings.general.address}
                    onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Marina Drive, Boston, MA 02101"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSaveSection('general')}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save General Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fab fa-facebook mr-2 text-blue-600"></i>
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.facebook_url}
                    onChange={(e) => handleInputChange('social', 'facebook_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://facebook.com/ppyc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fab fa-twitter mr-2 text-blue-400"></i>
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.twitter_url}
                    onChange={(e) => handleInputChange('social', 'twitter_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://twitter.com/ppyc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fab fa-instagram mr-2 text-pink-500"></i>
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.instagram_url}
                    onChange={(e) => handleInputChange('social', 'instagram_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://instagram.com/ppyc"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSaveSection('social')}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save Social Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TV Display Settings */}
          {activeTab === 'tv_display' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">TV Display Configuration</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Slide Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="60"
                    value={settings.tv_display.default_slide_duration}
                    onChange={(e) => handleInputChange('tv_display', 'default_slide_duration', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={settings.tv_display.background_color}
                    onChange={(e) => handleInputChange('tv_display', 'background_color', e.target.value)}
                    className="w-20 h-10 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enable_weather"
                      checked={settings.tv_display.enable_weather}
                      onChange={(e) => handleInputChange('tv_display', 'enable_weather', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="enable_weather" className="text-sm font-medium text-gray-700">
                      Show Weather Information
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enable_time"
                      checked={settings.tv_display.enable_time}
                      onChange={(e) => handleInputChange('tv_display', 'enable_time', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="enable_time" className="text-sm font-medium text-gray-700">
                      Show Current Time
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSaveSection('tv_display')}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save TV Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 