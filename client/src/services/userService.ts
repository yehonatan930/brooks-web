import axiosInstance from './axiosInstance';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  UpdateUserVariables,
  User,
} from '../types/user';

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

export const updateUser = async ({
  userId,
  username,
  profilePictureFile: profilePicture,
}: UpdateUserVariables): Promise<User> => {
  const formData = new FormData();
  if (username) formData.append('username', username);
  if (profilePicture) formData.append('profilePicture', profilePicture);

  const response = await axiosInstance.put(`/users/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
