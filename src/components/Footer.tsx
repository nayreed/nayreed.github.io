import React from 'react';
import signatureUrl from '@/assets/signature.png?url';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline py-10">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col items-center">
        <a href="#home" className="text-ink transition-opacity hover:opacity-70" aria-label="Back to home">
          <span
            className="signature-wordmark"
            style={{
              WebkitMaskImage: `url(${signatureUrl})`,
              maskImage: `url(${signatureUrl})`,
            }}
          />
        </a>

        <p className="text-center text-xs text-mute mt-6">
          &copy; {currentYear} Rezwan Ahmad Nayreed. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
