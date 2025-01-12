import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { logoutUser } from '../../services/userService';
import { useAtom } from 'jotai';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import { User } from '../../types/user';
import * as _ from 'lodash';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [user, setUser] = useAtom(loggedInUserAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('token');
      setUser({} as User);
      navigate('/login');

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return !_.isEmpty(user) && (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">Brook</div>
        <ul className="navbar__list">
          <li className="navbar__item">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              Home
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              Profile
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              Discover
            </NavLink>
          </li>
          <li className="navbar__item">
            <button
              onClick={handleLogout}
              className="navbar__link navbar__button"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
