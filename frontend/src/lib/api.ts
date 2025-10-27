import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle validation errors
    if (error.response?.status === 400 && error.response?.data?.errors) {
      const validationErrors = error.response.data.errors;
      const errorMessage = Object.values(validationErrors).join(', ');
      error.message = errorMessage;
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', userData),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock'),
  search: (term: string) => api.get(`/products/search?term=${term}`),
  create: (product: any) => api.post('/products', product),
  update: (id: number, product: any) => api.put(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (category: any) => api.post('/categories', category),
  update: (id: number, category: any) => api.put(`/categories/${id}`, category),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id: number) => api.get(`/suppliers/${id}`),
  create: (supplier: any) => api.post('/suppliers', supplier),
  update: (id: number, supplier: any) => api.put(`/suppliers/${id}`, supplier),
  delete: (id: number) => api.delete(`/suppliers/${id}`),
};

// Issuances API
export const issuancesAPI = {
  getAll: () => api.get('/issuances'),
  getById: (id: number) => api.get(`/issuances/${id}`),
  getByDateRange: (startDate: string, endDate: string) =>
    api.get(`/issuances/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (issuance: any) => api.post('/issuances', issuance),
  delete: (id: number) => api.delete(`/issuances/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
