import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { logoutUser } from '../../services/userService';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('token'); // Remove token from local storage
      onLogout(); // Call the onLogout prop to update the app state
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">Brook</div>
        <ul className="navbar__list">
          <li className="navbar__item">
            <NavLink
              to="/home"
              className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}
            >
              Home
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/profile"
              className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}
            >
              Profile
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/discover"
              className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}
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