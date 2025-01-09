import { useState, useEffect } from 'react';
import { getUser } from '../services/userService';

export const useFetchUser = (userEmail: string) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await getUser(); // Corrected the function call
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userEmail]);

  return { user, isLoading, error };
};