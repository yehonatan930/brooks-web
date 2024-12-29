import axios from 'axios';

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData) => {
    const response = await axios.post('http://localhost:8080/auth/register', data);
    return response.data;
};

interface LoginData {
    email: string;
    password: string;
}

export const loginUser = async (data: LoginData) => {
    const response = await axios.post('http://localhost:8080/auth/login', data);
    return response.data;
};