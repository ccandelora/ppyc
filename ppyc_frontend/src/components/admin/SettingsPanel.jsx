import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../contexts/AuthContext';
import { useContact } from '../../contexts/contactContext';
import { adminAPI } from '../../services/api';

const SettingsPanel = () => {
  const { canManageUsers } = useAuth();
  const { contactInfo, updateContactInfo } = useContact();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // User management state
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    role: 'member'
  });

  const [settings, setSettings] = useState({
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

  const roles = [
    { value: 'superuser', label: 'Superuser', description: 'Full system access', color: 'text-red-600' },
    { value: 'admin', label: 'Admin', description: 'Content and user management', color: 'text-orange-600' },
    { value: 'editor', label: 'Editor', description: 'Content management only', color: 'text-blue-600' },
    { value: 'member', label: 'Member', description: 'Basic access', color: 'text-green-600' }
  ];

  // Fetch users when users tab is selected
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.users.getAll();
      console.log('Users API response:', response);
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Unknown error';
      setError(`Failed to fetch users: ${errorMessage}`);
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response);
    } finally {
      setLoading(false);
    }
  };

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
      
      if (section === 'general') {
        // Update contact info in context
        updateContactInfo({
          email: settings.general.contact_email,
          phone: settings.general.contact_phone,
          address: settings.general.address
        });
      }
      
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

  const handleUserFormChange = (field, value) => {
    setUserForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      email: '',
      password: '',
      password_confirmation: '',
      role: 'member'
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      setError('');

      if (editingUser) {
        // Update existing user
        const response = await adminAPI.users.update(editingUser.id, { user: userForm });
        if (response.data.success) {
          setSuccess('User updated successfully!');
          fetchUsers();
          setShowUserModal(false);
        }
      } else {
        // Create new user
        const response = await adminAPI.users.create({ user: userForm });
        if (response.data.success) {
          setSuccess('User created successfully!');
          fetchUsers();
          setShowUserModal(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.users.delete(userId);
      if (response.data.success) {
        setSuccess('User deleted successfully!');
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superuser': return 'crown';
      case 'admin': return 'user-shield';
      case 'editor': return 'edit';
      case 'member': return 'user';
      default: return 'user';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superuser': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-orange-100 text-orange-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: 'cog' },
    { id: 'social', name: 'Social Media', icon: 'facebook' },
    { id: 'tv_display', name: 'TV Display', icon: 'tv' },
    { id: 'users', name: 'Users', icon: 'users' }
  ];

  if (!canManageUsers()) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FontAwesomeIcon icon="lock" className="text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          <FontAwesomeIcon icon="cog" className="mr-2 text-blue-500" />
          System Settings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure your yacht club website and manage users
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-4 sm:mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mx-4 sm:mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <FontAwesomeIcon icon="check-circle" className="mr-2" />
          {success}
        </div>
      )}

      {/* Mobile Tab Navigation */}
      <div className="block lg:hidden border-b border-gray-200">
        <nav className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              <span className="whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar Tabs */}
        <div className="hidden lg:block w-1/4 bg-gray-50 p-4">
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
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="secretary.ppyc@gmail.com"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
                      <FontAwesomeIcon icon="spinner" className="fa-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon="save" className="mr-2" />
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
                    <FontAwesomeIcon icon="facebook" className="mr-2 text-blue-600" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.facebook_url}
                    onChange={(e) => handleInputChange('social', 'facebook_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="https://facebook.com/ppyc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon="twitter" className="mr-2 text-blue-400" />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.twitter_url}
                    onChange={(e) => handleInputChange('social', 'twitter_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="https://twitter.com/ppyc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon="instagram" className="mr-2 text-pink-500" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.instagram_url}
                    onChange={(e) => handleInputChange('social', 'instagram_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
                      <FontAwesomeIcon icon="spinner" className="fa-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon="save" className="mr-2" />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
                      <FontAwesomeIcon icon="spinner" className="fa-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon="save" className="mr-2" />
                      Save TV Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <button
                  onClick={handleCreateUser}
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <FontAwesomeIcon icon="plus" />
                  <span>Add User</span>
                </button>
              </div>

              {loading && !users.length ? (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon="spinner" className="fa-spin text-3xl text-blue-500 mb-4" />
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FontAwesomeIcon icon="users" className="text-4xl mb-2 opacity-30" />
                  <p>No users found.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Posts
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white uppercase">
                                    {user.email.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                                  <div className="text-sm text-gray-500">ID: {user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                <FontAwesomeIcon icon={getRoleIcon(user.role)} className="mr-1" />
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.posts_count || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                                >
                                  <FontAwesomeIcon icon="edit" className="mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                                >
                                  <FontAwesomeIcon icon="trash" className="mr-1" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white uppercase">
                                {user.email.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.email}</div>
                              <div className="text-xs text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            <FontAwesomeIcon icon={getRoleIcon(user.role)} className="mr-1" />
                            {user.role}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Posts:</span>
                            <span className="ml-1 text-gray-900">{user.posts_count || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Created:</span>
                            <span className="ml-1 text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="flex-1 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                          >
                            <FontAwesomeIcon icon="edit" className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex-1 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                          >
                            <FontAwesomeIcon icon="trash" className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => handleUserFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => handleUserFormChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => handleUserFormChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter password'}
                    required={!editingUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={userForm.password_confirmation}
                    onChange={(e) => handleUserFormChange('password_confirmation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Confirm password"
                    required={!editingUser}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon="spinner" className="fa-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon="save" className="mr-2" />
                      {editingUser ? 'Update User' : 'Create User'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel; 