// Axios API client configuration
import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true, // Enable cookie-based authentication
});

export default client;