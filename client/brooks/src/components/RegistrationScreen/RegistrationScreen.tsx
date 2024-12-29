import React from 'react';
import { useMutation } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button as MuiButton, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import { toast } from 'react-toastify';
import { registerUser } from '../../services/userService';
import './RegistrationScreen.scss';

interface RegistrationScreenProps {
  onError: (error: string) => void;
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onError }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation(registerUser, {
    onSuccess: () => {
      toast.success('Registration successful! Welcome!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
      onError(error.response?.data?.message || 'Registration failed');
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="container">
      <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="title">Register</h2>
        <Tooltip title="Enter your username" arrow>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                className="input-field"
                type="text"
                placeholder="Username"
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ''}
                InputProps={{
                  startAdornment: <PersonIcon />,
                }}
              />
            )}
          />
        </Tooltip>
        <Tooltip title="Enter your email" arrow>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                className="input-field"
                type="email"
                placeholder="Email"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                InputProps={{
                  startAdornment: <EmailIcon />,
                }}
              />
            )}
          />
        </Tooltip>
        <Tooltip title="Enter your password" arrow>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                className="input-field"
                type="password"
                placeholder="Password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                InputProps={{
                  startAdornment: <LockIcon />,
                }}
              />
            )}
          />
        </Tooltip>
        <Tooltip title="Confirm your password" arrow>
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                className="input-field"
                type="password"
                placeholder="Confirm Password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                InputProps={{
                  startAdornment: <CheckCircleIcon />,
                }}
              />
            )}
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