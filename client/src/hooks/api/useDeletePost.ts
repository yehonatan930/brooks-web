import { deletePost } from '../../services/postService';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';

export const useDeletePost = () => {
  const { data: newPost, ...rest } = useMutation<void, any, string, unknown>(
    'delete',
    deletePost,
    {
      onSuccess: () => {
        toast.success('Post deleted');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to delete post.');
      },
    }
  );

  return { newPost, ...rest };
};
