import { createPost } from '../services/postService';
import { toast } from 'react-toastify';
import { NewPostFormData, Post } from '../types/post';
import { useMutation } from 'react-query';
import { useAtom } from 'jotai';
import { loggedInUserAtom } from '../context/UserAtom';

export const useCreatePost = (newPostData: NewPostFormData) => {
  const [loggedInUser, _] = useAtom(loggedInUserAtom);

  const {
    data: newPost,
    isLoading,
    error,
    mutate,
  } = useMutation<Post>(
    'createPost',
    async () => await createPost({ ...newPostData, userId: loggedInUser.id }),
    {
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to create post.');
      },
    }
  );

  return { newPost, isLoading, error, mutate };
};
