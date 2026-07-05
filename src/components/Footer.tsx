import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import signatureUrl from '@/assets/signature.png?url';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline py-10">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <a href="#home" className="text-ink transition-opacity hover:opacity-70" aria-label="Back to home">
            <span
              className="signature-wordmark"
              style={{
                WebkitMaskImage: `url(${signatureUrl})`,
                maskImage: `url(${signatureUrl})`,
              }}
            />
          </a>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="mailto:RezwanAhmad.Nayreed@student.oulu.fi"
              className="pill-primary !h-9 !px-4 !py-0"
              aria-label="Send Mail"
            >
              <Mail size={15} />
              Send Mail
            </a>
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
          </div>
        </div>

        <p className="text-center text-xs text-mute mt-8">
          &copy; {currentYear} Rezwan Ahmad Nayreed. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
