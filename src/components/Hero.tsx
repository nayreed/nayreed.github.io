import React from 'react';
import { ArrowDown, Mail, FolderGit2, FileDown } from 'lucide-react';
import Terminal from './Terminal';

const RESUME_URL = 'https://a3s.fi/swift/v1/nayreed/Nayreeds-Resume.pdf';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-24"
    >
      <div className="w-full max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink leading-[1.1]"
          data-reveal
        >
          Rezwan Ahmad Nayreed
        </h1>

        <div
          className="flex flex-wrap justify-center gap-3 mt-12"
          data-reveal
          style={{ '--reveal-delay': '150ms' } as React.CSSProperties}
        >
          <a href="#contact" className="pill-primary">
            <Mail size={15} />
            Get in Touch
          </a>
          <a href="#projects" className="pill-secondary">
            <FolderGit2 size={15} />
            View Projects
          </a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="pill-secondary">
            <FileDown size={15} />
            Resume
          </a>
        </div>

        <div
          className="max-w-3xl mx-auto mt-14 md:mt-16"
          data-reveal="scale"
          style={{ '--reveal-delay': '300ms' } as React.CSSProperties}
        >
          <Terminal />
        </div>
      </div>

      <div
        className="absolute bottom-5 inset-x-0 flex justify-center"
        data-reveal="fade"
        style={{ '--reveal-delay': '700ms' } as React.CSSProperties}
      >
        <a
          href="#experience"
          className="flex flex-col items-center text-mute hover:text-ink transition-colors"
        >
          <span className="text-xs mb-2 font-mono">scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
