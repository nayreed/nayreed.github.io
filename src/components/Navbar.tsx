import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Sun, Moon, FileDown } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const RESUME_URL = 'https://unioulu-my.sharepoint.com/:b:/g/personal/rnayreed24_student_oulu_fi/EUWmU7Xvq7tKgRx4cv17OuoBzzzJnTo6hbPQAd9IRsazCA?e=g8W2aM';

const navItems = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Activities', href: '#activities' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-6">
        <a href="#home" className="font-mono text-sm text-ink hover:text-fade transition-colors">
          <span className="text-mute">~/</span>nayreed
        </a>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm font-medium text-fade hover:text-ink rounded-full hover:bg-soft transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-fade hover:text-ink hover:bg-soft transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex pill-primary !px-4 !py-2 text-sm"
          >
            <FileDown size={14} />
            Resume
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-fade hover:text-ink transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed inset-x-0 top-14 bottom-0 z-40 bg-canvas transition-all duration-300',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col px-6 py-6 gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="py-3 px-4 text-lg font-medium text-fade hover:text-ink rounded-xl hover:bg-soft transition-colors border-b border-hairline last:border-b-0"
            >
              {item.label}
            </a>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-primary mt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <FileDown size={14} />
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
