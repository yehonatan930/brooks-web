import { useMutation, UseMutationResult } from 'react-query';
import { updateUser } from '../../services/userService';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { UpdateUserData, User } from '../../types/user';

export const useUpdateUser = (): UseMutationResult<
  User,
  any,
  UpdateUserData
> => {
  const navigate = useNavigate();

  return useMutation<User, any, UpdateUserData>(updateUser, {
    onSuccess: (data: User) => {
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
