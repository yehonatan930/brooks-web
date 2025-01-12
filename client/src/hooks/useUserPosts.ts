// client/src/hooks/useUserPosts.ts
import { useQuery } from 'react-query';
import { getPostsByUserId } from '../services/postService';
import { Post } from '../types/post';

export const useUserPosts = () => {
  return useQuery<Post[], Error>('userPosts', getPostsByUserId);
};