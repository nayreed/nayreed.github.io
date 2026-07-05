import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_EVENT = 'theme-change';

const readTheme = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';

// The <html> class is the source of truth; a custom event keeps every
// useTheme instance in sync.
export const setTheme = (next: Theme) => {
  document.documentElement.classList.toggle('dark', next === 'dark');
  try {
    localStorage.setItem('theme', next);
  } catch {
    // localStorage unavailable (private mode); theme still applies for the session
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => {
    const sync = () => setThemeState(readTheme());
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readTheme() === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
};
