import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MASCOT_EVENT, type MascotEventType } from '@/lib/mascotBus';

const moods = ['idle', 'happy', 'curious'] as const;
type Mood = (typeof moods)[number];
type PetMood = Mood | 'charged' | 'sleepy' | 'shocked' | 'hiding' | 'wink' | 'shades';

const comboMessages = [
  'Nayreed is a good boy',
  'Certified space booper',
  "What a nice portfolio, isn't it?",
  'Portfolio guardian online',
];
const selectionMessage = 'Copying for what exactly?';
const selectionMinLength = 15;
const shortcutMessages = {
  devtools: 'Nice try. DevTools took a wrong turn.',
  inspect: 'Inspect mode? Not on this planet.',
  console: 'Console is currently orbiting Jupiter.',
  source: 'View Source is in another galaxy.',
} as const;

// One-time quip the first time each section scrolls into view.
const sectionQuips: Record<string, string> = {
  experience: 'Real research, real deadlines.',
  projects: 'Built with love and a lot of debugging.',
  publications: 'In preparation… like my sleep schedule.',
  education: 'Study mode: ON.',
  skills: 'So many tools. Such a tidy table.',
  activities: 'Busy human, this one.',
  articles: 'A writer too? Fancy.',
  contact: "Go on, say hi. I won't tell.",
};

// How the robot reacts to the terminal easter eggs.
const reactions: Record<MascotEventType, { mood: PetMood; message: string; hold: number }> = {
  'rm-refused': { mood: 'shocked', message: "Whoa. Don't even think about it.", hold: 2400 },
  'sudo-denied': { mood: 'curious', message: 'Nice try.', hold: 2000 },
  'wipe-start': { mood: 'shocked', message: 'You monster!!', hold: 2600 },
  'wipe-cancel': { mood: 'happy', message: 'Phew. Close one.', hold: 2200 },
  'wipe-done': { mood: 'happy', message: 'Phew… still here.', hold: 2400 },
  'exit-confirm': { mood: 'hiding', message: "Don't look!", hold: 1200 },
  'gotcha-done': { mood: 'wink', message: 'Gotcha ;)', hold: 2400 },
};

const POSITION_KEY = 'nayreed-mascot-position';
const EDGE_GAP = 24;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeLook = (distance: number, range: number) =>
  clamp(Math.atan(distance / range) / (Math.PI / 2), -1, 1);

const countSelectionCharacters = (text: string) => text.replace(/\s/g, '').length;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getShortcutMessage = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const ctrlOrMeta = event.ctrlKey || event.metaKey;
  const macDevtoolsModifier = event.metaKey && event.altKey;
  const devtoolsModifier = (ctrlOrMeta && event.shiftKey) || macDevtoolsModifier;

  if (event.key === 'F12') return shortcutMessages.devtools;
  if (devtoolsModifier && key === 'i') return shortcutMessages.inspect;
  if (devtoolsModifier && key === 'c') return shortcutMessages.inspect;
  if (devtoolsModifier && key === 'j') return shortcutMessages.console;
  if ((ctrlOrMeta || macDevtoolsModifier) && key === 'u') return shortcutMessages.source;

  return null;
};

const readSavedPosition = (): { x: number; y: number } | null => {
  try {
    const raw = window.localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') return parsed;
  } catch {
    // storage unavailable (private mode, blocked) – just use the default corner
  }
  return null;
};

const savePosition = (position: { x: number; y: number }) => {
  try {
    window.localStorage.setItem(POSITION_KEY, JSON.stringify(position));
  } catch {
    // ignore
  }
};

