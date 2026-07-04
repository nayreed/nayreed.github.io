import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-canvas/85 backdrop-blur-md border-b border-hairline'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-5 sm:px-6">
        <a href="#home" className="font-mono text-sm text-ink hover:text-fade transition-colors">
          <span className="text-mute">~/</span>nayreed
        </a>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-fade hover:text-ink hover:bg-soft transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
