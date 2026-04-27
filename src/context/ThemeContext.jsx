import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = ['warm', 'dark', 'forest', 'midnight', 'rose', 'pink'];

const THEME_COLORS = {
  warm: '#f5efe6',
  dark: '#141414',
  forest: '#1a2018',
  midnight: '#0e1220',
  rose: '#1e1014',
  pink: '#fdf0f5',
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aida_theme') || 'warm';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aida_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, THEMES, THEME_COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
