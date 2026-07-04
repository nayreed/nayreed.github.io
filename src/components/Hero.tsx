import React, { useEffect, useState } from 'react';
import { ArrowDown, Mail, FolderGit2, FileDown } from 'lucide-react';

const RESUME_URL = 'https://unioulu-my.sharepoint.com/:b:/g/personal/rnayreed24_student_oulu_fi/EUWmU7Xvq7tKgRx4cv17OuoBzzzJnTo6hbPQAd9IRsazCA?e=g8W2aM';

const researchInterests = [
  'Spiking Neural Networks',
  'Federated Learning',
  'Neuromorphic Computing',
  'Edge Intelligence',
  'Wireless Communications & Signal Processing',
  'High-Performance Computing',
  'Deep Learning for Communications',
];

const projectDirs = [
  { name: 'EISim/', url: 'https://github.com/RA-Nayreed/EISim' },
  { name: 'FMML/', url: 'https://github.com/RA-Nayreed/FMML' },
  { name: 'spectrum-analyzer/', url: 'https://github.com/RA-Nayreed/Spectrum_Analyzer-1.0/tree/main' },
];

const commands = [
  {
    cmd: 'whoami',
    output: (
      <p className="text-fade">ECE undergrad @ University of Oulu</p>
    ),
  },
  {
    cmd: 'cat research-interests.txt',
    output: (
      <p className="text-fade">
        {researchInterests.map((interest, i) => (
          <span key={interest}>
            {interest}
            {i < researchInterests.length - 1 && <span className="text-mute"> · </span>}
          </span>
        ))}
      </p>
    ),
  },
  {
    cmd: 'ls ~/projects',
    output: (
      <p className="flex flex-wrap gap-x-6 gap-y-1">
        {projectDirs.map((dir) => (
          <a
            key={dir.name}
            href={dir.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline-offset-4 hover:underline"
          >
            {dir.name}
          </a>
        ))}
      </p>
    ),
  },
];

const START_DELAY = 700;
const CHAR_DELAY = 45;
const LINE_DELAY = 400;

// Types each command character-by-character, then reveals its output
const useTerminalTyping = () => {
  const [state, setState] = useState({ step: 0, chars: 0 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState({ step: commands.length, chars: 0 });
      return;
    }
    if (state.step >= commands.length) return;

    const current = commands[state.step].cmd;
    const delay =
      state.step === 0 && state.chars === 0
        ? START_DELAY
        : state.chars < current.length
          ? CHAR_DELAY
          : LINE_DELAY;

    const timer = setTimeout(() => {
      setState((s) => {
        const cmd = commands[s.step].cmd;
        if (s.chars < cmd.length) return { ...s, chars: s.chars + 1 };
        return { step: s.step + 1, chars: 0 };
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [state]);

  return state;
};

const Caret = () => <span className="text-ink animate-caret-blink">▋</span>;

const Hero = () => {
  const { step, chars } = useTerminalTyping();

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center pt-24 pb-16">
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 text-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.1] animate-fade-in-up">
          Rezwan Ahmad Nayreed
        </h1>

        <div
          className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up"
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

        {/* Terminal — types itself out on load */}
        <div
          className="mt-12 md:mt-14 text-left card-hairline overflow-hidden animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-soft">
            <span className="w-3 h-3 rounded-full bg-terminal-red"></span>
            <span className="w-3 h-3 rounded-full bg-terminal-yellow"></span>
            <span className="w-3 h-3 rounded-full bg-terminal-green"></span>
            <span className="ml-3 font-mono text-xs text-mute truncate">nayreed@oulu — ~</span>
          </div>
          <div className="p-4 sm:p-5 font-mono text-[13px] sm:text-sm leading-relaxed min-h-[320px] sm:min-h-[270px] md:min-h-[250px]">
            {commands.slice(0, step).map((c) => (
              <div key={c.cmd} className="mb-3">
                <p>
                  <span className="text-mute">$ </span>
                  <span className="text-ink">{c.cmd}</span>
                </p>
                {c.output}
              </div>
            ))}

            {step < commands.length ? (
              <p>
                <span className="text-mute">$ </span>
                <span className="text-ink">{commands[step].cmd.slice(0, chars)}</span>
                <Caret />
              </p>
            ) : (
              <p>
                <span className="text-mute">$ </span>
                <Caret />
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-14 flex justify-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
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
