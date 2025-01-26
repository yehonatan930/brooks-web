import React, { useState, useEffect } from 'react';
import {
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
import './CommentSection.scss';
import {
  addComment,
  deleteComment,
  getComments,
} from '../../../../services/commentService';
import { Comment } from '../../../../types/comment';
import { useAtomValue } from 'jotai/index';
import { loggedInUserAtom } from '../../../../context/LoggedInUserAtom';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { _id: userId } = useAtomValue(loggedInUserAtom);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchComments = async () => {
      try {
        const comments = await getComments(postId, signal);
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
      const response = await addComment(postId, newComment, userId);
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

  return (
    <div className="comment-section">
      <List className="comment-list">
        {comments.map((comment) => (
          <ListItem key={comment._id} className="comment-item">
            <ListItemAvatar>
              <Avatar>{comment.userId.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={comment.content}
              secondary={comment.createdAt}
            />
            <IconButton
              onClick={() => handleDeleteComment(comment._id)}
              className="delete-button"
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
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
    </div>
  );
};

export default CommentSection;
