import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { loginUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { LoginData, Tokens } from '../types/user';

const useLogin = () => {
  const navigate = useNavigate();

  const { data: tokens, ...rest } = useMutation<
    Tokens,
    any,
    LoginData,
    unknown
  >(loginUser, {
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

  return { ...rest, tokens };
};
export default useLogin;
