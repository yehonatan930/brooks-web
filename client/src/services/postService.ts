import axiosInstance from './axiosInstance';
import { NewPostData, Post, PostsResponse } from '../types/post';

export const createPost = async (data: NewPostData): Promise<Post> => {
  const response = await axiosInstance.post<Post>('/posts', data);
  return response.data;
};

export const getPosts = async (page: number): Promise<PostsResponse> => {
  const response = await axiosInstance.get(`/posts/all?page=${page}`);
  return response.data;
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/posts/${id}`);
  return response.data;
};

export const updatePost = async (
  id: string,
  data: NewPostData
): Promise<Post> => {
  const response = await axiosInstance.put<Post>(`/posts/${id}`, data);
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
