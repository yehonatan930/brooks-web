import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Replace with your API base URL
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `jwt ${token}`;
    }

    return config;
});

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
};

interface LoginData {
    email: string;
    password: string;
}

export const loginUser = async (data: LoginData) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
};
export const getUser = async (email: string) => {
    const response = await axiosInstance.get(`/users/${email}`);
    return response.data;
};