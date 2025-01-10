import axios, { AxiosResponse } from 'axios';
import { User } from '../context/UserContext';
import axiosInstance from './axiosInstance';
import { LoginData, RegisterData, UpdateUserData } from '../types/user';

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

export const updateUser: (data: UpdateUserData) => Promise<User> = async (
  data: Partial<User>
) => {
  const response: AxiosResponse<User> = await axiosInstance.put(
    `/users/${data.email}`,
    data
  );
  return response.data;
};
