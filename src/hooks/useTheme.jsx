// src/hooks/useTheme.js
import { useEffect, useState } from 'react';

const prefersDark = () =>
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return prefersDark() ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return [theme, toggle];
};
