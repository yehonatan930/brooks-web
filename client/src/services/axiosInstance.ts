import axios, { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `jwt ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axiosInstance.post('/auth/refresh', {
            refreshToken,
          });

          localStorage.setItem('accessToken', response.data.accessToken);
          return axiosInstance(originalRequest);
        } catch (error) {
          console.error(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
