import { useAtom } from 'jotai';
import { FunctionComponent, ReactNode, useEffect } from 'react';
import { loggedInUserAtom } from '../../context/UserAtom';
import { useNavigate } from 'react-router-dom';

interface LoggedInUserGuardProps {
  children: ReactNode;
}

const LoggedInUserGuard: FunctionComponent<LoggedInUserGuardProps> = (
  props
) => {
  const [user, setUser] = useAtom(loggedInUserAtom);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      window.location.pathname !== '/login' &&
      window.location.pathname !== '/register' &&
      (!user || !user._id)
    ) {
      navigate('/login');
    }
  }, [navigate, user]);

  return <>{props.children}</>;
};

export default LoggedInUserGuard;
