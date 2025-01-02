import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Replace with your API base URL
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `jwt ${token}`;
    }

    config.headers.Authorization = `jwt 2b1a4dd2e06be19220b154a848d8a57fb4fcefbf17f212ccfcbb56aaa77faa899ba3c5a92db29c6e377a6ea17114777529beb060b5b6255392a5a2b8d9ce8eac`;

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