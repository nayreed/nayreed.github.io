import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MASCOT_EVENT, type MascotEventType } from '@/lib/mascotBus';
import {
  dropCloth,
  isHoldingCloth,
  isMessy,
  restore as restoreMess,
  splat,
  setMessListener,
  stainSpots,
  takeCloth,
} from '@/lib/vomitMess';

const moods = ['idle', 'happy', 'curious'] as const;
type Mood = (typeof moods)[number];
type PetMood = Mood | 'charged' | 'sleepy' | 'shocked' | 'hiding' | 'wink' | 'shades' | 'queasy' | 'vomit' | 'dazed' | 'embarrassed' | 'offer';

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

type Point = { x: number; y: number };

// Shake-to-barf tuning. The pointer path is split into swings (movement in one direction
// until it reverses). Only violent swings count: long, fast, and quickly reversed.
const SWING_MIN_DISTANCE = 50; // px travelled in one direction
const SWING_MIN_SPEED = 0.9; // px per ms on average over the swing (~900 px/s)
const SWING_MAX_DURATION = 350; // ms; slower back-and-forth is just moving it around
const SWING_REVERSE_SLACK = 10; // px it must come back before it counts as a reversal
const BARF_SWINGS = 5; // violent swings...
const BARF_WINDOW_MS = 1200; // ...within this time make it gag
const VOMIT_SWINGS = 6; // more violent swings after the gag...
const VOMIT_WINDOW_MS = 1500; // ...within this time make it vomit
const VOMIT_MIN_AFTER_BARF_MS = 900; // it always gags for a moment first
const RECOVER_AFTER_MS = 5000; // calm time after the last violent swing before "all good"
const DAZED_MS = 4500; // how long it stays wobbly after vomiting
const REFRESH_TAUNTS = [
  "Nice try. Refreshing doesn't clean screens.",
  'Still here. Refresh all you want.',
  "It's on the glass, not the page!",
  'Okay, now you are just wasting time. Grab the cloth.',
];
const VOMIT_COLORS = ['#9bbf3a', '#b7cf5a', '#7ea32b', '#c9d97a'];

// Spew pixel chunks from a point on screen: a few heaves, each a burst that arcs out toward
// the viewer (growing as it nears the glass) and splats onto the screen, where it sticks.
const spewVomit = (origin: Point, direction: number) => {
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '41' });
  document.body.appendChild(layer);

  type Chunk = {
    el: HTMLDivElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    born: number;
    impact: number; // ms until it hits the glass
    landed: boolean;
  };
  const chunks: Chunk[] = [];
  const start = performance.now();
  const bursts = [0, 260, 520];

  bursts.forEach((delay, burst) => {
    window.setTimeout(() => {
      const count = burst === 1 ? 16 : 10;
      for (let i = 0; i < count; i++) {
        const big = burst === 1 && i === 0; // one big blob in the main heave
        const size = big ? 11 : 3 + Math.random() * 5;
        const el = document.createElement('div');
        Object.assign(el.style, {
          position: 'absolute',
          left: '0',
          top: '0',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '1.5px',
          background: VOMIT_COLORS[Math.floor(Math.random() * VOMIT_COLORS.length)],
          willChange: 'transform, opacity',
        });
        layer.appendChild(el);
        chunks.push({
          el,
          x: origin.x,
          y: origin.y,
          vx: direction * (0.1 + Math.random() * 0.32) + (Math.random() - 0.5) * 0.2,
          vy: -0.2 - Math.random() * 0.22,
          size,
          born: performance.now(),
          impact: big ? 520 : 380 + Math.random() * 360,
          landed: false,
        });
      }
    }, delay);
  });

  let last = start;
  const frame = (now: number) => {
    const dt = Math.min(40, now - last);
    last = now;
    let flying = 0;
    chunks.forEach((c) => {
      if (c.landed) return;
      const age = now - c.born;
      if (age >= c.impact) {
        // Hits the glass: a quick flattening flash, and the stain stays on the screen.
        c.landed = true;
        splat(c.x, c.y, c.size * (1.5 + Math.random() * 1.1));
        c.el.animate(
          [
            { transform: `translate(${c.x}px, ${c.y}px) scale(2.4)`, opacity: 1 },
            { transform: `translate(${c.x}px, ${c.y}px) scale(3.4, 2.6)`, opacity: 0 },
          ],
          { duration: 110, fill: 'forwards' }
        );
        return;
      }
      flying++;
      c.vy += 0.0011 * dt; // a gentler arc: it's flying toward you, not just falling
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      const nearness = 1 + 1.4 * (age / c.impact); // grows as it approaches the glass
      c.el.style.transform = `translate(${c.x}px, ${c.y}px) rotate(${age * 0.5}deg) scale(${nearness.toFixed(2)})`;
    });
    if (flying > 0 || now - start < 800) requestAnimationFrame(frame);
    else window.setTimeout(() => layer.remove(), 150);
  };
  requestAnimationFrame(frame);
};

