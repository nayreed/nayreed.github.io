import React from 'react';
import { ArrowDown, Cpu, Mail, FolderGit2 } from 'lucide-react';

const researchInterests = [
  'Spiking Neural Networks',
  'Federated Learning',
  'Neuromorphic Computing',
  'Edge Intelligence',
  'Wireless Communications & Signal Processing',
  'High-Performance Computing',
  'Deep Learning for Communications',
];

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-soft border border-hairline text-sm text-fade font-medium mb-8">
            <Cpu size={14} className="text-ink" />
            <span>Electronics &amp; Communications Engineering · University of Oulu</span>
          </div>
        </div>

        <h1
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.1] animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          Rezwan Ahmad Nayreed
        </h1>

        <p
          className="mt-6 text-lg text-fade leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          BSc (Technology) student and research assistant working on intelligent edge
          orchestration — building learning systems that run at the edge, from spiking neural
          networks to federated learning.
        </p>

        <div
          className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <a href="#contact" className="pill-primary">
            <Mail size={15} />
            Get in Touch
          </a>
          <a href="#projects" className="pill-secondary">
            <FolderGit2 size={15} />
            View Projects
          </a>
        </div>

        {/* Terminal card — research interests */}
        <div
          className="mt-14 text-left card-hairline overflow-hidden animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-soft">
            <span className="w-3 h-3 rounded-full bg-terminal-red"></span>
            <span className="w-3 h-3 rounded-full bg-terminal-yellow"></span>
            <span className="w-3 h-3 rounded-full bg-terminal-green"></span>
            <span className="ml-3 font-mono text-xs text-mute">rezwan@oulu — ~/research</span>
          </div>
          <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
            <p>
              <span className="text-mute">$ </span>
              <span className="text-ink">whoami</span>
            </p>
            <p className="text-fade">ECE undergrad · research assistant @ Centre of Applied Computing</p>
            <p className="mt-3">
              <span className="text-mute">$ </span>
              <span className="text-ink">cat research-interests.txt</span>
            </p>
            <p className="text-fade">
              {researchInterests.map((interest, i) => (
                <span key={interest}>
                  {interest}
                  {i < researchInterests.length - 1 && <span className="text-mute"> · </span>}
                </span>
              ))}
            </p>
            <p className="mt-3">
              <span className="text-mute">$ </span>
              <span className="text-ink animate-caret-blink">▋</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
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
