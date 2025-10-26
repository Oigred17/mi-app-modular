import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext'; // Importamos el contexto
import IconMoon from './Icons/IconMoon'; // <-- Importar
import IconSun from './Icons/IconSun';   // <-- Importar

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} className="theme-switcher-btn">
      {theme === 'light' ? <IconMoon /> : <IconSun />}
    </button>
  );
};

export default ThemeSwitcher;
