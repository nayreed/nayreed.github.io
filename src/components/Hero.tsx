import React from 'react';
import { ArrowDown, Mail, FolderGit2, FileDown } from 'lucide-react';
import Terminal from './Terminal';

const RESUME_URL = 'https://unioulu-my.sharepoint.com/:b:/g/personal/rnayreed24_student_oulu_fi/EUWmU7Xvq7tKgRx4cv17OuoBzzzJnTo6hbPQAd9IRsazCA?e=g8W2aM';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-24"
    >
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 text-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.1] animate-fade-in-up">
          Rezwan Ahmad Nayreed
        </h1>

        <div
          className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
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

        <div className="mt-12 md:mt-14 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Terminal />
        </div>
      </div>

      <div
        className="absolute bottom-5 inset-x-0 flex justify-center animate-fade-in"
        style={{ animationDelay: '0.7s' }}
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
