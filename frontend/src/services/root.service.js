import axios from 'axios';

const baseURL = (
  import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api'
).replace(/\/$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
