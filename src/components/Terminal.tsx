import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

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

const WhoamiOutput = () => <p className="text-fade">ECE undergrad @ University of Oulu</p>;

const InterestsOutput = () => (
  <p className="text-fade">
    {researchInterests.map((interest, i) => (
      <span key={interest}>
        {interest}
        {i < researchInterests.length - 1 && <span className="text-mute"> · </span>}
      </span>
    ))}
  </p>
);

const ProjectsOutput = () => (
  <p className="flex flex-wrap gap-x-6 gap-y-1">
    {projectDirs.map((dir) => (
      <a
        key={dir.name}
        href={dir.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fade underline decoration-hairline-strong underline-offset-4 hover:text-ink hover:decoration-ink transition-colors"
      >
        {dir.name}
      </a>
    ))}
  </p>
);

const HelpOutput = () => (
  <div className="text-fade">
    {[
      ['whoami', 'who am I'],
      ['interests', 'what I work on'],
      ['projects', 'things I have built'],
      ['contact', 'how to reach me'],
      ['resume', 'grab my resume'],
      ['neofetch', 'system info'],
      ['theme', 'toggle light/dark'],
      ['clear', 'clean slate'],
    ].map(([cmd, desc]) => (
      <p key={cmd}>
        <span className="text-ink inline-block w-24 shrink-0">{cmd}</span>
        {desc}
      </p>
    ))}
    <p className="mt-2 text-mute"># a few commands are hidden. happy hunting ;)</p>
  </div>
);

const ContactOutput = () => (
  <div className="text-fade">
    {[
      ['academic', 'RezwanAhmad.Nayreed@student.oulu.fi', 'mailto:RezwanAhmad.Nayreed@student.oulu.fi'],
      ['personal', 'nayreedptk@gmail.com', 'mailto:nayreedptk@gmail.com'],
      ['linkedin', 'linkedin.com/in/nayreed', 'https://www.linkedin.com/in/nayreed/'],
      ['github', 'github.com/RA-Nayreed', 'https://github.com/RA-Nayreed'],
    ].map(([label, value, href]) => (
      <p key={label} className="flex">
        <span className="text-mute inline-block w-20 shrink-0">{label}</span>
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="break-all underline decoration-hairline-strong underline-offset-4 hover:text-ink hover:decoration-ink transition-colors"
        >
          {value}
        </a>
      </p>
    ))}
  </div>
);

const NeofetchOutput = () => (
  <div className="flex gap-6 items-start">
    <pre className="text-ink leading-snug hidden sm:block shrink-0">{`      /\\
     /  \\
    / /\\ \\
   / /  \\ \\
  /_/    \\_\\`}</pre>
    <div className="text-fade">
      <p className="text-ink">nayreed@oulu</p>
      <p className="text-mute">────────────</p>
      <p><span className="text-ink">OS:</span> OuluOS (arctic edition)</p>
      <p><span className="text-ink">Host:</span> University of Oulu</p>
      <p><span className="text-ink">Kernel:</span> ECE-undergrad</p>
      <p><span className="text-ink">Uptime:</span> since Aug 2024</p>
      <p><span className="text-ink">Packages:</span> 132 (ECTS)</p>
      <p><span className="text-ink">Shell:</span> /bin/student</p>
      <p><span className="text-ink">Weather:</span> ❄ −20°C (try 'oulu')</p>
    </div>
  </div>
);

// The two commands that type themselves out on load
const INTRO = [
  { cmd: 'whoami', output: <WhoamiOutput /> },
  { cmd: 'cat research-interests.txt', output: <InterestsOutput /> },
];

const SUGGESTED = ['help', 'projects', 'contact', 'resume', 'theme', 'neofetch'];

const START_DELAY = 700;
const CHAR_DELAY = 45;
const LINE_DELAY = 400;

type Entry = { id: number; cmd: string; output: React.ReactNode };

const Caret = () => <span className="text-ink animate-caret-blink">▋</span>;

const Terminal = () => {
  const { theme, toggleTheme } = useTheme();
  const [intro, setIntro] = useState({ step: 0, chars: 0 });
  const [cleared, setCleared] = useState(false);
  const [history, setHistory] = useState<Entry[]>([]);
  const [input, setInput] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [snowKey, setSnowKey] = useState(0);
  const [snowing, setSnowing] = useState(false);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const introDone = intro.step >= INTRO.length;

  // Auto-type the intro commands
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntro({ step: INTRO.length, chars: 0 });
      return;
    }
    if (introDone) return;

    const current = INTRO[intro.step].cmd;
    const delay =
      intro.step === 0 && intro.chars === 0
        ? START_DELAY
        : intro.chars < current.length
          ? CHAR_DELAY
          : LINE_DELAY;

    const timer = setTimeout(() => {
      setIntro((s) => {
        const cmd = INTRO[s.step].cmd;
        if (s.chars < cmd.length) return { ...s, chars: s.chars + 1 };
        return { step: s.step + 1, chars: 0 };
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [intro, introDone]);

  // Keep the latest line in view
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [history, intro, input]);

  // Stop the snowfall after it has fallen
  useEffect(() => {
    if (!snowing) return;
    const timer = setTimeout(() => setSnowing(false), 10000);
    return () => clearTimeout(timer);
  }, [snowing, snowKey]);

  const flakes = useMemo(
    () =>
      Array.from({ length: 50 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 5,
        size: 10 + Math.random() * 8,
        char: Math.random() > 0.3 ? '❄' : '•',
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snowKey]
  );

  const print = (cmd: string, output: React.ReactNode) => {
    idRef.current += 1;
    setHistory((h) => [...h, { id: idRef.current, cmd, output }]);
  };

  const rejectCommand = () => {
    setInvalid(true);
    setTimeout(() => {
      setInvalid(false);
      setInput('');
    }, 500);
  };

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const norm = cmd.toLowerCase().replace(/\s+/g, ' ');

    if (norm === 'clear' || norm === 'cls') {
      setCleared(true);
      setHistory([]);
      setInput('');
      return;
    }
    if (norm.startsWith('echo ')) {
      print(cmd, <p className="text-fade">{cmd.slice(5)}</p>);
      setInput('');
      return;
    }

    let output: React.ReactNode | undefined;
    switch (norm) {
      case 'help':
      case '?':
        output = <HelpOutput />;
        break;
      case 'whoami':
        output = <WhoamiOutput />;
        break;
      case 'interests':
      case 'cat interests':
      case 'cat research-interests':
      case 'cat research-interests.txt':
        output = <InterestsOutput />;
        break;
      case 'ls':
      case 'ls ~':
      case 'ls projects':
      case 'ls ~/projects':
      case 'projects':
        output = <ProjectsOutput />;
        break;
      case 'contact':
        output = <ContactOutput />;
        break;
      case 'resume':
      case 'cv':
      case 'open resume':
        window.open(RESUME_URL, '_blank', 'noopener,noreferrer');
        output = (
          <p className="text-fade">
            opening resume… (blocked?{' '}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-hairline-strong underline-offset-4 hover:text-ink"
            >
              direct link
            </a>
            )
          </p>
        );
        break;
      case 'theme':
      case 'toggle theme':
        toggleTheme();
        output = (
          <p className="text-fade">switched to {theme === 'dark' ? 'light' : 'dark'} mode ✨</p>
        );
        break;
      case 'neofetch':
      case 'fetch':
        output = <NeofetchOutput />;
        break;
      case 'pwd':
        output = <p className="text-fade">/home/nayreed/portfolio</p>;
        break;
      case 'cat':
        output = <p className="text-fade">cat: missing operand — try 'cat research-interests.txt'</p>;
        break;
      case 'hello':
      case 'hi':
      case 'hey':
      case 'moi':
      case 'hei':
        output = <p className="text-fade">moi! 👋 — that's how we say hi in Oulu</p>;
        break;
      case 'oulu':
      case 'snow':
      case 'winter':
        setSnowKey((k) => k + 1);
        setSnowing(true);
        output = <p className="text-fade">❄ ahh, Oulu. −20°C, sauna, and biking through snow.</p>;
        break;
      case 'coffee':
      case 'make coffee':
      case 'brew':
      case 'brew coffee':
      case 'sudo make coffee':
        output = <p className="text-fade">Error 418: I'm a teapot. ☕ (the university has plenty, though)</p>;
        break;
      case 'exit':
      case 'quit':
      case 'logout':
        output = <p className="text-fade">there is no escape. this terminal is home now.</p>;
        break;
      default:
        if (norm.startsWith('sudo rm') || norm.startsWith('rm -rf')) {
          output = <p className="text-fade">nice try. this portfolio has survived Finnish winters.</p>;
        } else if (norm.startsWith('sudo')) {
          output = (
            <p className="text-fade">nayreed is not in the sudoers file. This incident will be reported.</p>
          );
        }
    }

    if (output === undefined) {
      rejectCommand();
      return;
    }
    print(cmd, output);
    setInput('');
  };

  const runFromChip = (cmd: string) => {
    if (!introDone) setIntro({ step: INTRO.length, chars: 0 });
    runCommand(cmd);
  };

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  return (
    <div className="card-hairline overflow-hidden text-left">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-soft">
        <span className="w-3 h-3 rounded-full bg-terminal-red"></span>
        <span className="w-3 h-3 rounded-full bg-terminal-yellow"></span>
        <span className="w-3 h-3 rounded-full bg-terminal-green"></span>
        <span className="ml-3 font-mono text-xs text-mute truncate">nayreed@oulu — ~</span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        onClick={focusInput}
        className="p-4 sm:p-5 font-mono text-[13px] sm:text-sm leading-relaxed min-h-[260px] sm:min-h-[240px] md:min-h-[220px] max-h-[420px] overflow-y-auto cursor-text"
      >
        {!cleared && (
          <>
            {INTRO.slice(0, intro.step).map((c) => (
              <div key={c.cmd} className="mb-3">
                <p>
                  <span className="text-mute">$ </span>
                  <span className="text-ink">{c.cmd}</span>
                </p>
                {c.output}
              </div>
            ))}

            {!introDone && (
              <p>
                <span className="text-mute">$ </span>
                <span className="text-ink">{INTRO[intro.step].cmd.slice(0, intro.chars)}</span>
                <Caret />
              </p>
            )}

            {introDone && (
              <p className="mb-3 text-mute"># type 'help' or tap a command below</p>
            )}
          </>
        )}

        {history.map((entry) => (
          <div key={entry.id} className="mb-3">
            <p>
              <span className="text-mute">$ </span>
              <span className="text-ink">{entry.cmd}</span>
            </p>
            {entry.output}
          </div>
        ))}

        {/* Live prompt */}
        {introDone && (
          <p className={cn(invalid && 'animate-shake')}>
            <span className="text-mute">$ </span>
            <span className={cn('whitespace-pre-wrap break-all', invalid ? 'text-terminal-red' : 'text-ink')}>
              {input}
            </span>
            <Caret />
          </p>
        )}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => !invalid && setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              runCommand(input);
            } else if (e.key === 'Escape') {
              setInput('');
            }
          }}
          className="absolute opacity-0 w-px h-px"
          style={{ fontSize: 16 }} /* ≥16px stops iOS from zooming on focus */
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="terminal input"
          tabIndex={-1}
        />
      </div>

      {/* Suggested commands — tap to run (works on touch devices too) */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-hairline bg-soft overflow-x-auto">
        <span className="font-mono text-xs text-mute shrink-0">try:</span>
        {SUGGESTED.map((cmd) => (
          <button
            key={cmd}
            onClick={() => runFromChip(cmd)}
            className="chip !py-1 !px-2.5 !bg-canvas hover:!text-ink hover:border-hairline-strong transition-colors shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Snowfall easter egg */}
      {snowing &&
        createPortal(
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden>
            {flakes.map((flake, i) => (
              <span
                key={`${snowKey}-${i}`}
                className="absolute text-fade"
                style={{
                  left: `${flake.left}%`,
                  top: '-6vh',
                  fontSize: flake.size,
                  opacity: 0.8,
                  animation: `snow-fall ${flake.duration}s linear ${flake.delay}s forwards`,
                }}
              >
                {flake.char}
              </span>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Terminal;
