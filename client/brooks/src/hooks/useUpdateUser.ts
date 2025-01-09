import { useMutation } from 'react-query';
import { updateUser, UpdateUserData } from '../services/userService';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';


export const useUpdateUser = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  return useMutation<UpdateUserData, any, UpdateUserData>(updateUser, {
    onSuccess: (data: UpdateUserData, variables: any) => {
      setUser(variables.user);
      toast.success('Update successful!!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      navigate('/profile');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Update failed');
    },
  });
};
