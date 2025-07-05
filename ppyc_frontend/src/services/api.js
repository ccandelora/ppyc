import axios from 'axios';

// Determine the API base URL based on the environment
const getApiBaseUrl = () => {
  // Check if we're in production environment
  if (import.meta.env.PROD) {
    // In production, check if there's a custom API URL set
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    // Force HTTP protocol in production to avoid SSL issues
    const hostname = window.location.hostname;
    return `http://${hostname}:3000/api/v1`;
  }
  // In development, use localhost
  return 'http://localhost:3000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

// Authentication API calls
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.delete('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Public API calls
export const postsAPI = {
  getAll: () => api.get('/posts'),
  getBySlug: (slug) => api.get(`/posts/${slug}`),
};

export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
};

export const pagesAPI = {
  getBySlug: (slug) => api.get(`/pages/${slug}`),
};

export const slidesAPI = {
  getAll: () => api.get('/slides'),
};

// Weather API service - now calls our secure backend API
export const weatherAPI = {
  current: (location) => {
    return api.get('/weather/current', { params: { location } });
  },
  forecast: (location, days = 3) => {
    return api.get('/weather/forecast', { params: { location, days } });
  },
  marine: (location, days = 3) => {
    return api.get('/weather/marine', { params: { location, days } });
  }
};

// Admin API calls (will require authentication)
export const adminAPI = {
  posts: {
    getAll: () => api.get('/admin/posts'),
    getById: (id) => api.get(`/admin/posts/${id}`),
    create: (data) => api.post('/admin/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    update: (id, data) => api.put(`/admin/posts/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    delete: (id) => api.delete(`/admin/posts/${id}`),
  },
  events: {
    getAll: () => api.get('/admin/events'),
    getById: (id) => api.get(`/admin/events/${id}`),
    create: (data) => api.post('/admin/events', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    update: (id, data) => api.put(`/admin/events/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    delete: (id) => api.delete(`/admin/events/${id}`),
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
    create: (data) => api.post('/admin/slides', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    update: (id, data) => api.put(`/admin/slides/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    delete: (id) => api.delete(`/admin/slides/${id}`),
    reorder: (slidesData) => api.patch('/admin/slides/reorder', { slides: slidesData }),
  },
  users: {
    getAll: () => api.get('/admin/users'),
    getById: (id) => api.get(`/admin/users/${id}`),
    create: (data) => api.post('/admin/users', { user: data }),
    update: (id, data) => api.put(`/admin/users/${id}`, { user: data }),
    delete: (id) => api.delete(`/admin/users/${id}`),
  },
  images: {
    getAll: (params = {}) => api.get('/admin/images', { params }),
    search: (params = {}) => api.get('/admin/images/search', { params }),
    upload: (file, folder = 'general') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      return api.post('/admin/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    uploadMultiple: (files, folder = 'general') => {
      const promises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        return api.post('/admin/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });
      return Promise.all(promises);
    },
    delete: (publicId) => api.delete(`/admin/images/${encodeURIComponent(publicId)}`),
  },
};

export default api; 