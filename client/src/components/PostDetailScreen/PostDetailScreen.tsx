import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getPost } from '../../services/postService';
import { Post } from '../../types/post';
import './PostDetailScreen.scss';
import { useAtomValue } from 'jotai/index';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';

const PostDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { _id: userId } = useAtomValue(loggedInUserAtom);

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchPost = async () => {
      try {
        const fetchedPost = await getPost(id!, signal);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleEditClick = () => {
    navigate('/post/edit/' + id);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div className="post-detail">
      <div className="post-detail__card">
        {post.userId === userId && (
          <Button
            variant="contained"
            className="edit-button"
            onClick={handleEditClick}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        )}
        <div className="post-detail__left">
          {post.imageUrl && <img src={post.imageUrl} alt={post.bookTitle} />}
        </div>
        <div className="post-detail__right">
          <h1>{post.bookTitle}</h1>
          {post.authorName && <h3>by {post.authorName}</h3>}
          {post.readingProgress && (
            <p>Reading Progress: {post.readingProgress}</p>
          )}
          <p>{post.content}</p>
        </div>
      </div>
    </div>
  );
};

export default PostDetailScreen;
