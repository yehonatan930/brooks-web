import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button as MuiButton, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import './LoginScreen.scss';
import { useMutation } from 'react-query';
import { loginUser } from '../../services/userService';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { loggedInUserAtom } from '../../context/UserAtom';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const [user, setUser] = useAtom(loggedInUserAtom);

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const mutation = useMutation(loginUser, {
    onSuccess: (data, { email }) => {
      localStorage.setItem('token', data.accessToken); // Store the JWT token
      toast.success('Login successful! Welcome!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      navigate('/profile'); // Navigate to the profile screen}
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  return (
    <div className="login__container">
      <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login__title">Login</h2>
        <Tooltip title="Enter your email" arrow>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                margin="normal"
                {...field}
                className="login__input-field"
                type="email"
                placeholder="Email"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                slotProps={{
                  input: {
                    startAdornment: <EmailIcon />,
                  },
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
                margin="normal"
                {...field}
                className="login__input-field"
                type="password"
                placeholder="Password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                slotProps={{
                  input: {
                    startAdornment: <LockIcon />,
                  },
                }}
              />
            )}
          />
        </Tooltip>
        <Tooltip title={!isValid ? 'Oops, forgot something?' : ''} arrow>
          <span>
            <MuiButton
              type="submit"
              variant="contained"
              className="login__button"
              disabled={!isValid}
            >
              Login
            </MuiButton>
          </span>
        </Tooltip>
        <p className="login__paragraph">
          Don't have an account?{' '}
          <a href="/register" className="login__register-link">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
