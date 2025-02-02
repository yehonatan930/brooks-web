import axiosInstance from './axiosInstance';
import {
  AccessToken,
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

export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  const response = await axiosInstance.post<AccessToken>('/auth/refresh', {
    refreshToken,
  });
  return response.data.accessToken;
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
  profilePictureFile,
}: UpdateUserVariables): Promise<User> => {
  const formData = new FormData();
  if (username) formData.append('username', username);
  if (profilePictureFile) formData.append('profilePicture', profilePictureFile);

  const response = await axiosInstance.put<User>(`/users/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const googleLogin = async (
  credential: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/google', {
    credential,
  });
  return response.data;
};
