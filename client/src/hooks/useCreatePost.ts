import { createPost } from '../services/postService';
import { toast } from 'react-toastify';
import { NewPostData } from '../types/post';
import { useMutation } from 'react-query';

export const useCreatePost = (newPostData: NewPostData) => {
  const {
    data: newPost,
    isLoading,
    error,
    mutate,
  } = useMutation('createPost', async () => await createPost(newPostData), {
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create post.');
    },
  });

  return { newPost, isLoading, error, mutate };
};
