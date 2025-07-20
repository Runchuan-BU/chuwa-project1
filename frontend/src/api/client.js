//AXIOS
import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true, // for cookie-based auth
});

export default client;

//need update