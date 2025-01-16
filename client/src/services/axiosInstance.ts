import axios, { InternalAxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_HTTPS_URL
      : process.env.REACT_APP_API_HTTP_URL,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `jwt ${token}`;
  }
  return config;
});

export default axiosInstance;