// Catmull-Rom spline: a smooth curve that passes through every point.
const pointOnCurve = (points: Point[], u: number): Point => {
  const segments = points.length - 1;
  const s = clamp(u, 0, 1) * segments;
  const i = Math.min(Math.floor(s), segments - 1);
  const t = s - i;
  const p0 = points[Math.max(i - 1, 0)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(i + 2, points.length - 1)];
  const t2 = t * t;
  const t3 = t2 * t;
  const axis = (k: 'x' | 'y') =>
    0.5 *
    (2 * p1[k] +
      (-p0[k] + p2[k]) * t +
      (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
      (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
  return { x: axis('x'), y: axis('y') };
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
    moved: boolean;
  } | null>(null);
  // Smooth follow: the pointer sets a target, and a per-frame loop eases the robot toward it.
  const followRef = useRef({ targetX: 0, targetY: 0, tilt: 0, lastT: 0, frame: 0 as number | 0 });
  const wasDraggedRef = useRef(false);
  const walkingRef = useRef(false);
  const floatingRef = useRef(false);
  const floatFrameRef = useRef<number | null>(null);
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
  const saidKeepGoingRef = useRef(false);
  const notAgainAtRef = useRef(0);
  type Axis = { dir: number; extreme: number; extremeT: number; prevExtreme: number; prevExtremeT: number };
  const newAxis = (value: number, now: number): Axis => ({
    dir: 0,
    extreme: value,
    extremeT: now,
    prevExtreme: value,
    prevExtremeT: now,
  });
  const shakeRef = useRef({
    x: newAxis(0, 0),
    y: newAxis(0, 0),
    swings: [] as number[], // timestamps of violent swings
    stage: 'fine' as 'fine' | 'queasy' | 'vomited',
    barfAt: 0,
    recoverTimer: 0,
  });
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
    // Speech bubble goes left/above by default; flip it when the robot is near the left or top edge.
    const fromRight = -x; // px from its home corner
    const fromBottom = -y;
    el.dataset.bubbleX = window.innerWidth - fromRight < 300 ? 'right' : 'left';
    el.dataset.bubbleY = window.innerHeight - fromBottom < 190 ? 'below' : 'above';
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

  const stopFloating = useCallback(() => {
    const el = buttonRef.current;
    if (!el || !floatingRef.current) return;
    if (floatFrameRef.current) cancelAnimationFrame(floatFrameRef.current);
    floatingRef.current = false;
    // Unwind any somersault to the nearest upright angle, then let it spring back.
    const angle = parseFloat(el.style.getPropertyValue('--tilt')) || 0;
    el.style.setProperty('--tilt', `${(((angle % 360) + 540) % 360) - 180}deg`);
    el.style.setProperty('--look-x', '0');
    el.style.setProperty('--look-y', '0');
    requestAnimationFrame(() => {
      el.dataset.floating = 'false';
      el.style.setProperty('--tilt', '0deg');
    });
  }, []);

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
      if (!target || walkingRef.current || floatingRef.current || dragRef.current?.moved) return;

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

  useEffect(
    () => () => {
      if (followRef.current.frame) cancelAnimationFrame(followRef.current.frame);
    },
    []
  );

  // Mess events, and a mess left over from before a page refresh.
  useEffect(() => {
    setMessListener({
      onSettled: () => window.setTimeout(noticeMess, 1800),
      onClothChange: (holding) => {
        if (holding) {
          saidKeepGoingRef.current = false;
          setSick('happy', 'Rub it off! (Esc to hand it back)', 3200);
        } else if (isMessy()) {
          setSick('offer', "Hey, it's still dirty!", 2600);
        }
      },
      onProgress: (left) => {
        if (isHoldingCloth() && left < 0.5 && !saidKeepGoingRef.current) {
          saidKeepGoingRef.current = true;
          showBubbleMessage('Keep going!', 1600);
        }
      },
      onCleaned: () => {
        shakeRef.current.stage = 'fine';
        shakeRef.current.swings = [];
        setSparkKey((k) => k + 1);
        react('happy', 'Spotless! Thank you.', 2800);
      },
    });

    let cancelled = false;
    restoreMess().then((refreshCount) => {
      if (cancelled || !refreshCount) return;
      window.setTimeout(() => {
        const taunt = REFRESH_TAUNTS[Math.min(refreshCount, REFRESH_TAUNTS.length) - 1];
        const spot = stainSpots()[0];
        if (spot) lookAt(spot);
        setSick('wink', taunt, 3000);
        window.setTimeout(() => offerCloth(), 3000);
      }, 700);
    });
    return () => {
      cancelled = true;
      setMessListener({});
    };
    // Runs once; the handlers only use refs and stable callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // A quip only fires once someone is actually reading: the section fills a good part
    // of the screen and stays there, with no fast scrolling, for READ_DWELL_MS.
    const READ_DWELL_MS = 3000;
    const SKIM_SPEED = 0.8; // px per ms (~800 px/s); faster than this counts as skimming
    const seen = new Set<string>();
    const reading = new Map<string, number>(); // section id -> pending dwell timer

    const stopTimer = (id: string) => {
      const timer = reading.get(id);
      if (timer) window.clearTimeout(timer);
      reading.delete(id);
    };

    const startTimer = (id: string, delay = READ_DWELL_MS) => {
      stopTimer(id);
      reading.set(
        id,
        window.setTimeout(() => {
          reading.delete(id);
          if (seen.has(id)) return;
          // Never talk over another message; try again shortly while they keep reading.
          if (
            bubbleVisibleRef.current ||
            reactingRef.current ||
            dragRef.current ||
            walkingRef.current ||
            floatingRef.current
          ) {
            startTimer(id, 1500);
            return;
          }
          seen.add(id);
          react('happy', sectionQuips[id], 2600);
        }, delay)
      );
    };

    const isReadable = (entry: IntersectionObserverEntry) => {
      if (!entry.isIntersecting) return false;
      const viewportShare = entry.intersectionRect.height / window.innerHeight;
      // Tall sections: fill at least 40% of the screen. Short ones: be mostly visible.
      return viewportShare >= 0.4 || entry.intersectionRatio >= 0.6;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (seen.has(id)) return;
          if (isReadable(entry)) {
            if (!reading.has(id)) startTimer(id);
          } else {
            stopTimer(id);
          }
        });
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    // Fast scrolling restarts the reading clock for every section on screen.
    let lastY = window.scrollY;
    let lastT = performance.now();
    const handleScroll = () => {
      const now = performance.now();
      const speed = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      if (speed > SKIM_SPEED) [...reading.keys()].forEach((id) => startTimer(id));
    };

    Object.keys(sectionQuips).forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      [...reading.keys()].forEach(stopTimer);
    };
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

    // Zero-gravity trip: lift off, drift along a smooth curve through a few random points
    // with a lazy sway (or the odd slow somersault), then come back down to its usual edge.
    const floatAround = () => {
      const el = buttonRef.current;
      if (!el) return;
      const { minX, minY } = limits();
      const start = { ...offsetRef.current };
      const between = (a: number, b: number) => a + Math.random() * (b - a);

      const points: Point[] = [start];
      const stops = Math.random() < 0.5 ? 2 : 3;
      for (let i = 0; i < stops; i++) {
        points.push({ x: between(minX * 0.9, minX * 0.1), y: between(minY * 0.7, minY * 0.2) });
      }
      let endX = between(minX, 0);
      if (Math.abs(endX - start.x) < 80) endX = clamp(start.x + (start.x > minX / 2 ? -160 : 160), minX, 0);
      const end = { x: endX, y: start.y };
      points.push(end);

      const duration = between(6500, 9000);
      const somersault = Math.random() < 0.3;
      const spin = Math.random() < 0.5 ? -1 : 1;
      floatingRef.current = true;
      el.dataset.floating = 'true';
      squash(['1 1', '1.08 0.9', '0.95 1.06', '1 1'], 380); // little crouch to push off

      const startTime = performance.now();
      let previous = start;
      const frame = (now: number) => {
        if (!floatingRef.current) return;
        const t = Math.min(1, (now - startTime) / duration);
        const eased = -(Math.cos(Math.PI * t) - 1) / 2; // gentle start and stop
        const envelope = Math.sin(Math.PI * t); // effects fade in and out with the trip
        const point = pointOnCurve(points, eased);
        const x = clamp(point.x, minX, 0);
        const y = clamp(point.y + Math.sin(t * Math.PI * 4.4) * 7 * envelope, minY, 0);
        applyOffset(x, y);

        const angle = somersault
          ? spin * 360 * eased + 8 * Math.sin(t * Math.PI * 4) * envelope
          : spin * 24 * Math.sin(t * Math.PI * 1.8) * envelope;
        el.style.setProperty('--tilt', `${angle.toFixed(2)}deg`);

        // Look where it's drifting.
        const dx = x - previous.x;
        const dy = y - previous.y;
        const length = Math.hypot(dx, dy);
        if (length > 0.05) {
          el.style.setProperty('--look-x', ((dx / length) * 0.7).toFixed(3));
          el.style.setProperty('--look-y', ((dy / length) * 0.7).toFixed(3));
        }
        previous = { x, y };

        if (t < 1) {
          floatFrameRef.current = requestAnimationFrame(frame);
          return;
        }
        // Touch down: settle upright (360° looks the same as 0°), then a landing squash.
        el.style.setProperty('--tilt', '0deg');
        applyOffset(end.x, end.y);
        requestAnimationFrame(() => {
          floatingRef.current = false;
          el.dataset.floating = 'false';
          el.style.setProperty('--look-x', '0');
          el.style.setProperty('--look-y', '0');
          squash(['1 1', '1.12 0.86', '0.96 1.05', '1 1'], 440);
        });
      };
      floatFrameRef.current = requestAnimationFrame(frame);
    };

    const tick = () => {
      const canWander =
        document.visibilityState === 'visible' &&
        !walkingRef.current &&
        !floatingRef.current &&
        !dragRef.current &&
        !reactingRef.current &&
        !bubbleVisibleRef.current &&
        moodRef.current !== 'sleepy' &&
        !isMessy();
      if (canWander) {
        if (Math.random() < 0.33) floatAround();
        else wander();
      }
      timer = window.setTimeout(tick, 12000 + Math.random() * 10000);
    };

    timer = window.setTimeout(tick, 9000 + Math.random() * 6000);
    return () => {
      window.clearTimeout(timer);
      if (floatFrameRef.current) cancelAnimationFrame(floatFrameRef.current);
    };
  }, [applyOffset, limits, squash]);

  // ---------------------------------------------------------------------------
  // Pointer: drag with tilt, click moods, double-click spark
  // ---------------------------------------------------------------------------

  // Shaken too hard. Stage 1: it gags ("barf"). If the violent shaking carries on, stage 2:
  // it retches and vomits, stays dazed for a while, then recovers. Calm down after the gag and
  // it recovers on its own a few seconds later.
  const setSick = (nextMood: PetMood, message?: string, bubbleMs = 2400) => {
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
    reactingRef.current = true;
    wake(nextMood);
    if (message) showBubbleMessage(message, bubbleMs);
  };

  const recover = (message: string) => {
    const shake = shakeRef.current;
    window.clearTimeout(shake.recoverTimer);
    shake.stage = 'fine';
    shake.swings = [];
    react('happy', message, 2600);
  };

  const scheduleRecovery = () => {
    const shake = shakeRef.current;
    window.clearTimeout(shake.recoverTimer);
    shake.recoverTimer = window.setTimeout(() => {
      if (shakeRef.current.stage === 'queasy') recover('Phew… all good now.');
    }, RECOVER_AFTER_MS);
  };

  const vomit = () => {
    const shake = shakeRef.current;
    shake.stage = 'vomited';
    window.clearTimeout(shake.recoverTimer);
    setSick('vomit', 'BLEHHHH', 1700);
    const el = buttonRef.current;
    if (el && !prefersReducedMotion()) {
      // Two dry heaves first; it comes out on the big lurch. Mouth sits at (64, 70) in the 128-unit drawing.
      window.setTimeout(() => {
        const box = el.getBoundingClientRect();
        const unit = (box.width - 20) / 128;
        spewVomit({ x: box.left + 10 + 64 * unit, y: box.top + 10 + 70 * unit }, shake.x.dir || -1);
      }, 780);
    }
    window.setTimeout(() => setSick('dazed', 'ugh…', DAZED_MS - 600), 1700);
    // With motion off there is no mess to clean, so it simply recovers.
    if (prefersReducedMotion()) window.setTimeout(() => recover("…okay. I'm good now."), 1700 + DAZED_MS);
  };

  // --- The mess on the glass: embarrassed, offers a cloth, or cleans it up itself -------------

  const lookAt = (point: Point) => {
    const el = buttonRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const dx = point.x - (box.left + box.width / 2);
    const dy = point.y - (box.top + box.height / 2);
    const length = Math.hypot(dx, dy) || 1;
    el.style.setProperty('--look-x', ((dx / length) * 0.9).toFixed(3));
    el.style.setProperty('--look-y', ((dy / length) * 0.9).toFixed(3));
  };

  const offerCloth = (message = 'Click me for a cloth.') => {
    if (!isMessy() || isHoldingCloth()) return;
    setSick('offer', message, 4200);
  };

  const noticeMess = () => {
    const spot = stainSpots()[0];
    if (spot) lookAt(spot);
    setSick('embarrassed', '…what a mess.', 2000);
    window.setTimeout(() => offerCloth(), 2000);
  };

  // Splits the pointer path into swings per axis and records the violent ones.
  const trackShake = (clientX: number, clientY: number) => {
    const shake = shakeRef.current;
    if (shake.stage === 'vomited') return; // nothing left to give
    const now = performance.now();

    const step = (axis: Axis, value: number) => {
      if (axis.dir === 0) {
        if (Math.abs(value - axis.extreme) < SWING_REVERSE_SLACK) return;
        axis.dir = Math.sign(value - axis.extreme);
        axis.prevExtreme = axis.extreme;
        axis.prevExtremeT = axis.extremeT;
        axis.extreme = value;
        axis.extremeT = now;
        return;
      }
      if ((value - axis.extreme) * axis.dir > 0) {
        axis.extreme = value; // still going the same way: push the turning point further
        axis.extremeT = now;
        return;
      }
      if (Math.abs(value - axis.extreme) < SWING_REVERSE_SLACK) return;
      // Reversed: judge the swing that just finished.
      const distance = Math.abs(axis.extreme - axis.prevExtreme);
      const duration = Math.max(1, axis.extremeT - axis.prevExtremeT);
      if (distance >= SWING_MIN_DISTANCE && duration <= SWING_MAX_DURATION && distance / duration >= SWING_MIN_SPEED) {
        shake.swings.push(now);
      }
      axis.prevExtreme = axis.extreme;
      axis.prevExtremeT = axis.extremeT;
      axis.dir = -axis.dir;
      axis.extreme = value;
      axis.extremeT = now;
    };

    const before = shake.swings.length;
    step(shake.x, clientX);
    step(shake.y, clientY);
    if (shake.swings.length === before) return;

    shake.swings = shake.swings.filter((t) => now - t <= Math.max(BARF_WINDOW_MS, VOMIT_WINDOW_MS));
    const recent = (windowMs: number, since = 0) =>
      shake.swings.filter((t) => now - t <= windowMs && t > since).length;

    if (shake.stage === 'fine' && recent(BARF_WINDOW_MS) >= BARF_SWINGS && isMessy()) {
      if (now - notAgainAtRef.current > 3000) {
        notAgainAtRef.current = now;
        showBubbleMessage('Not again… clean this first.', 2200);
      }
      shake.swings = [];
      return;
    }
    if (shake.stage === 'fine' && recent(BARF_WINDOW_MS) >= BARF_SWINGS) {
      shake.stage = 'queasy';
      shake.barfAt = now;
      setSick('queasy', 'Hurk…', 2200);
    } else if (
      shake.stage === 'queasy' &&
      now - shake.barfAt >= VOMIT_MIN_AFTER_BARF_MS &&
      recent(VOMIT_WINDOW_MS, shake.barfAt) >= VOMIT_SWINGS
    ) {
      vomit();
      return;
    } else if (shake.stage === 'queasy' && recent(VOMIT_WINDOW_MS, shake.barfAt) === 3) {
      showBubbleMessage('Seriously, stop…', 1600);
    }
    if (shake.stage === 'queasy') scheduleRecovery();
  };

  // Eases the robot toward the pointer every frame: smooth even with uneven pointer events,
  // leans into the movement, and looks where it's being carried.
  const runFollow = useCallback(() => {
    const follow = followRef.current;
    if (follow.frame) return;
    follow.lastT = performance.now();
    const step = (now: number) => {
      const el = buttonRef.current;
      if (!el) {
        follow.frame = 0;
        return;
      }
      const dt = Math.min(48, Math.max(1, now - follow.lastT));
      follow.lastT = now;
      const { x, y } = offsetRef.current;
      const ease = 1 - Math.exp(-dt / 45); // ~45 ms time constant: responsive but soft
      const nx = x + (follow.targetX - x) * ease;
      const ny = y + (follow.targetY - y) * ease;
      applyOffset(nx, ny);

      const vx = (nx - x) / dt; // px per ms
      const vy = (ny - y) / dt;
      follow.tilt += (clamp(vx * 9, -14, 14) - follow.tilt) * Math.min(1, dt / 90);
      el.style.setProperty('--tilt', `${follow.tilt.toFixed(2)}deg`);
      el.style.setProperty('--look-x', clamp(vx * 1.6, -1, 1).toFixed(3));
      el.style.setProperty('--look-y', clamp(vy * 1.6, -1, 1).toFixed(3));

      const settled =
        !dragRef.current &&
        Math.abs(follow.targetX - nx) < 0.4 &&
        Math.abs(follow.targetY - ny) < 0.4;
      if (settled) {
        follow.frame = 0;
        applyOffset(follow.targetX, follow.targetY);
        savePosition(offsetRef.current);
        follow.tilt = 0;
        el.style.setProperty('--tilt', '0deg'); // springs back upright
        el.style.setProperty('--look-x', '0');
        el.style.setProperty('--look-y', '0');
        setIsDragging(false);
        squash(['1 1', '1.1 0.88', '0.96 1.05', '1 1'], 420); // little landing bounce
        return;
      }
      follow.frame = requestAnimationFrame(step);
    };
    follow.frame = requestAnimationFrame(step);
  }, [applyOffset, squash]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    stopWalking();
    stopFloating();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
      moved: false,
    };
    const now = performance.now();
    shakeRef.current.x = newAxis(event.clientX, now);
    shakeRef.current.y = newAxis(event.clientY, now);
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
    trackShake(event.clientX, event.clientY);

    const { x, y } = clampToViewport(drag.originX + dx, drag.originY + dy);
    followRef.current.targetX = x;
    followRef.current.targetY = y;
    runFollow();
  };

  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId === event.pointerId) dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // If it was dragged, the follow loop glides the last bit, then lands and saves the spot.
    if (!drag?.moved) setIsDragging(false);
  };

  const resetLook = () => {
    const target = buttonRef.current;
    if (!target) return;
    target.style.setProperty('--look-x', '0');
    target.style.setProperty('--look-y', '0');
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      wake('curious');
      return;
    }

    // Dirty screen: clicking takes the cloth (or hands it back). The robot never cleans it.
    if (isMessy()) {
      if (isHoldingCloth()) dropCloth();
      else if (event.detail === 0) showBubbleMessage('Grab the cloth with your mouse or finger!', 2600);
      else takeCloth({ x: event.clientX, y: event.clientY });
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
            <g className="alien-mascot__cloth">
              <path
                className="alien-mascot__cloth-body"
                d="M104 89 C109 86 118 85 124 86 C126 91 126 97 125 103 C118 105 111 105 104 103 C103 98 103 93 104 89 Z"
              />
              <path className="alien-mascot__cloth-fold" d="M105 93 C111 95 118 95 124 92" />
            </g>
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
