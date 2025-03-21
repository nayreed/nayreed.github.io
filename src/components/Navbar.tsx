import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronRight } from 'lucide-react';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [{
    label: 'Home',
    href: '#home'
  }, {
    label: 'Experience',
    href: '#experience'
  }, {
    label: 'Education',
    href: '#education'
  }, {
    label: 'Skills',
    href: '#skills'
  }, {
    label: 'Projects',
    href: '#projects'
  }, {
    label: 'Contact',
    href: '#contact'
  }];
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6", isScrolled ? "bg-black/30 backdrop-blur-xl border-b border-white/10" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#home" className="text-2xl font-bold text-white hover:text-primary/90 transition-colors duration-300 flex items-center">
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent text-right my-0 mx-[50px] py-[5px] text-base font-light">R.A.N</span>
          <span className="ml-1 text-xs text-white/50 font-mono mt-1">
        </span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item, index) => <a key={index} href={item.href} className="group relative px-4 py-2 text-sm font-medium text-white/80 hover:text-primary transition-colors duration-300">
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 w-full h-full bg-white/5 scale-0 rounded-md group-hover:scale-100 transition-transform duration-300"></span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </a>)}
        </nav>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="md:hidden text-white/80 hover:text-primary transition-colors p-1 rounded-md border border-white/10" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn("md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-lg pt-24 px-6 transform transition-all duration-500 ease-in-out", isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0")}>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item, index) => <a key={index} href={item.href} className="flex items-center text-lg font-medium py-3 px-4 text-white/80 hover:text-primary transition-colors rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
              <ChevronRight size={16} className="mr-2 text-primary" />
              {item.label}
            </a>)}
        </nav>
      </div>
    </header>;
};
export default Navbar;