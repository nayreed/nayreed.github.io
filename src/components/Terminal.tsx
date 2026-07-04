import React, { useEffect, useState } from 'react';

const researchInterests = [
  'Spiking Neural Networks',
  'Federated Learning',
  'Neuromorphic Computing',
  'Edge Intelligence',
  'Wireless Communications & Signal Processing',
  'High-Performance Computing',
  'Deep Learning for Communications',
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
            {i < researchInterests.length - 1 && <span className="text-mute"> · </span>}
          </span>
        ))}
      </p>
    ),
  },
];

const START_DELAY = 700;
const CHAR_DELAY = 45;
const ENTER_DELAY = 400; // pause between finishing a command and its output appearing

const Caret = () => <span className="text-ink animate-caret-blink">▋</span>;

const Terminal = () => {
  const [state, setState] = useState({ step: 0, chars: 0 });
  const done = state.step >= COMMANDS.length;

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
    <div className="card-hairline overflow-hidden text-left">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-soft">
        <span className="w-3 h-3 rounded-full bg-terminal-red"></span>
        <span className="w-3 h-3 rounded-full bg-terminal-yellow"></span>
        <span className="w-3 h-3 rounded-full bg-terminal-green"></span>
        <span className="ml-3 font-mono text-xs text-mute truncate">nayreed@oulu: ~</span>
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
