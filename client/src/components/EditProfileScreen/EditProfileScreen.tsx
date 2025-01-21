import React, { ChangeEvent, useEffect, useState } from 'react';
import './EditProfileScreen.scss';
import { useUpdateUser } from '../../hooks/api/useUpdateUser';
import { useUploadImage } from '../../hooks/api/useUploadImage';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import { useAtomValue } from 'jotai';
import { UploadImageButton } from '../UploadImageButton/UploadImageButton';

const EditProfileScreen: React.FC = () => {
  const loggedInUser = useAtomValue(loggedInUserAtom);
  const [username, setUsername] = useState<string>(
    loggedInUser?.username || ''
  );
  const [email, setEmail] = useState<string>(loggedInUser?.email || '');
  const [profilePicture, setProfilePicture] = useState<string>(
    loggedInUser?.profilePicture || ''
  );
  const [profileImageFile, setProfileImageFile] = useState<File | undefined>();

  const { mutate: updateUser } = useUpdateUser();
  const { mutate: uploadImage } = useUploadImage();

  useEffect(() => {
    if (loggedInUser) {
      setUsername(loggedInUser.username);
      setEmail(loggedInUser.email);
      setProfilePicture(loggedInUser.profilePicture);
    }
  }, [loggedInUser]);

  const handleSave = () => {
    updateUser({ id: loggedInUser._id, username, email, profilePicture });
    profileImageFile && uploadImage(profileImageFile);
    // http://localhost/media/q018.jpg
  };

  const handleInputChange =
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
          onChange={handleInputChange(setUsername)}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={handleInputChange(setEmail)}
        />
      </div>
      <div className="form-group">
        <label>Profile Picture URL</label>
        <input
          type="text"
          value={profilePicture}
          onChange={handleInputChange(setProfilePicture)}
        />
        <UploadImageButton onUploadImage={setProfileImageFile} />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditProfileScreen;
