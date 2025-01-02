import React, { useEffect } from 'react';
import './ProfileScreen.scss';
import { useUser } from '../../context/UserContext';
import { useFetchUser } from '../../hooks/useLogin';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ProfileScreen: React.FC = () => {
  const { user, setUser } = useUser();
  const {
    user: fetchedUser
  } = useFetchUser(user?.email || '');

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
            <p className="profile__detail">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="profile__detail">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
      </div>
    );
  } else {
    return (<LoadingSpinner />);
  }
};

export default ProfileScreen;
