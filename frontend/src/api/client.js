// Axios API client configuration
import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true, // Enable cookie-based authentication
});

// Store will be set after store is created to avoid circular imports
let store = null;

export const setStore = (storeInstance) => {
  store = storeInstance;
};

// Request interceptor to add authorization header
client.interceptors.request.use(
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

// Response interceptor to handle 401 errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update Redux store state if available
      if (store) {
        const { authLogout } = require('../store');
        store.dispatch(authLogout());
      }
    }
    return Promise.reject(error);
  }
);

export default client;