import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button as MuiButton, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import './LoginScreen.scss';
import { useAtom } from 'jotai';
import { loggedInUserAtom } from '../../context/UserAtom';
import useLogin from '../../hooks/useLogin';
import { LoginData, User } from '../../types/user';
import { useLocalStorage } from '../../hooks/useLocalStorage';

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
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const [loggedInUser, setLoggedInUser] = useAtom(loggedInUserAtom);
  const [_, setLocalStorageUserId] = useLocalStorage<string>('userId');

  const handleSetLoggedInUser = (userId: string) => {
    setLoggedInUser({ _id: userId } as User);
    setLocalStorageUserId(loggedInUser._id);
  };

  const { mutate } = useLogin(handleSetLoggedInUser);

  const onSubmit = (data: LoginData) => {
    mutate(data);
  };

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
