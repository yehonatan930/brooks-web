import React, { useState } from 'react';
import { CircularProgress, IconButton, Popper } from '@mui/material';
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
import { HfInference } from "@huggingface/inference";
import debounce from 'lodash/debounce';

const FeedScreen: React.FC = () => {
  const [page, setPage] = useState(1);
  let [posts, setPosts] = useState<PostType[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const { _id: userId } = useAtomValue(loggedInUserAtom);
  const { mutate: likePost } = useLikePost();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);

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

  const fetchBookSummary = debounce(async (bookTitle: string, event: React.MouseEvent<HTMLElement>) => {
    if (!summary || summary === '') {
      setAnchorEl(event.target as HTMLElement);
      setLoadingSummary(true);
      const hf = new HfInference(process.env.REACT_APP_HUGGINGFACE_API_KEY || '');

      try {
        const response = await hf.textGeneration({
          model: 'EleutherAI/gpt-neo-1.3B',
          inputs: `What is the book ${bookTitle} about?`,
          parameters: { max_length: 400 },
        });
        setSummary(response.generated_text as string);
      } catch (error) {
        console.error('Error fetching book summary:', error);
        setSummary('Failed to fetch summary.');
      } finally {
        setLoadingSummary(false);
      }
    }
  }, 500);

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
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
            <Popper
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              placement="bottom"
              disablePortal={false}
              modifiers={[
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'window',
                  },
                },
              ]}
            >
              <div className="summary-box" style={{ background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                {loadingSummary ? <CircularProgress size={20} /> : summary || 'Hover over a title to see the summary'}
              </div>
            </Popper>
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