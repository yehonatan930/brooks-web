import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">MyApp</div>
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
              onClick={onLogout}
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
