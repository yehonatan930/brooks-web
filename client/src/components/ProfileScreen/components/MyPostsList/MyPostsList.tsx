import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useGetMyPosts } from '../../../../hooks/api/useGetMyPosts';
import './MyPostsList.scss';
import { Post } from '../../../../types/post';
import MyPost from '../MyPost/MyPost';
import PaginationControls from '../../../PaginationControls/PaginationControls';

interface MyPostListProps {}

const MyPostList: React.FC<MyPostListProps> = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyPosts(page);
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
      {isLoading ? (
        <CircularProgress />
      ) : posts ? (
        posts.map((post) => (
          <MyPost
            key={post._id}
            _id={post._id}
            bookTitle={post.bookTitle}
            content={post.content}
            imageUrl={post.imageUrl}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
      <PaginationControls
        totalPages={totalPages}
        onPageChange={setPage}
        page={page}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  );
};

export default MyPostList;
