import { useQuery } from 'react-query';
import { getPost } from '../../services/postService';
import { Post } from '../../types/post';

export const useGetPost = (postId: string) => {
  return useQuery<Post, Error>(['getPOst', postId], () => getPost(postId), {
    enabled: !!postId,
  });
};
