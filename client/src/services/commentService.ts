import axiosInstance from './axiosInstance';
import { Comment } from '../types/comment';
const API_URI = '/comments';

export const getComments = async (postId: string) => {
  try {
    const response = await axiosInstance.get(`${API_URI}/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (postId: string, content: string, userId: string): Promise<Comment> => {
  try {
    const response = await axiosInstance.post(`${API_URI}/${postId}`, { content, userId });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    await axiosInstance.delete(`${API_URI}/${commentId}`);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};