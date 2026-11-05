import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { playExitGotcha } from '@/lib/exitGotcha';
import { notifyMascot } from '@/lib/mascotBus';

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

const Caret = () => <span className="text-ink animate-caret-blink select-none">|</span>;

// Cursor for the input line: zero width, so moving it with ←/→ never shifts the text.
const InputCaret = () => (
  <span className="inline-block w-0 select-none" aria-hidden="true">
    <span className="inline-block -translate-x-1/2 text-ink animate-caret-blink">|</span>
  </span>
);

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
      className="prompt-icon w-5 h-5 shrink-0 text-ink"
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

// ---------------------------------------------------------------------------
// Interactive shell
// ---------------------------------------------------------------------------

const LINKS = {
  cv: 'https://a3s.fi/swift/v1/nayreed/Nayreeds-Resume.pdf',
  github: 'https://github.com/nayreed',
  linkedin: 'https://www.linkedin.com/in/nayreed/',
} as const;
type LinkTarget = keyof typeof LINKS;

const EMAILS = ['nayreedptk@gmail.com', 'RezwanAhmad.Nayreed@student.oulu.fi'];

const HELP_ROWS: [string, string][] = [
  ['whoami', 'print the current user'],
  ['about', 'a little about me'],
  ['open <target>', 'open cv, github or linkedin'],
];

// The window grows with its content up to this height (px, excluding padding). Past that,
// the oldest whole command blocks are removed so it never needs a scrollbar.
const MAX_CONTENT_HEIGHT = 320;
// Hard cap on stored commands, in case one is ever added without being measured.
const MAX_ENTRIES = 30;

const COMMAND_NAMES = ['help', 'whoami', 'about', 'open', 'contact', 'history', 'clear'];

const ExtLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target={href.startsWith('mailto:') ? undefined : '_blank'}
    rel="noopener noreferrer"
    className="text-ink underline underline-offset-2 decoration-hairline-strong hover:decoration-current"
  >
    {children}
  </a>
);

interface Entry {
  id: number;
  cmd: string;
  output: React.ReactNode;
  anim?: 'wipe';
}

// --- rm -rf / and sudo ------------------------------------------------------

// True for "rm -rf /" and its flag spellings (-fr, -Rf, -r -f, ...).
const isRmRfRoot = (tokens: string[]) => {
  if (tokens[0] !== 'rm') return false;
  const rest = tokens.slice(1);
  const flags = rest.filter((t) => t.startsWith('-')).join('');
  const targets = rest.filter((t) => !t.startsWith('-'));
  return /[rR]/.test(flags) && flags.includes('f') && targets.length === 1 && targets[0] === '/';
};

const WIPE_PATHS = ['/bin', '/boot', '/dev', '/etc', '/home/nayreed', '/lib', '/opt', '/root', '/sbin', '/srv', '/tmp', '/usr', '/var'];
const WIPE_BAR = 20;
const WIPE_STEP_MS = 150;

// Fake "sudo rm -rf /": a progress bar runs to 100%, then the punchline.
const WipeOutput = ({ running, onDone }: { running: boolean; onDone: () => void }) => {
  const reduceMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [step, setStep] = useState(reduceMotion.current ? WIPE_PATHS.length : 0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finished = step >= WIPE_PATHS.length;

  useEffect(() => {
    if (!running) return;
    if (finished) {
      onDoneRef.current();
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), WIPE_STEP_MS);
    return () => clearTimeout(timer);
  }, [running, step, finished]);

  const pct = Math.round((step / WIPE_PATHS.length) * 100);
  const filled = Math.round((step / WIPE_PATHS.length) * WIPE_BAR);
  return (
    <div className="text-fade">
      <p>{finished ? 'removed /' : `removing ${WIPE_PATHS[step]}`}</p>
      <p className="whitespace-pre">
        [{'#'.repeat(filled)}
        {'-'.repeat(WIPE_BAR - filled)}] {String(pct).padStart(3, ' ')}%
      </p>
      {finished && <p className="text-ink mt-1">just kidding ^^</p>}
      {!running && !finished && <p>^C</p>}
    </div>
  );
};