const InteractiveAlien = () => {
  const [moodIndex, setMoodIndex] = useState(0);
  const [overrideMood, setOverrideMood] = useState<PetMood | null>(null);
  const [comboMessage, setComboMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [sparkKey, setSparkKey] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Position lives in a ref and is written straight to CSS variables, so dragging and
  // walking never re-render React.
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    lastX: number;
    lastT: number;
    tilt: number;
    moved: boolean;
  } | null>(null);
  const wasDraggedRef = useRef(false);
  const walkingRef = useRef(false);
  const walkTimerRef = useRef<number | null>(null);
  const comboTimerRef = useRef<number | null>(null);
  const comboIndexRef = useRef(0);
  const clickStreakRef = useRef(0);
  const clickStreakTimerRef = useRef<number | null>(null);
  const selectionTimerRef = useRef<number | null>(null);
  const lastSelectionTextRef = useRef('');
  const idleTimerRef = useRef<number | null>(null);
  const reactionTimerRef = useRef<number | null>(null);
  const reactingRef = useRef(false);
  const bubbleVisibleRef = useRef(false);

  const mood: PetMood = overrideMood ?? moods[moodIndex];
  const moodRef = useRef<PetMood>(mood);
  moodRef.current = mood;

  // ---------------------------------------------------------------------------
  // Position helpers
  // ---------------------------------------------------------------------------

  const limits = useCallback(() => {
    const el = buttonRef.current;
    const width = el?.offsetWidth ?? 64;
    const height = el?.offsetHeight ?? 64;
    return {
      minX: -(window.innerWidth - width - EDGE_GAP),
      minY: -(window.innerHeight - height - EDGE_GAP),
    };
  }, []);

  const applyOffset = useCallback((x: number, y: number) => {
    offsetRef.current = { x, y };
    const el = buttonRef.current;
    if (!el) return;
    el.style.setProperty('--pet-x', `${x}px`);
    el.style.setProperty('--pet-y', `${y}px`);
  }, []);

  const clampToViewport = useCallback(
    (x: number, y: number) => {
      const { minX, minY } = limits();
      return { x: clamp(x, minX, 0), y: clamp(y, minY, 0) };
    },
    [limits]
  );

  const stopWalking = useCallback(() => {
    if (walkTimerRef.current) window.clearTimeout(walkTimerRef.current);
    const el = buttonRef.current;
    if (!el || !walkingRef.current) return;
    // Freeze where it visually is right now, so interrupting a walk doesn't jump.
    const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    walkingRef.current = false;
    el.dataset.walking = 'false';
    el.style.setProperty('--look-x', '0');
    applyOffset(matrix.m41, matrix.m42);
  }, [applyOffset]);

  // ---------------------------------------------------------------------------
  // Speech bubble, moods and reactions
  // ---------------------------------------------------------------------------

  const showBubbleMessage = useCallback((nextMessage: string, duration = 2400) => {
    setComboMessage(nextMessage);
    bubbleVisibleRef.current = true;
    if (comboTimerRef.current) window.clearTimeout(comboTimerRef.current);
    comboTimerRef.current = window.setTimeout(() => {
      setComboMessage('');
      bubbleVisibleRef.current = false;
    }, duration);
  }, []);

  const showComboMessage = useCallback(() => {
    const nextMessage = comboMessages[comboIndexRef.current % comboMessages.length];
    comboIndexRef.current += 1;
    showBubbleMessage(nextMessage);
  }, [showBubbleMessage]);

  const wake = useCallback((nextMood?: PetMood) => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    if (nextMood) setOverrideMood(nextMood);
    idleTimerRef.current = window.setTimeout(() => {
      setOverrideMood('sleepy');
    }, 14000);
  }, []);

  // A short, self-ending mood change with a message (used for terminal and section events).
  const react = useCallback(
    (nextMood: PetMood, message: string, hold: number) => {
      if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
      reactingRef.current = true;
      stopWalking();
      wake(nextMood);
      showBubbleMessage(message, hold);
      reactionTimerRef.current = window.setTimeout(() => {
        reactingRef.current = false;
        setOverrideMood(null);
      }, hold);
    },
    [showBubbleMessage, stopWalking, wake]
  );

  // Squash-and-stretch on the drawing (uses the `scale` property so it stacks with the
  // eye-tracking transform instead of replacing it).
  const squash = useCallback((frames: string[], duration: number) => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion() || typeof svg.animate !== 'function') return;
    svg.animate(
      frames.map((scale) => ({ scale })),
      { duration, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' }
    );
  }, []);

  // ---------------------------------------------------------------------------
  // Global listeners: eye tracking, selection, shortcuts, terminal events
  // ---------------------------------------------------------------------------

  useEffect(() => {
    wake();

    const updateLook = (clientX: number, clientY: number) => {
      const target = buttonRef.current;
      if (!target || walkingRef.current) return;

      const bounds = target.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const rangeX = Math.max(window.innerWidth * 0.34, bounds.width * 5);
      const rangeY = Math.max(window.innerHeight * 0.34, bounds.height * 5);
      target.style.setProperty('--look-x', normalizeLook(clientX - centerX, rangeX).toFixed(3));
      target.style.setProperty('--look-y', normalizeLook(clientY - centerY, rangeY).toFixed(3));
    };

    const handlePointer = (event: PointerEvent) => updateLook(event.clientX, event.clientY);

    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0] ?? event.changedTouches[0];
      if (touch) updateLook(touch.clientX, touch.clientY);
    };

    const handleSelectionChange = () => {
      if (selectionTimerRef.current) window.clearTimeout(selectionTimerRef.current);
      selectionTimerRef.current = window.setTimeout(() => {
        const selectedText = window.getSelection()?.toString().trim() ?? '';
        if (countSelectionCharacters(selectedText) <= selectionMinLength) {
          lastSelectionTextRef.current = '';
          return;
        }
        if (selectedText === lastSelectionTextRef.current) return;
        lastSelectionTextRef.current = selectedText;
        wake('curious');
        showBubbleMessage(selectionMessage);
      }, 180);
    };

    // Joke messages for DevTools shortcuts; the shortcut itself still works.
    const handleShortcutKeyDown = (event: KeyboardEvent) => {
      const shortcutMessage = getShortcutMessage(event);
      if (!shortcutMessage) return;
      setSparkKey((current) => current + 1);
      wake('charged');
      showBubbleMessage(shortcutMessage);
    };

    const handleMascotEvent = (event: Event) => {
      const type = (event as CustomEvent<MascotEventType>).detail;
      const reaction = reactions[type];
      if (reaction) react(reaction.mood, reaction.message, reaction.hold);
    };

    window.addEventListener('pointerdown', handlePointer, { passive: true });
    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('keydown', handleShortcutKeyDown, { capture: true });
    window.addEventListener(MASCOT_EVENT, handleMascotEvent);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      window.removeEventListener('pointerdown', handlePointer);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('keydown', handleShortcutKeyDown, { capture: true });
      window.removeEventListener(MASCOT_EVENT, handleMascotEvent);
      document.removeEventListener('selectionchange', handleSelectionChange);
      [comboTimerRef, clickStreakTimerRef, selectionTimerRef, idleTimerRef, reactionTimerRef, walkTimerRef].forEach(
        (timer) => {
          if (timer.current) window.clearTimeout(timer.current);
        }
      );
    };
  }, [react, showBubbleMessage, wake]);

  // ---------------------------------------------------------------------------
  // Remembered position + keep it on screen when the window resizes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const saved = readSavedPosition();
    const el = buttonRef.current;
    if (saved && el) {
      // Jump straight to the saved spot instead of sliding there from the corner.
      const { x, y } = clampToViewport(saved.x, saved.y);
      el.style.transition = 'none';
      applyOffset(x, y);
      void el.offsetWidth; // apply the position before transitions come back
      el.style.transition = '';
    }
    const handleResize = () => {
      const { x, y } = clampToViewport(offsetRef.current.x, offsetRef.current.y);
      applyOffset(x, y);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [applyOffset, clampToViewport]);

  // ---------------------------------------------------------------------------
  // Section quips
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) return;
          // Only after the visitor has started scrolling, and never over another message.
          if (window.scrollY < 40 || bubbleVisibleRef.current || reactingRef.current || dragRef.current) return;
          seen.add(id);
          react('happy', sectionQuips[id], 2600);
        });
      },
      { threshold: 0.35 }
    );
    Object.keys(sectionQuips).forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [react]);

  // ---------------------------------------------------------------------------
  // Theme reaction: sunglasses for light mode, relief for dark mode
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const root = document.documentElement;
    let wasDark = root.classList.contains('dark');
    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains('dark');
      if (isDark === wasDark) return;
      wasDark = isDark;
      if (isDark) react('happy', 'Ahh, much better.', 2200);
      else react('shades', 'Too bright!', 3500);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [react]);

  // ---------------------------------------------------------------------------
  // Wandering: every so often, take a short stroll along the bottom edge
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let timer: number;

    const wander = () => {
      const el = buttonRef.current;
      if (!el) return;
      const { minX } = limits();
      const current = offsetRef.current;
      const distance = 50 + Math.random() * 90;
      const direction = Math.random() < 0.5 ? -1 : 1;
      let nextX = clamp(current.x + direction * distance, minX, 0);
      if (Math.abs(nextX - current.x) < 30) nextX = clamp(current.x - direction * distance, minX, 0);
      const travelled = Math.abs(nextX - current.x);
      if (travelled < 30) return;

      const duration = Math.round(travelled * 14);
      walkingRef.current = true;
      el.dataset.walking = 'true';
      el.style.setProperty('--walk-ms', `${duration}ms`);
      el.style.setProperty('--look-x', String(Math.sign(nextX - current.x) * 0.8));
      el.style.setProperty('--look-y', '0');
      applyOffset(nextX, current.y);
      walkTimerRef.current = window.setTimeout(() => {
        walkingRef.current = false;
        el.dataset.walking = 'false';
        el.style.setProperty('--look-x', '0');
      }, duration + 60);
    };

    const tick = () => {
      const canWander =
        document.visibilityState === 'visible' &&
        !walkingRef.current &&
        !dragRef.current &&
        !reactingRef.current &&
        !bubbleVisibleRef.current &&
        moodRef.current !== 'sleepy';
      if (canWander) wander();
      timer = window.setTimeout(tick, 12000 + Math.random() * 10000);
    };

    timer = window.setTimeout(tick, 9000 + Math.random() * 6000);
    return () => window.clearTimeout(timer);
  }, [applyOffset, limits]);

  // ---------------------------------------------------------------------------
  // Pointer: drag with tilt, click moods, double-click spark
  // ---------------------------------------------------------------------------

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    stopWalking();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
      lastX: event.clientX,
      lastT: performance.now(),
      tilt: 0,
      moved: false,
    };
    setIsDragging(false);
    wake('curious');
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 5) {
      drag.moved = true;
      wasDraggedRef.current = true;
      setIsDragging(true);
    }
    if (!drag.moved) return;

    const { x, y } = clampToViewport(drag.originX + dx, drag.originY + dy);
    applyOffset(x, y);

    // Lean into the direction of travel, based on horizontal speed.
    const now = performance.now();
    const elapsed = Math.max(1, now - drag.lastT);
    const speed = (event.clientX - drag.lastX) / elapsed;
    drag.tilt = drag.tilt * 0.7 + clamp(speed * 9, -14, 14) * 0.3;
    drag.lastX = event.clientX;
    drag.lastT = now;
    event.currentTarget.style.setProperty('--tilt', `${drag.tilt.toFixed(2)}deg`);
  };

  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId === event.pointerId) {
      dragRef.current = null;
      if (drag.moved) {
        savePosition(offsetRef.current);
        squash(['1 1', '1.1 0.88', '0.96 1.05', '1 1'], 420); // little landing bounce
      }
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.style.setProperty('--tilt', '0deg'); // springs back upright
    setIsDragging(false);
  };

  const resetLook = () => {
    const target = buttonRef.current;
    if (!target) return;
    target.style.setProperty('--look-x', '0');
    target.style.setProperty('--look-y', '0');
  };

  const handleClick = () => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      wake('curious');
      return;
    }

    squash(['1 1', '1.12 0.86', '0.94 1.08', '1 1'], 360);

    const nextIndex = (moodIndex + 1) % moods.length;
    const nextMood = moods[nextIndex];
    setMoodIndex(nextIndex);
    setOverrideMood(null);
    wake(nextMood);

    clickStreakRef.current += 1;
    if (clickStreakTimerRef.current) window.clearTimeout(clickStreakTimerRef.current);
    clickStreakTimerRef.current = window.setTimeout(() => {
      clickStreakRef.current = 0;
    }, 1300);

    if (clickStreakRef.current >= 5) {
      setSparkKey((current) => current + 1);
      wake('charged');
      showComboMessage();
      clickStreakRef.current = 0;
    }
  };

  const handleDoubleClick = () => {
    setSparkKey((current) => current + 1);
    wake('charged');
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={comboMessage || (mood === 'sleepy' ? 'Alien mascot is napping' : 'Interact with the alien mascot')}
      className="alien-mascot fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-4 z-40 h-16 w-16 sm:bottom-[calc(env(safe-area-inset-bottom)+1.75rem)] sm:right-7 sm:h-[72px] sm:w-[72px]"
      data-mood={mood}
      data-dragging={isDragging}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onBlur={resetLook}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <span className="alien-mascot__secret" aria-live="polite" data-visible={Boolean(comboMessage)}>
        {comboMessage}
      </span>
      <span className="alien-mascot__nap" aria-hidden="true">
        zzzzz
      </span>
      <span className="alien-mascot__halo" aria-hidden="true" />
      <svg ref={svgRef} viewBox="0 0 128 128" aria-hidden="true" className="alien-mascot__svg">
        <g key={sparkKey} className="alien-mascot__beam">
          <path d="M64 18 54 2h20z" />
          <path d="M64 92 46 122h36z" />
        </g>
        <g className="alien-mascot__shadow">
          <ellipse cx="64" cy="112" rx="30" ry="5" />
        </g>

        <g className="alien-mascot__body">
          <g className="alien-mascot__left-antenna">
            <rect x="42" y="6" width="8" height="22" rx="3" />
          </g>
          <g className="alien-mascot__right-antenna">
            <rect x="78" y="6" width="8" height="22" rx="3" />
          </g>

          <g className="alien-mascot__left-leg">
            <path d="M42 82h8v31H30v-8h12z" />
          </g>
          <g className="alien-mascot__right-leg">
            <path d="M78 82h8v23h12v8H78z" />
          </g>

          <path className="alien-mascot__shell" fillRule="evenodd" d="M24 28h80v54H24z M32 36v38h64V36z" />

          <g className="alien-mascot__eyes">
            <rect className="alien-mascot__eye alien-mascot__eye--left" x="41" y="51" width="10" height="10" rx="2" />
            <rect className="alien-mascot__eye alien-mascot__eye--right" x="77" y="51" width="10" height="10" rx="2" />
            <g className="alien-mascot__shades">
              <rect x="35" y="47" width="22" height="16" rx="4" />
              <rect x="71" y="47" width="22" height="16" rx="4" />
              <path className="alien-mascot__shades-bridge" d="M57 52h14" />
              <path className="alien-mascot__shades-glint" d="M39 51l5 0 M75 51l5 0" />
            </g>
          </g>
          <path className="alien-mascot__mouth" d="M55 68h18" />
          <ellipse className="alien-mascot__mouth-o" cx="64" cy="69" rx="4" ry="5" />

          {/* Hands that slide up over the eyes when hiding; arms are drawn after the face too. */}
          <g className="alien-mascot__hands">
            <rect x="37" y="47" width="18" height="16" rx="6" />
            <rect x="73" y="47" width="18" height="16" rx="6" />
          </g>
          <g className="alien-mascot__left-arm">
            <path className="alien-mascot__arm-line" d="M27 55 C18 55 11 62 11 73 C11 79 13 84 15 87" />
            <path className="alien-mascot__palm" d="M9 83c2-2 8-2 10 0l-1 6h-8z" />
          </g>
          <g className="alien-mascot__right-arm">
            <path className="alien-mascot__arm-line" d="M101 55 C110 55 117 62 117 73 C117 79 115 84 113 87" />
            <path className="alien-mascot__palm" d="M109 83c2-2 8-2 10 0l-1 6h-8z" />
          </g>

          <g className="alien-mascot__sparks">
            <path d="M18 28h4v-4h4v4h4v4h-4v4h-4v-4h-4z" />
            <path d="M98 18h3v-3h3v3h3v3h-3v3h-3v-3h-3z" />
          </g>
        </g>
      </svg>
    </button>
  );
};

export default InteractiveAlien;
