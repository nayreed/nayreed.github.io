import React, { useEffect, useId, useRef, useState } from 'react';

const researchInterests = [
  'Ambient IoT',
  'Federated Learning',
  'Spiking Neural Networks',
  'Neuromorphic Computing',
  'Edge Intelligence',
  'Wireless Communications & Signal Processing',
  'High-Performance Computing',
];

const COMMANDS = [
  {
    cmd: 'whoami',
    output: <p className="text-fade">ECE undergrad @ University of Oulu</p>,
  },
  {
    cmd: 'cat research-interests.txt',
    output: (
      <p className="text-fade">
        {researchInterests.map((interest, i) => (
          <span key={interest}>
            {interest}
            {i < researchInterests.length - 1 && <span className="text-mute"> &middot; </span>}
          </span>
        ))}
      </p>
    ),
  },
];

const START_DELAY = 700;
const CHAR_DELAY = 45;
const ENTER_DELAY = 400; // pause between finishing a command and its output appearing

const Caret = () => <span className="text-ink animate-caret-blink">|</span>;

// Title-bar prompt icon. The cursor of ">_" is replaced by one of three signals:
// a neuron spike train, a drifting carrier wave, or radio pulses from the prompt.
type PromptVariant = 'spike' | 'wave' | 'pulse';
const PROMPT_VARIANTS: PromptVariant[] = ['spike', 'wave', 'pulse'];

const pickVariant = (exclude?: PromptVariant): PromptVariant => {
  const pool = PROMPT_VARIANTS.filter((v) => v !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
};

const WAVE_PATH = 'M5 19 q1.5 -2.4 3 0 t3 0 t3 0 t3 0 t3 0 t3 0 t3 0 t3 0';

const PromptIcon = ({ variant }: { variant: PromptVariant }) => {
  const clipId = `prompt-clip-${useId().replace(/:/g, '')}`;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prompt-icon w-4 h-4 shrink-0 text-ink"
    >
      <polyline points="4 17 10 11 4 5" />
      {variant === 'spike' && (
        <>
          <line x1="12" y1="19" x2="20" y2="19" />
          <path className="prompt-spike" strokeWidth={1.6} d="M15 19 L16 9.5 L17 19" />
        </>
      )}
      {variant === 'wave' && (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect x="11" y="15" width="10" height="8" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <path className="prompt-wave" d={WAVE_PATH} />
          </g>
        </>
      )}
      {variant === 'pulse' && (
        <>
          <path className="prompt-arc" strokeWidth={1.75} d="M12.47 8.53 A3.5 3.5 0 0 1 12.47 13.47" />
          <path className="prompt-arc prompt-arc-2" strokeWidth={1.75} d="M14.24 6.76 A6 6 0 0 1 14.24 15.24" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </>
      )}
    </svg>
  );
};

const Terminal = () => {
  const [state, setState] = useState({ step: 0, chars: 0 });
  const done = state.step >= COMMANDS.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const [promptVariant, setPromptVariant] = useState<PromptVariant>(() => pickVariant());

  // Each time the terminal leaves the viewport, switch to a different random signal.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    let wasVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        wasVisible = true;
      } else if (wasVisible) {
        wasVisible = false;
        setPromptVariant((current) => pickVariant(current));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Type each command character by character; output prints on "Enter",
  // then the next prompt appears, exactly like a real shell session.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState({ step: COMMANDS.length, chars: 0 });
      return;
    }
    if (done) return;

    const current = COMMANDS[state.step].cmd;
    const delay =
      state.step === 0 && state.chars === 0
        ? START_DELAY
        : state.chars < current.length
          ? CHAR_DELAY
          : ENTER_DELAY;

    const timer = setTimeout(() => {
      setState((s) => {
        const cmd = COMMANDS[s.step].cmd;
        if (s.chars < cmd.length) return { ...s, chars: s.chars + 1 };
        return { step: s.step + 1, chars: 0 };
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [state, done]);

  return (
    <div ref={rootRef} className="card-hairline overflow-hidden text-left">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-soft">
        <PromptIcon variant={promptVariant} />
        <span className="ml-1 font-mono text-xs text-mute truncate">nayreed@oulu: ~</span>
      </div>

      {/* Session */}
      <div className="p-4 sm:p-5 font-mono text-[13px] sm:text-sm leading-relaxed min-h-[240px] sm:min-h-[215px] md:min-h-[200px]">
        {COMMANDS.slice(0, state.step).map((c) => (
          <div key={c.cmd} className="mb-3">
            <p>
              <span className="text-mute">$ </span>
              <span className="text-ink">{c.cmd}</span>
            </p>
            {c.output}
          </div>
        ))}

        {!done ? (
          <p>
            <span className="text-mute">$ </span>
            <span className="text-ink">{COMMANDS[state.step].cmd.slice(0, state.chars)}</span>
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
  );
};

export default Terminal;
