import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { LoginData, LoginResponse, RegisterData, UpdateUserData, User } from '../types/user';

export const registerUser = async (data: RegisterData): Promise<void> => {
  await axiosInstance.post('/auth/register', data);
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${id}`);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const updateUser = async (data: UpdateUserData): Promise<User> => {
  const response: AxiosResponse<User> = await axiosInstance.put<User>(
    `/users/${data.id}`,
    data
  );
  return response.data;
};
