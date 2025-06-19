import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const studentService = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (student) => {
    const response = await api.post('/students', student);
    return response.data;
  },

  update: async (id, student) => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/students/${id}`);
  },

  sync: async (id) => {
    const response = await api.post(`/students/${id}/sync`);
    return response.data;
  }
};

export const codeforcesService = {
  getContests: async (studentId, days) => {
    const response = await api.get(`/codeforces/contests/${studentId}?days=${days}`);
    return response.data;
  },

  getProblems: async (studentId, days) => {
    const response = await api.get(`/codeforces/problems/${studentId}?days=${days}`);
    return response.data;
  },

  syncAll: async () => {
    const response = await api.post('/codeforces/sync-all');
    return response.data;
  }
};

export const settingsService = {
  get: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  update: async (settings) => {
    const response = await api.put('/settings', settings);
    return response.data;
  }
};

export default api;