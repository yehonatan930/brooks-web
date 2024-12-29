import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { TextField, Button as MuiButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import { registerUser } from '../../services/userService';
import './RegistrationScreen.scss';

interface RegistrationScreenProps {
  onRegister: (email: string, password: string) => void;
  onError: (error: string) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister, onError }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const mutation = useMutation(registerUser, {
    onSuccess: () => {
      toast.success('Registration successful! Welcome!');
      onRegister(email, password);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
      onError(error.response?.data?.message || 'Registration failed');
    },
  });

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      onError('Passwords do not match');
      return;
    }
    mutation.mutate({ username, email, password });
  };

  return (
      <div className="container">
        <form className="registration-form" onSubmit={handleRegister}>
          <h2 className="title">Register</h2>
          <Tooltip title="Enter your username" arrow>
            <TextField
                className="input-field"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                InputProps={{
                  startAdornment: <PersonIcon />,
                }}
            />
          </Tooltip>
          <Tooltip title="Enter your email" arrow>
            <TextField
                className="input-field"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                InputProps={{
                  startAdornment: <EmailIcon />,
                }}
            />
          </Tooltip>
          <Tooltip title="Enter your password" arrow>
            <TextField
                className="input-field"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                InputProps={{
                  startAdornment: <LockIcon />,
                }}
            />
          </Tooltip>
          <Tooltip title="Confirm your password" arrow>
            <TextField
                className="input-field"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm Password"
                InputProps={{
                  startAdornment: <CheckCircleIcon />,
                }}
            />
          </Tooltip>
          <MuiButton type="submit" variant="contained" className="button">
            Register
          </MuiButton>
          <p className="paragraph">
            Already have an account?{' '}
            <a href="/login" className="login-link">
              Log in
            </a>
          </p>
        </form>
      </div>
  );
};

export default RegistrationScreen;