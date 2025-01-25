import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { googleLogin } from '../../services/userService';
import { LoginResponse } from '../../types/user';

const useGoogleLogin = (handleSetLoggedInUser?: (userId: string) => void) => {
  const { data: tokens, ...rest } = useMutation<
    LoginResponse,
    any,
    string,
    unknown
  >(googleLogin, {
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('token', data.accessToken);
      toast.success('Login successful! Welcome!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      handleSetLoggedInUser && handleSetLoggedInUser(data.userId);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  return { ...rest, tokens };
};
export default useGoogleLogin;
