import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#home" className="font-mono text-sm text-ink hover:text-fade transition-colors">
            <span className="text-mute">~/</span>nayreed
          </a>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs text-fade hover:text-ink transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-2">
            <a
              href="https://github.com/RA-Nayreed"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-fade hover:text-ink hover:bg-soft transition-colors"
              aria-label="GitHub"
            >
              <Github size={15} />
            </a>
            <a
              href="https://www.linkedin.com/in/nayreed/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-fade hover:text-ink hover:bg-soft transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={15} />
            </a>
            <a
              href="mailto:nayreedptk@gmail.com"
              className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-fade hover:text-ink hover:bg-soft transition-colors"
              aria-label="Email"
            >
              <Mail size={15} />
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-mute mt-8">
          © {currentYear} Rezwan Ahmad Nayreed. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
