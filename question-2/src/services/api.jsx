import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const fetchUsers = () => api.get('/users');
export const fetchPosts = () => api.get('/posts');
export const fetchTopUsers = () => api.get('/analytics/top-users');
export const fetchTrendingPosts = () => api.get('/analytics/trending-posts');

export default api;