import axios, { AxiosResponse } from 'axios';
import { User } from '../context/UserContext';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
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

interface LoginData {
    email: string;
    password: string;
}

export interface UpdateUserData {
    username: string;
    email: string;
    profilePicture: string;
}

export const registerUser = async (data: RegisterData) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
};

export const loginUser = async (data: LoginData) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
};

export const getUser = async () => {
    const response = await axiosInstance.get(`/users/user`);
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
};

export const updateUser: (data: UpdateUserData) => Promise<User> = async (data: Partial<User>) => {
    const response: AxiosResponse<User> = await axiosInstance.put(`/users/${data.email}`, data);
    return response.data;
};