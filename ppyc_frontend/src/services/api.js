import axios from 'axios';
import apiCache from '../utils/apiCache';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to false for public endpoints
});

// Create a separate instance for authenticated endpoints
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
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
    if (error.response?.status === 401) {
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
      result.then(() => cacheInvalidators.invalidateNews());
      return result;
    },
    update: (id, data) => {
      const result = authApi.put(`/admin/news/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateNews());
      return result;
    },
    delete: (id) => {
      const result = authApi.delete(`/admin/news/${id}`);
      result.then(() => cacheInvalidators.invalidateNews());
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
      result.then(() => cacheInvalidators.invalidateEvents());
      return result;
    },
    update: (id, data) => {
      const result = authApi.put(`/admin/events/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateEvents());
      return result;
    },
    delete: (id) => {
      const result = authApi.delete(`/admin/events/${id}`);
      result.then(() => cacheInvalidators.invalidateEvents());
      return result;
    },
  },
  slides: {
    getAll: () => authApi.get('/admin/slides'),
    getById: (id) => authApi.get(`/admin/slides/${id}`),
    create: (data) => {
      const result = authApi.post('/admin/slides', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateSlides());
      return result;
    },
    update: (id, data) => {
      const result = authApi.put(`/admin/slides/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateSlides());
      return result;
    },
    delete: (id) => {
      const result = authApi.delete(`/admin/slides/${id}`);
      result.then(() => cacheInvalidators.invalidateSlides());
      return result;
    },
  },
  images: {
    getAll: () => authApi.get('/admin/images/all'),
    upload: (data) => {
      const result = authApi.post('/admin/images', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateImages());
      return result;
    },
    delete: (publicId) => {
      const result = authApi.delete(`/admin/images/${publicId}`);
      result.then(() => cacheInvalidators.invalidateImages());
      return result;
    },
  },
};

// Export cache utilities for debugging
export { apiCache };

// Export the raw axios instance for backward compatibility
export default api; 