const runCommand = (raw: string, history: string[]): React.ReactNode | 'CLEAR' | 'WIPE' => {
  const line = raw.trim();
  if (!line) return null;

  // Re-running a command from the intro prints the same output again.
  const intro = COMMANDS.find((c) => c.cmd === line);
  if (intro) return intro.output;

  // "rm -rf/" is read as "rm -rf /".
  const tokens = line
    .split(/\s+/)
    .flatMap((t) => (t.length > 2 && t.startsWith('-') && t.endsWith('/') ? [t.slice(0, -1), '/'] : [t]));
  if (tokens[0] === 'sudo') {
    if (isRmRfRoot(tokens.slice(1))) return 'WIPE';
    notifyMascot('sudo-denied');
    return <p className="text-fade">You are not in the sudoers file. This incident will be reported.</p>;
  }
  if (isRmRfRoot(tokens)) {
    notifyMascot('rm-refused');
    return (
      <div className="text-fade">
        <p>rm: it is dangerous to operate recursively on '/'</p>
        <p>rm: use sudo!! to override this failsafe</p>
      </div>
    );
  }

  const [name, ...args] = tokens;
  const joined = tokens.join(' ').toLowerCase();
  const cmd = joined === '6 7' || joined === 'six seven' ? 'six-seven' : name.toLowerCase();

  switch (cmd) {
    case 'help':
      return (
        <div className="text-fade">
          <div className="grid grid-cols-[auto_1fr] gap-x-4">
            {HELP_ROWS.map(([c, d]) => (
              <React.Fragment key={c}>
                <span className="text-ink">{c}</span>
                <span>{d}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    case 'whoami':
      return <p className="text-fade">ECE undergrad @ University of Oulu</p>;
    case 'about':
      return (
        <p className="text-fade">all you need to know is nayreed's a good boiii ^^</p>
      );
    case 'open': {
      const target = (args[0] || '').toLowerCase();
      if (!target) return <p className="text-fade">usage: open &lt;cv | github | linkedin&gt;</p>;
      if (!(target in LINKS)) {
        return <p className="text-fade">open: unknown target '{args[0]}'. try: cv, github, linkedin</p>;
      }
      const url = LINKS[target as LinkTarget];
      window.open(url, '_blank', 'noopener,noreferrer');
      return (
        <p className="text-fade">
          opening {target}... <span className="text-mute">(blocked? </span>
          <ExtLink href={url}>click here</ExtLink>
          <span className="text-mute">)</span>
        </p>
      );
    }
    case 'contact':
      return (
        <div className="text-fade grid grid-cols-[auto_1fr] gap-x-4">
          <span className="text-mute">email</span>
          <span className="flex flex-col">
            {EMAILS.map((e) => (
              <ExtLink key={e} href={`mailto:${e}`}>{e}</ExtLink>
            ))}
          </span>
          <span className="text-mute">github</span>
          <ExtLink href={LINKS.github}>github.com/nayreed</ExtLink>
          <span className="text-mute">linkedin</span>
          <ExtLink href={LINKS.linkedin}>linkedin.com/in/nayreed</ExtLink>
        </div>
      );
    case 'history':
      return (
        <div className="text-fade">
          {[...history, line].map((h, i) => (
            <p key={i}>
              <span className="text-mute inline-block w-8 text-right mr-3">{i + 1}</span>
              {h}
            </p>
          ))}
        </div>
      );
    case 'clear':
      return 'CLEAR';
    case '67':
    case 'six-seven':
      notifyMascot('six-seven');
      return <p className="text-fade">6… 7…</p>;
    case 'exit':
      // The browser's own dialog: OK plays the fake shutdown, Cancel just returns to the prompt.
      if (window.confirm('Are you sure you want to exit?')) {
        // Give the robot a moment to cover its eyes before the screen switches off.
        notifyMascot('exit-confirm');
        setTimeout(() => void playExitGotcha(), 700);
      }
      return null;
    default:
      return (
        <p className="text-fade">
          command not found: {name} <span className="text-mute">— try 'help'</span>
        </p>
      );
  }
};

const complete = (value: string): string => {
  const parts = value.trimStart().split(/\s+/);
  if (parts.length === 1) {
    const matches = COMMAND_NAMES.filter((c) => c.startsWith(parts[0].toLowerCase()));
    return matches.length === 1 ? `${matches[0]} ` : value;
  }
  if (parts.length === 2 && parts[0].toLowerCase() === 'open') {
    const matches = (Object.keys(LINKS) as LinkTarget[]).filter((t) => t.startsWith(parts[1].toLowerCase()));
    return matches.length === 1 ? `open ${matches[0]}` : value;
  }
  return value;
};

const Terminal = () => {
  const [state, setState] = useState({ step: 0, chars: 0 });
  const done = state.step >= COMMANDS.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [introDropped, setIntroDropped] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [cursor, setCursor] = useState(0);
  // Id of the entry whose output is still running (prompt hidden until it finishes or ^C).
  const [busyId, setBusyId] = useState<number | null>(null);
  const busy = busyId !== null;
  const [contentTick, setContentTick] = useState(0);

  const clearScreen = useCallback(() => {
    setEntries([]);
    setIntroDropped(COMMANDS.length);
    setBusyId(null);
  }, []);

  // Replace the whole line (history, Tab, clear) and put the cursor at its end.
  const setLine = (value: string) => {
    setInput(value);
    setCursor(value.length);
    requestAnimationFrame(() => inputRef.current?.setSelectionRange(value.length, value.length));
  };

  const syncCursor = () => {
    const el = inputRef.current;
    if (el) setCursor(el.selectionStart ?? el.value.length);
  };

  const submit = () => {
    const line = input;
    const result = runCommand(line, history);
    if (line.trim()) setHistory((h) => [...h, line.trim()]);
    setHistoryIndex(null);
    setLine('');
    if (result === 'CLEAR') {
      clearScreen();
      return;
    }
    const id = nextId.current++;
    if (result === 'WIPE') {
      setEntries((e) => [...e, { id, cmd: line, output: null, anim: 'wipe' as const }].slice(-MAX_ENTRIES));
      setBusyId(id);
      notifyMascot('wipe-start');
      return;
    }
    setEntries((e) => [...e, { id, cmd: line, output: result }].slice(-MAX_ENTRIES));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (busy) {
      // While a command runs, only Ctrl+C (stop) and Ctrl+L (clear) do anything.
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setBusyId(null);
        notifyMascot('wipe-cancel');
      } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        clearScreen();
      } else if (e.key === 'Enter' || e.key === 'Tab' || e.key.startsWith('Arrow')) {
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      const i = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(i);
      setLine(history[i]);
    } else if (e.key === 'ArrowDown') {
      if (historyIndex === null) return;
      e.preventDefault();
      const i = historyIndex + 1;
      if (i >= history.length) {
        setHistoryIndex(null);
        setLine('');
      } else {
        setHistoryIndex(i);
        setLine(history[i]);
      }
    } else if (e.key === 'Tab') {
      if (!input.trim()) return;
      e.preventDefault();
      setLine(complete(input));
    } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      clearScreen();
    } else if (e.ctrlKey && (e.key === 'c' || e.key === 'C') && !window.getSelection()?.toString()) {
      e.preventDefault();
      setEntries((list) => [...list, { id: nextId.current++, cmd: `${input}^C`, output: null }].slice(-MAX_ENTRIES));
      setLine('');
      setHistoryIndex(null);
    }
  };

  useEffect(() => {
    if (!done || typeof ResizeObserver === 'undefined') return;
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setContentTick((t) => t + 1));
    observer.observe(el);
    return () => observer.disconnect();
  }, [done]);

  useLayoutEffect(() => {
    if (!done) return;
    const el = contentRef.current;
    if (!el || el.offsetHeight <= MAX_CONTENT_HEIGHT) return;
    const introLeft = COMMANDS.length - introDropped;
    if (introLeft + entries.length <= 1) return; // a single block taller than the cap is shown in full
    if (introLeft > 0) setIntroDropped((n) => n + 1);
    else setEntries((list) => list.slice(1));
  }, [done, entries, introDropped, input, contentTick]);

  const focusInput = () => {
    if (window.getSelection()?.toString()) return; // let people select and copy text
    inputRef.current?.focus({ preventScroll: true });
  };

  // Put the cursor in the terminal once the intro finishes, but only while it is on screen,
  // and only if nothing else on the page has focus.
  const isOnScreen = useRef(false);
  useEffect(() => {
    if (!done) return;
    const active = document.activeElement;
    if (isOnScreen.current && (!active || active === document.body)) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [done]);
  const [promptVariant, setPromptVariant] = useState<PromptVariant>(() => pickVariant());

  // Each time the terminal leaves the viewport, switch to a different random signal.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    let wasVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      isOnScreen.current = entry.isIntersecting;
      const input = inputRef.current;
      if (entry.isIntersecting) {
        wasVisible = true;
        // Coming back into view: take the cursor back if nothing else has focus.
        const active = document.activeElement;
        if (input && (!active || active === document.body)) input.focus({ preventScroll: true });
      } else if (wasVisible) {
        wasVisible = false;
        setPromptVariant((current) => pickVariant(current));
        // Scrolled away: release focus so Space and arrow keys scroll the page again.
        if (input && document.activeElement === input) input.blur();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Type each command character by character; output prints on "Enter",
  // then the next prompt appears, exactly like a real shell session.
  useEffect(() => {
    if (done) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState({ step: COMMANDS.length, chars: 0 });
      return;
    }

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
      <div
        onClick={done ? focusInput : undefined}
        className={`p-4 sm:p-5 font-mono text-[13px] sm:text-sm leading-relaxed min-h-[240px] sm:min-h-[215px] md:min-h-[200px] ${done ? 'cursor-text' : ''}`}
      >
        <div ref={contentRef}>
        {COMMANDS.slice(introDropped, state.step).map((c) => (
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
          <>
            <div aria-live="polite">
              {entries.map((entry) => (
                <div key={entry.id} className="mb-3">
                  <p className="break-all">
                    <span className="text-mute">$ </span>
                    <span className="text-ink">{entry.cmd}</span>
                  </p>
                  {entry.anim === 'wipe' ? (
                    <WipeOutput
                      running={busyId === entry.id}
                      onDone={() => {
                        setBusyId(null);
                        notifyMascot('wipe-done');
                      }}
                    />
                  ) : (
                    entry.output
                  )}
                </div>
              ))}
            </div>
            <label className={busy ? 'relative block h-0 overflow-hidden' : 'relative block break-all'}>
              {!busy && (
                <>
                  <span className="text-mute select-none">$ </span>
                  <span className="text-ink whitespace-pre-wrap">{input.slice(0, cursor)}</span>
                  <InputCaret />
                  <span className="text-ink whitespace-pre-wrap">{input.slice(cursor)}</span>
                </>
              )}
              <input
                aria-label="Terminal command"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  if (busy) return;
                  // Typing 67 sets the robot off straight away, no Enter needed.
                  const count67 = (s: string) => (s.match(/67/g) ?? []).length;
                  if (count67(e.target.value) > count67(input)) notifyMascot('six-seven');
                  setInput(e.target.value);
                  setCursor(e.target.selectionStart ?? e.target.value.length);
                  setHistoryIndex(null);
                }}
                onKeyDown={onKeyDown}
                onSelect={syncCursor}
                onKeyUp={syncCursor}
                onMouseUp={(e) => {
                  // The hidden input isn't aligned with the drawn text, so a click puts the
                  // cursor at the end; ←/→ move it, like in a real terminal.
                  const el = e.currentTarget;
                  const end = el.value.length;
                  el.setSelectionRange(end, end);
                  setCursor(end);
                }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="send"
                className="absolute inset-0 w-full h-full opacity-0 cursor-text text-[16px] font-mono"
              />
            </label>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
