import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { logoutUser } from '../../services/userService';
import { useAtom } from 'jotai';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import { User } from '../../types/user';
import * as _ from 'lodash';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Person4RoundedIcon from '@mui/icons-material/Person4Rounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Button } from '@mui/material';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [user, setUser] = useAtom(loggedInUserAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser({} as User);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    !_.isEmpty(user) && (
      <nav className="navbar">
        <div className="navbar__brand">Brook</div>
        <ul className="navbar__list">
          <li className="navbar__item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              <HomeRoundedIcon fontSize="large" />
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              <Person4RoundedIcon fontSize="large" />
            </NavLink>
          </li>
          <li className="navbar__item">
            <Button
              variant="contained"
              endIcon={<LogoutRoundedIcon />}
              onClick={handleLogout}
            ></Button>
          </li>
        </ul>
      </nav>
    )
  );
};

export default Navbar;
