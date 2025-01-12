import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { getPosts } from '../../services/postService';
import { Post as PostType } from '../../types/post';
import './FeedScreen.scss';

type FeedScreenProps = {};

const FeedScreen: React.FC<FeedScreenProps> = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className="feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="feed__post">
            {post.imageUrl && <img src={post.imageUrl} alt={post.imageUrl} className="feed__post-image" />}
            <h2 className="feed__post-title">{post.bookTitle}</h2>
            <p className="feed__post-content">{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default FeedScreen;