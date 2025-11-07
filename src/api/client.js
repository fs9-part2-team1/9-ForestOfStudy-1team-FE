import axios from 'axios';

const client = axios.create({
  // baseURL: '/api',
  baseURL: import.meta.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
