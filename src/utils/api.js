import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gigflow-servicehive-f4jt.onrender.com/api',
  withCredentials: true,
});

export default api;
