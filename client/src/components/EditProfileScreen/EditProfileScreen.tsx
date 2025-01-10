import React, { ChangeEvent, useEffect, useState } from 'react';
import './EditProfileScreen.scss';
import { useUpdateLoggedInUser } from '../../hooks/useUpdateUser';
import { loggedInUserAtom } from '../../context/UserAtom';
import { useAtom } from 'jotai';

const EditProfileScreen: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useAtom(loggedInUserAtom);
  const [username, setUsername] = useState<string>(
    loggedInUser?.username || ''
  );
  const [email, setEmail] = useState<string>(loggedInUser?.email || '');
  const [profilePicture, setProfilePicture] = useState<string>(
    loggedInUser?.profilePicture || ''
  );
  const { mutate } = useUpdateLoggedInUser(setLoggedInUser);

  useEffect(() => {
    if (loggedInUser) {
      setUsername(loggedInUser.username);
      setEmail(loggedInUser.email);
      setProfilePicture(loggedInUser.profilePicture);
    }
  }, [loggedInUser]);

  const handleSave = () => {
    if (loggedInUser) {
      mutate({ id: loggedInUser._id, username, email, profilePicture });
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={handleChange(setUsername)}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={handleChange(setEmail)} />
      </div>
      <div className="form-group">
        <label>Profile Picture URL</label>
        <input
          type="text"
          value={profilePicture}
          onChange={handleChange(setProfilePicture)}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditProfileScreen;
