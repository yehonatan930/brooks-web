import React, { useState } from 'react';
import { CircularProgress, Button } from '@mui/material';
import { useUserPosts } from '../../../../hooks/useUserPosts';
import './PostList.scss';
import { Post } from '../../../../types/post';

interface PostListProps {
  userId: string;
}

const PostList: React.FC<PostListProps> = ({ userId }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserPosts(userId, page);
  const posts: Post[] = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="profile__posts">
      <h3>User Posts</h3>
      {isLoading ? (
        <CircularProgress />
      ) : (
        posts ? (
          posts.map((post) => (
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
        ) : (
          <p>No posts available</p>
        )
      )}
      <div className="pagination-controls">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PostList;