import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  // baseURL: 'http://3.26.96.188:5001', // live
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
});

// Add JWT token automatically if present in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) {
        const { token } = JSON.parse(raw);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Token attached to request:', config.url);
        }
      }
    } catch (err) {
      console.error('Failed to attach token', err);
    }
    
    // Log request details for debugging
    console.log('Making request to:', config.baseURL + config.url);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.warn('Unauthorized - clearing auth data');
      localStorage.removeItem('auth_user');
      // Optionally redirect to login
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;