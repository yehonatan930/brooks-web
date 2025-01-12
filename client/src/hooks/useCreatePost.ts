import { createPost } from '../services/postService';
import { toast } from 'react-toastify';
import { NewPostData, Post } from '../types/post';
import { useMutation } from 'react-query';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

export const useCreatePost = () => {
  const navigate = useNavigate();

  const { data: newPost, ...rest } = useMutation<
    Post,
    any,
    NewPostData,
    unknown
  >('createPost', createPost, {
    onSuccess: () => {
      toast.success('Post is created and added to your profile');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      navigate('/profile');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create post.');
    },
  });

  return { newPost, ...rest };
};
