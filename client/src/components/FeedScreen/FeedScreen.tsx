import React, { useEffect, useState } from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import { getPosts, deletePost, likePost } from '../../services/postService';
import { Post as PostType } from '../../types/post';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './FeedScreen.scss';
import { useAtomValue } from 'jotai/index';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import { Link } from 'react-router-dom';
import PostLikes from './components/PostLikes/PostLikes';
import useLikePost from '../../hooks/useLikePost';
import { useQuery } from 'react-query';
import { Post as PostType } from '../../types/post';
import PaginationControls from './components/PaginationControls/PaginationControls';

const FeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const { _id: userId } = useAtomValue(loggedInUserAtom);

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

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, likes: [...post.likes, userId] } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const toggleExpandPost = (postId: string) => {
    setExpandedPosts(prev => {
      const newExpandedPosts = new Set(prev);
      if (newExpandedPosts.has(postId)) {
        newExpandedPosts.delete(postId);
      } else {
        newExpandedPosts.add(postId);
      }
      return newExpandedPosts;
    });
  };

  const truncateContent = (content: string, limit: number) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + '...';
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className="feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="feed__post">
            <PostLikes
              postId={post._id}
              likesCount={post.likes?.length || 0}
              userId={userId}
              postUserId={post.userId}
              onLike={handleLike}
            />
            {post.imageUrl && <img src={post.imageUrl} alt={post.imageUrl} className="feed__post-image" />}
            <h2 className="feed__post-title">{post.bookTitle}</h2>
            <p className="feed__post-content">
              {expandedPosts.has(post._id) ? post.content : truncateContent(post.content, 100)}
              {post.content.length > 100 && (
                <span onClick={() => toggleExpandPost(post._id)} className="feed__post-readmore">
                  {expandedPosts.has(post._id) ? ' Show less' : ' Read more'}
                </span>
              )}
            </p>
            {post.userId === userId && (
              <div className="feed__post-actions">
                <Link to={`/post/${post._id}`}>
                  <IconButton>
                    <VisibilityIcon fontSize="inherit" />
                  </IconButton>
                </Link>
                <Link to={`/post/edit/${post._id}`}>
                  <IconButton>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Link>
                <IconButton onClick={() => handleDeletePost(post._id)}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
      <PaginationControls
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default FeedScreen;