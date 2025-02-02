import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { getPost } from '../../services/postService';
import { Post } from '../../types/post';
import './PostDetailScreen.scss';
import { useAtomValue } from 'jotai/index';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import {
  CircularProgress,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  addComment,
  deleteComment,
  getComments,
} from '../../services/commentService';
import { Comment } from '../../types/comment';

const PostDetailScreen: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { _id: userId } = useAtomValue(loggedInUserAtom);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchComments = async () => {
      try {
        const comments = await getComments(postId || '', signal);
        setComments(comments || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();

    return () => {
      controller.abort();
    };
  }, [postId]);

  const handleAddComment = async () => {
    try {
      const response = await addComment(postId || '', newComment, userId);
      setComments([...comments, response]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchPost = async () => {
      try {
        const fetchedPost = await getPost(postId!, signal);
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
  }, [postId]);

  const handleEditClick = () => {
    navigate('/post/edit/' + postId);
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
      <div className="post-detail__comments-section">
        <div className="comment-input">
          <TextField
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            multiline
          />
          <Button
            onClick={handleAddComment}
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
          >
            Add Comment
          </Button>
        </div>
        <List className="comment-list">
          {comments.map((comment) => (
            <ListItem key={comment._id} className="comment-item">
              <ListItemText
                primary={comment.content}
                secondary={comment.createdAt}
              />
              {comment.userId === userId && (
                <IconButton
                  onClick={() => handleDeleteComment(comment._id)}
                  className="delete-button"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default PostDetailScreen;
