import { useEffect, useState } from 'react';

export const useThemeAlgorithm = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleChange = (event: MediaQueryListEvent) => {
    const systemTheme = event.matches ? 'dark' : 'light';
    setTheme(systemTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    systemTheme: theme,
  };
};
