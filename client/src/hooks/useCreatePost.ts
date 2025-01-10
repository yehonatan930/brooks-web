import { createPost } from '../services/postService';
import { toast } from 'react-toastify';
import { NewPostData, Post } from '../types/post';
import { useMutation } from 'react-query';

export const useCreatePost = () => {
  const { data: newPost, ...rest } = useMutation<
    Post,
    any,
    NewPostData,
    unknown
  >('createPost', createPost, {
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create post.');
    },
  });

  return { newPost, ...rest };
};
