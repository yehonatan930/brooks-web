import { useMutation, useQueryClient } from 'react-query';
import { likePost } from '../../services/postService';

const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      postId,
      userId,
      page,
    }: {
      postId: string;
      userId: string;
      page: number;
    }) => {
      await likePost(postId);
    },
    {
      onMutate: async ({ postId, userId, page }) => {
        await queryClient.cancelQueries(['posts', page]);

        const previousPosts = queryClient.getQueryData(['posts', page]);

        queryClient.setQueryData(['posts', page], (old: any) => {
          if (!old) return {};

          return {
            ...old,
            posts: old.posts.map((post: any) =>
              post._id === postId
                ? {
                    ...post,
                    likes: post.likes.includes(userId)
                      ? post.likes.filter((id: string) => id !== userId)
                      : [...post.likes, userId],
                  }
                : post
            ),
          };
        });

        return { previousPosts };
      },
      onError: (
        err,
        variables,
        context: { previousPosts: unknown } | undefined
      ) => {
        if (context?.previousPosts) {
          queryClient.setQueryData(
            ['posts', variables.page],
            context.previousPosts
          );
        }
      },
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries(['posts', variables.page]);
      },
    }
  );
};

export default useLikePost;
