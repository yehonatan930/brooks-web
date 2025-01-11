import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { loginUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { LoginData, LoginResponse } from '../types/user';

const useLogin = (handleSetLoggedInUser: (userId: string) => void) => {
  const navigate = useNavigate();

  const { data: tokens, ...rest } = useMutation<
    LoginResponse,
    any,
    LoginData,
    unknown
  >(loginUser, {
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('token', data.accessToken);
      toast.success('Login successful! Welcome!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      handleSetLoggedInUser(data.userId);

      navigate('/profile');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  return { ...rest, tokens };
};
export default useLogin;
