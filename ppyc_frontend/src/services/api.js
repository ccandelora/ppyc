import axios from 'axios';

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

export default api;

// Public API calls
export const newsAPI = {
  getAll: () => api.get('/news'),
  getBySlug: (slug) => api.get(`/news/${slug}`),
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

export const weatherAPI = {
  getCurrent: () => api.get('/weather/current'),
  getForecast: () => api.get('/weather/forecast'),
  getMarine: () => api.get('/weather/marine'),
};

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.delete('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Admin API calls (will require authentication)
export const adminAPI = {
  news: {
    getAll: () => api.get('/admin/news'),
    getById: (id) => api.get(`/admin/news/${id}`),
    create: (data) => api.post('/admin/news', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    update: (id, data) => api.put(`/admin/news/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    delete: (id) => api.delete(`/admin/news/${id}`),
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