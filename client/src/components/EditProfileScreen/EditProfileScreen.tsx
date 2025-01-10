import React, { ChangeEvent, useEffect, useState } from 'react';
import './EditProfileScreen.scss';
import { useUpdateUser } from '../../hooks/useUpdateUser';
import { loggedInUserAtom } from '../../context/UserAtom';
import { useAtomValue } from 'jotai';

const EditProfileScreen: React.FC = () => {
  const user = useAtomValue(loggedInUserAtom);
  const [username, setUsername] = useState<string>(user?.username || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [profilePicture, setProfilePicture] = useState<string>(
    user?.profilePicture || ''
  );
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setProfilePicture(user.profilePicture);
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      updateUserMutation.mutate({ username, email, profilePicture });
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
