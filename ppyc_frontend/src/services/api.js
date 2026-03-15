import axios from 'axios';
import apiCache from '../utils/apiCache';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to false for public endpoints
});

// Create a separate instance for authenticated endpoints
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Keep true for authenticated endpoints
});

// Add response interceptor to handle auth errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/me') || requestUrl.includes('/auth/logout');
    const isOnLoginPage = window.location.pathname.startsWith('/admin/login');

    if (status === 401 && !isAuthEndpoint && !isOnLoginPage) {
      // Clear any stored user data and redirect to login
      localStorage.removeItem('currentUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to create cached API calls
const createCachedCall = (apiCall, cacheKey, ttl = 5 * 60 * 1000) => {
  const cachedFunction = () => apiCache.request(cacheKey, apiCall, ttl);
  // Add cache key for debugging
  cachedFunction.cacheKey = cacheKey;
  return cachedFunction;
};

// Public API calls with caching (using non-authenticated api instance)
export const newsAPI = {
  getAll: createCachedCall(
    () => api.get('/news'),
    'news-all',
    5 * 60 * 1000 // 5 minutes cache
  ),
  getBySlug: (slug) => createCachedCall(
    () => api.get(`/news/${slug}`),
    `news-${slug}`,
    10 * 60 * 1000 // 10 minutes cache for individual posts
  )(),
};

export const eventsAPI = {
  getAll: createCachedCall(
    () => api.get('/events'),
    'events-all',
    5 * 60 * 1000 // 5 minutes cache
  ),
  getById: (id) => createCachedCall(
    () => api.get(`/events/${id}`),
    `events-${id}`,
    10 * 60 * 1000 // 10 minutes cache for individual events
  )(),
};

export const pagesAPI = {
  getBySlug: (slug) => createCachedCall(
    () => api.get(`/pages/${slug}`),
    `pages-${slug}`,
    15 * 60 * 1000 // 15 minutes cache for static pages
  )(),
};

export const slidesAPI = {
  getAll: createCachedCall(
    () => api.get('/slides'),
    'slides-all',
    30 * 1000 // 30 seconds cache for slides (more dynamic for TV display)
  ),
};

export const weatherAPI = {
  getCurrent: createCachedCall(
    () => api.get('/weather/current'),
    'weather-current',
    5 * 60 * 1000 // 5 minutes cache for weather
  ),
  getForecast: createCachedCall(
    () => api.get('/weather/forecast?days=3'),
    'weather-forecast',
    10 * 60 * 1000 // 10 minutes cache for forecast
  ),
  getMarine: createCachedCall(
    () => api.get('/weather/marine?days=3'),
    'weather-marine',
    10 * 60 * 1000 // 10 minutes cache for marine data
  ),
};

// Authentication API (no caching, using authenticated api instance)
export const authAPI = {
  login: (credentials) => authApi.post('/auth/login', credentials),
  logout: () => authApi.delete('/auth/logout'),
  me: () => authApi.get('/auth/me'),
};

// Cache invalidation helpers
export const cacheInvalidators = {
  invalidateNews: () => {
    apiCache.invalidate('news-all');
  },
  invalidateEvents: () => {
    apiCache.invalidate('events-all');
  },
  invalidateSlides: () => {
    apiCache.invalidate('slides-all');
  },
  invalidateWeather: () => {
    apiCache.invalidate('weather-current');
    apiCache.invalidate('weather-forecast');
    apiCache.invalidate('weather-marine');
  },
  invalidateImages: () => {
    apiCache.invalidate('images-all');
    apiCache.invalidate('allImages'); // MediaLibrary hook key
  },
  invalidateSettings: () => {
    apiCache.invalidate('settings-all');
  },
  invalidateAll: () => {
    apiCache.clearAll();
  }
};

// Admin API calls (no caching, using authenticated api instance)
export const adminAPI = {
  news: {
    getAll: () => authApi.get('/admin/news'),
    getById: (id) => authApi.get(`/admin/news/${id}`),
    create: (data) => {
      const result = authApi.post('/admin/news', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateNews()).catch(() => {});
      return result;
    },
    update: (id, data) => {
      const result = authApi.put(`/admin/news/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateNews()).catch(() => {});
      return result;
    },
    delete: (id) => {
      const result = authApi.delete(`/admin/news/${id}`);
      result.then(() => cacheInvalidators.invalidateNews()).catch(() => {});
      return result;
    },
  },
  events: {
    getAll: () => authApi.get('/admin/events'),
    getById: (id) => authApi.get(`/admin/events/${id}`),
    create: (data) => {
      const result = authApi.post('/admin/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateEvents()).catch(() => {});
      return result;
    },
    update: (id, data) => {
      const result = authApi.put(`/admin/events/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateEvents()).catch(() => {});
      return result;
    },
    delete: (id) => {
      const result = authApi.delete(`/admin/events/${id}`);
      result.then(() => cacheInvalidators.invalidateEvents()).catch(() => {});
      return result;
    },
  },
  slides: {
    getAll: () => authApi.get('/admin/slides'),
    getById: (id, config) => authApi.get(`/admin/slides/${id}`, config),
    create: (data) => {
      const result = authApi.post('/admin/slides', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateSlides()).catch(() => {});
      return result;
    },
    update: (id, data) => {
      const result = authApi.put(`/admin/slides/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateSlides()).catch(() => {});
      return result;
    },
    delete: (id) => {
      const result = authApi.delete(`/admin/slides/${id}`);
      result.then(() => cacheInvalidators.invalidateSlides()).catch(() => {});
      return result;
    },
    reorder: (slidesData) => {
      const result = authApi.patch('/admin/slides/reorder', { slides: slidesData });
      result.then(() => cacheInvalidators.invalidateSlides()).catch(() => {});
      return result;
    },
  },
  images: {
    getAll: () => authApi.get('/admin/images/all'),
    /** Paginated list: GET /admin/images?limit=&cursor= */
    getPage: (limit = 24, cursor = null, folder = null) =>
      authApi.get('/admin/images', {
        params: { limit, ...(cursor && { cursor }), ...(folder && { folder }) },
      }),
    upload: (data) => {
      const result = authApi.post('/admin/images', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateImages()).catch(() => {});
      return result;
    },
    delete: (publicId) => {
      const result = authApi.delete(`/admin/images/${publicId}`);
      result.then(() => cacheInvalidators.invalidateImages()).catch(() => {});
      return result;
    },
  },
  settings: {
    getAll: () => authApi.get('/admin/settings'),
    getByKey: (key) => authApi.get(`/admin/settings/${key}`),
    update: (key, data) => authApi.put(`/admin/settings/${key}`, data),
    updateMultiple: (category, settings) =>
      authApi.put('/admin/settings/update_multiple', { category, settings }),
    create: (data) => authApi.post('/admin/settings', data),
    delete: (key) => authApi.delete(`/admin/settings/${key}`),
    initializeDefaults: () => authApi.post('/admin/settings/initialize_defaults'),
  },
  users: {
    getAll: () => authApi.get('/admin/users'),
    getById: (id) => authApi.get(`/admin/users/${id}`),
    create: (data) => authApi.post('/admin/users', data),
    update: (id, data) => authApi.put(`/admin/users/${id}`, data),
    delete: (id) => authApi.delete(`/admin/users/${id}`),
  },
};

// Export cache utilities for debugging
export { apiCache };

// Export the raw axios instance for backward compatibility
export default api; 