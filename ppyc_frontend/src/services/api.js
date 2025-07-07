import axios from 'axios';
import apiCache from '../utils/apiCache';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
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
  return () => apiCache.request(cacheKey, apiCall, ttl);
};

// Public API calls with caching
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
    2 * 60 * 1000 // 2 minutes cache for slides (more dynamic)
  ),
};

export const weatherAPI = {
  getCurrent: createCachedCall(
    () => api.get('/weather/current'),
    'weather-current',
    10 * 60 * 1000 // 10 minutes cache for weather
  ),
  getForecast: createCachedCall(
    () => api.get('/weather/forecast'),
    'weather-forecast',
    15 * 60 * 1000 // 15 minutes cache for forecast
  ),
  getMarine: createCachedCall(
    () => api.get('/weather/marine'),
    'weather-marine',
    15 * 60 * 1000 // 15 minutes cache for marine data
  ),
};

// Authentication API (no caching for auth)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.delete('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Cache invalidation helpers
export const cacheInvalidators = {
  invalidateNews: () => {
    apiCache.invalidate('news-all');
    // Also invalidate individual news items if needed
  },
  invalidateEvents: () => {
    apiCache.invalidate('events-all');
    // Also invalidate individual events if needed
  },
  invalidateSlides: () => {
    apiCache.invalidate('slides-all');
  },
  invalidateWeather: () => {
    apiCache.invalidate('weather-current');
    apiCache.invalidate('weather-forecast');
    apiCache.invalidate('weather-marine');
  },
  invalidateAll: () => {
    apiCache.clearAll();
  }
};

// Admin API calls (no caching for admin operations)
export const adminAPI = {
  news: {
    getAll: () => api.get('/admin/news'),
    getById: (id) => api.get(`/admin/news/${id}`),
    create: (data) => {
      const result = api.post('/admin/news', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Invalidate cache after successful creation
      result.then(() => cacheInvalidators.invalidateNews());
      return result;
    },
    update: (id, data) => {
      const result = api.put(`/admin/news/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Invalidate cache after successful update
      result.then(() => cacheInvalidators.invalidateNews());
      return result;
    },
    delete: (id) => {
      const result = api.delete(`/admin/news/${id}`);
      // Invalidate cache after successful deletion
      result.then(() => cacheInvalidators.invalidateNews());
      return result;
    },
  },
  events: {
    getAll: () => api.get('/admin/events'),
    getById: (id) => api.get(`/admin/events/${id}`),
    create: (data) => {
      const result = api.post('/admin/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateEvents());
      return result;
    },
    update: (id, data) => {
      const result = api.put(`/admin/events/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateEvents());
      return result;
    },
    delete: (id) => {
      const result = api.delete(`/admin/events/${id}`);
      result.then(() => cacheInvalidators.invalidateEvents());
      return result;
    },
  },
  pages: {
    getAll: () => api.get('/admin/pages'),
    getById: (id) => api.get(`/admin/pages/${id}`),
    create: (data) => api.post('/admin/pages', data),
    update: (id, data) => api.put(`/admin/pages/${id}`, data),
    delete: (id) => api.delete(`/admin/pages/${id}`),
  },
  slides: {
    getAll: () => api.get('/admin/slides'),
    getById: (id) => api.get(`/admin/slides/${id}`),
    create: (data) => {
      const result = api.post('/admin/slides', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateSlides());
      return result;
    },
    update: (id, data) => {
      const result = api.put(`/admin/slides/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      result.then(() => cacheInvalidators.invalidateSlides());
      return result;
    },
    delete: (id) => {
      const result = api.delete(`/admin/slides/${id}`);
      result.then(() => cacheInvalidators.invalidateSlides());
      return result;
    },
    reorder: (slidesData) => {
      const result = api.patch('/admin/slides/reorder', { slides: slidesData });
      result.then(() => cacheInvalidators.invalidateSlides());
      return result;
    },
  },
  users: {
    getAll: () => api.get('/admin/users'),
    getById: (id) => api.get(`/admin/users/${id}`),
    create: (data) => api.post('/admin/users', data),
    update: (id, data) => api.put(`/admin/users/${id}`, data),
    delete: (id) => api.delete(`/admin/users/${id}`),
  },
  images: {
    getAll: () => api.get('/admin/images'),
    upload: (data) => api.post('/admin/images', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    delete: (id) => api.delete(`/admin/images/${id}`),
    search: (query) => api.get(`/admin/images/search?q=${encodeURIComponent(query)}`),
  },
};

// Export cache utilities for debugging
export { apiCache };

// Export the raw axios instance for backward compatibility
export default api; 