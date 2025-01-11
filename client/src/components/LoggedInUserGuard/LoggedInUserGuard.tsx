import { useAtom } from 'jotai';
import { FunctionComponent, ReactNode, useEffect } from 'react';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/user';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface LoggedInUserGuardProps {
  children: ReactNode;
}

const LoggedInUserGuard: FunctionComponent<LoggedInUserGuardProps> = (
  props
) => {
  const [user, setUser] = useAtom(loggedInUserAtom);

  const [getLocalStorageUserId, _] = useLocalStorage<string>('userId', '');

  const navigate = useNavigate();

  useEffect(() => {
    console.log('LoggedInUserGuard: user', user);

    const localStorageUserId: string = getLocalStorageUserId();

    if (
      window.location.pathname !== '/login' &&
      window.location.pathname !== '/register' &&
      (!user || !user._id)
    ) {
      if (localStorageUserId) {
        setUser({ _id: localStorageUserId } as User);
        return;
      }

      navigate('/login');
    }
  }, [getLocalStorageUserId, navigate, setUser, user]);

  return <>{props.children}</>;
};

export default LoggedInUserGuard;
