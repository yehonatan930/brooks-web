import { useQuery } from 'react-query';
import { getUser } from '../services/userService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useFetchUser = () => {
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery(
    'user', // Query key to uniquely identify the query
    async () => {
      const data = await getUser(); // Assuming `getUser` accepts the email as an argument
      return data;
    },
    {
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to fetch user. Redirecting...');
        navigate('/login');
      },
    }
  );

  return { user, isLoading, error };
};
