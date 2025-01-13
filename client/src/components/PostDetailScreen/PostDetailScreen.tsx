import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getPost, updatePost } from '../../services/postService';
import { Post } from '../../types/post';
import './PostDetailScreen.scss';
import { useAtomValue } from 'jotai/index';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';

const PostDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [readingProgress, setReadingProgress] = useState('');
  const [authorName, setAuthorName] = useState('');
  const { _id: userId } = useAtomValue(loggedInUserAtom);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPost(id!);
        setPost(fetchedPost);
        setPostContent(fetchedPost.content);
        setReadingProgress(fetchedPost.readingProgress || '');
        setAuthorName(fetchedPost.authorName || '');
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = async () => {
    if (post) {
      try {
        const updatedPost = { ...post, content: postContent, readingProgress, authorName };
        await updatePost(post._id, updatedPost);
        setPost(updatedPost);
        setIsEditMode(false);
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div className="post-detail">
      {post.userId === userId && (
        <button
          className="edit-button"
          onClick={isEditMode ? handleSaveClick : handleEditClick}
        >
          <EditIcon />
          {isEditMode ? 'Save' : 'Edit'}
        </button>)
      }
      <div className="post-detail__left">
        {isEditMode ? (
          <>
            <input
              type="text"
              placeholder="Reading Progress"
              value={readingProgress}
              onChange={(e) => setReadingProgress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </>
        ) : (
          <>
            {post.readingProgress && (
              <p>📚 Reading Progress: {post.readingProgress}</p>
            )}
            {post.authorName && (
              <p>✍️ Author: {post.authorName}</p>
            )}
          </>
        )}
      </div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="post-detail__image" />
      )}
      <div className="post-detail__content">
        <h2>{post.bookTitle}</h2>
        {isEditMode ? (
          <textarea
            rows={8}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        ) : (
          <p>{post.content}</p>
        )}
      </div>
    </div>
  );
};

export default PostDetailScreen;