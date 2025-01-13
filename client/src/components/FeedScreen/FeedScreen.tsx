import React, { useState } from 'react';
import { CircularProgress, IconButton, Popover, Typography } from '@mui/material';
import { deletePost, getPosts } from '../../services/postService';
import DeleteIcon from '@mui/icons-material/Delete';
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
import OpenAI from "openai";


const FeedScreen: React.FC = () => {
  const [page, setPage] = useState(1);
  let [posts, setPosts] = useState<PostType[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const { _id: userId } = useAtomValue(loggedInUserAtom);
  const { mutate: likePost } = useLikePost();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [summary, setSummary] = useState<string>('');
  const openai = new OpenAI({ apiKey: `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`, dangerouslyAllowBrowser: true });

  const { data, isLoading } = useQuery(['posts', page], () => getPosts(page), {
    keepPreviousData: true,
  });

  posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLike = (postId: string) => {
    likePost({ postId, userId, page });
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

  const fetchBookSummary = async (bookTitle: string, event: React.MouseEvent<HTMLElement>) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          { role: 'user', content: `Hi chat, please give me a couple sentences summary of the book ${bookTitle}` },
        ], max_tokens: 100
      });

      setSummary(response.choices[0].message.content as string);
      setAnchorEl(event.currentTarget);
    } catch (error) {
      console.error('Error fetching book summary:', error);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSummary('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'book-summary-popover' : undefined;

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
            <h2
              className="feed__post-title"
              onMouseEnter={(event) => fetchBookSummary(post.bookTitle, event)}
              onMouseLeave={handlePopoverClose}
            >
              {post.bookTitle}
            </h2>
            <p className="feed__post-content">
              {expandedPosts.has(post._id) ? post.content : truncateContent(post.content, 100)}
              {post.content.length > 100 && (
                <span onClick={() => toggleExpandPost(post._id)} className="feed__post-readmore">
                  {expandedPosts.has(post._id) ? ' Show less' : ' Read more'}
                </span>
              )}
            </p>

            <div className="feed__post-actions">
              <Link to={`/post/${post._id}`}>
                <IconButton>
                  <VisibilityIcon fontSize="inherit" />
                </IconButton>
              </Link>
              {post.userId === userId && (
                <IconButton onClick={() => handleDeletePost(post._id)}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>)}
            </div>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Typography sx={{ p: 2 }}>{summary}</Typography>
            </Popover>
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