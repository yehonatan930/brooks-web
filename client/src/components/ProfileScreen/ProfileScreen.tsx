import React, { useEffect } from 'react';
import './ProfileScreen.scss';
import { useUser } from '../../context/UserContext';
import { useFetchUser } from '../../hooks/useLogin';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';

const ProfileScreen: React.FC = () => {
  const { user, setUser } = useUser();
  const { user: fetchedUser } = useFetchUser();

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser, setUser]);

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
      </div>
    );
  } else {
    return <LoadingSpinner />;
  }
};

export default ProfileScreen;
