import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import signatureUrl from '@/assets/signature.png?url';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const bottomDistance =
        document.documentElement.scrollHeight - (scrollTop + window.innerHeight);

      setIsScrolled(scrollTop > 24);
      setIsAtBottom(bottomDistance < 96);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
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
      <div className="relative max-w-5xl mx-auto h-14 px-5 sm:px-6">
        <a
          href="#home"
          className="navbar-title text-ink transition-opacity hover:opacity-70"
          data-bottom={isAtBottom ? 'true' : 'false'}
          aria-label="Back to home"
        >
          <span
            className="signature-wordmark"
            style={{
              WebkitMaskImage: `url(${signatureUrl})`,
              maskImage: `url(${signatureUrl})`,
            }}
          />
        </a>

        <button
          onClick={toggleTheme}
          className="navbar-theme-toggle w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-fade hover:text-ink hover:bg-soft transition-colors"
          data-bottom={isAtBottom ? 'true' : 'false'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="navbar-theme-toggle__icon">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
