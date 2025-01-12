import React from 'react';
import { CircularProgress } from '@mui/material';
import { useUserPosts } from '../../../../hooks/useUserPosts';
import './PostList.scss';

interface PostListProps {
  userId: string;
}

const PostList: React.FC<PostListProps> = ({ userId }) => {
  const { data: posts, isLoading: postsLoading } = useUserPosts();

  return (
    <div className="profile__posts">
      <h3>User Posts</h3>
      {postsLoading ? (
        <CircularProgress />
      ) : (
        posts?.map((post) => (
          <div key={post._id} className="profile__post">
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="profile__post-image"
              />
            )}
            <div className="profile__post-content">
              <h4>{post.bookTitle}</h4>
              <p>{post.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;