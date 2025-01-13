import React, { useState } from 'react';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { useUserPosts } from '../../../../hooks/useUserPosts';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import './UserPostList.scss';
import { Post } from '../../../../types/post';

interface UserPostListProps {
  userId: string;
}

const UserPostList: React.FC<UserPostListProps> = ({ userId }) => {
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

  const handleDeletePost = (postId: string) => {
    // Implement delete post functionality here
    console.log(`Delete post with ID: ${postId}`);
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
                <div className="profile__post-actions">
                  <Link to={`/post/${post._id}`}>
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                  <Link to={`/post/edit/${post._id}`}>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton onClick={() => handleDeletePost(post._id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
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

export default UserPostList;