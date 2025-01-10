import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { registerUser } from '../services/userService';

const useRegister = () => {
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading,
    mutate,
    isError,
  } = useMutation('register', registerUser, {
    onSuccess: () => {
      toast.success('Registration successful! Welcome!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  return { userData, isLoading, isError, mutate };
};

export default useRegister;
