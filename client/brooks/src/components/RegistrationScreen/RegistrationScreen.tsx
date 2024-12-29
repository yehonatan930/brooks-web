import React, { useState } from 'react';
import { TextField, Button as MuiButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './RegistrationScreen.scss';

interface RegistrationScreenProps {
  onRegister: (email: string, password: string) => void;
  onError: (error: string) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister, onError }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      onError('Passwords do not match');
      return;
    }
    onRegister(email, password);
  };

  return (
      <div className="container">
        <form className="registration-form" onSubmit={handleRegister}>
          <h2 className="title">Register</h2>
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