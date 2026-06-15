/**
 * Theme context providing light/dark mode toggle with system preference detection.
 * Persists user choice to localStorage and applies `data-theme` attribute to `<html>`.
 * @module context/ThemeContext
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

/** Hook to access the current theme and toggle function. */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('ecolens_theme') as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** Provider that manages light/dark theme state and DOM attribute. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ecolens_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
