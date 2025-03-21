
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/70 text-sm mb-4 md:mb-0">
            © {currentYear} Rezwan Ahmad Nayreed. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a 
              href="#home" 
              className="text-foreground/70 hover:text-primary transition-colors text-sm"
            >
              Home
            </a>
            <a 
              href="#experience" 
              className="text-foreground/70 hover:text-primary transition-colors text-sm"
            >
              Experience
            </a>
            <a 
              href="#skills" 
              className="text-foreground/70 hover:text-primary transition-colors text-sm"
            >
              Skills
            </a>
            <a 
              href="#contact" 
              className="text-foreground/70 hover:text-primary transition-colors text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
