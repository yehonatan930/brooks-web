import React, { useEffect } from 'react';
import './ProfileScreen.scss';
import { useFetchUser } from '../../hooks/useFetchUser';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import { useAtom } from 'jotai';
import { useUserPosts } from '../../hooks/useUserPosts';
import { CircularProgress } from '@mui/material';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useAtom(loggedInUserAtom);
  const { user: fetchedUser, isSuccess: fetchSucceeded } = useFetchUser(user._id);
  const { data: posts, isLoading: postsLoading } = useUserPosts();

  useEffect(() => {
    if (fetchSucceeded && fetchedUser) {
      setUser({ ...fetchedUser, _id: user._id });
    }
  }, [fetchSucceeded, fetchedUser, setUser, user._id]);

  if (fetchedUser) {
    return (
      <div className="profile__container">
        <h2 className="profile__title">Profile</h2>
        {user && (
          <div className="profile__details">
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="profile__picture"
              />
            )}
            <p className="profile__detail">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="profile__detail">
              <strong>Email:</strong> {user.email}
            </p>
            <Link to="/profile/edit" className="profile__edit-link">
              Edit Profile
            </Link>
          </div>
        )}
        <div className="profile__posts">
          <h3>User Posts</h3>
          {postsLoading ? (
            <CircularProgress />
          ) : (
            posts?.map((post) => (
              <div key={post._id} className="profile__post">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="profile__post-image"
                  />
                )}
                <div className="profile__post-content">
                  <h4>{post.bookTitle}</h4>
                  <p>{post.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } else {
    return <LoadingSpinner />;
  }
};

export default ProfileScreen;