import axiosInstance from './axiosInstance';
import {
  NewPostData,
  Post,
  PostsResponse,
  UpdatePostData,
} from '../types/post';

export const createPost = async (data: NewPostData): Promise<Post> => {
  const response = await axiosInstance.post<Post>('/posts', data);
  return response.data;
};

export const getPosts = async (page: number): Promise<PostsResponse> => {
  const response = await axiosInstance.get(`/posts/all?page=${page}`);
  return response.data;
};

export const getPost = async (
  id: string,
  signal?: AbortSignal
): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/posts/${id}`, { signal });
  return response.data;
};

export const updatePost = async (data: UpdatePostData): Promise<Post> => {
  const response = await axiosInstance.put<Post>(`/posts/${data._id}`, data);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}`);
};

export const likePost = async (id: string): Promise<void> => {
  await axiosInstance.post(`/posts/${id}/like`);
};

export const getPostsByUserId = async (
  page: number
): Promise<PostsResponse> => {
  const response = await axiosInstance.get(`/posts?page=${page}`);
  return response.data;
};
