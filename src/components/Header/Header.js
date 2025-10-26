import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import ThemeSwitcher from '../ThemeSwitcher';
import IconApp from '../Icons/IconApp';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-nav">
        <div className="logo">
          <IconApp size={40} />
        </div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Inicio</NavLink>
          <NavLink to="/tareas" className={({ isActive }) => (isActive ? 'active' : '')}>Tareas</NavLink>
          <NavLink to="/directorio" className={({ isActive }) => (isActive ? 'active' : '')}>Directorio</NavLink>
        </nav>
      </div>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;