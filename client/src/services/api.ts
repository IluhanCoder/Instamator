// Base Axios instance for all API requests
import axios from 'axios';

// Use environment variable for API URL in production
const baseURL = (import.meta as any).env?.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  // Remove withCredentials since we're using JWT tokens in headers, not cookies
  // withCredentials: true,
});

console.log('API base URL:', baseURL);

// Attach auth token to all requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API request - Token present:', !!token);
  console.log('API request - URL:', config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
