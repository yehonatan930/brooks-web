import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getPost } from '../../services/postService';
import { Post } from '../../types/post';
import './PostDetailScreen.scss';

const PostDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPost(id!);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div className="post-detail">
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="post-detail__image" />
      )}
      <div className="post-detail__content">
        <h2>{post.bookTitle}</h2>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostDetailScreen;