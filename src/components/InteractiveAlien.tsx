import React, { useCallback, useEffect, useRef, useState } from 'react';

const moods = ['idle', 'happy', 'curious'] as const;
type Mood = (typeof moods)[number];
type PetMood = Mood | 'charged' | 'sleepy';

const comboMessages = [
  'Nayreed is a good boy',
  'Certified space booper',
  'Portfolio guardian online',
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeLook = (distance: number, range: number) =>
  clamp(Math.atan(distance / range) / (Math.PI / 2), -1, 1);

const InteractiveAlien = () => {
  const [moodIndex, setMoodIndex] = useState(0);
  const [overrideMood, setOverrideMood] = useState<PetMood | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [comboMessage, setComboMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [sparkKey, setSparkKey] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const wasDraggedRef = useRef(false);
  const comboTimerRef = useRef<number | null>(null);
  const comboIndexRef = useRef(0);
  const clickStreakRef = useRef(0);
  const clickStreakTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const mood: PetMood = overrideMood ?? moods[moodIndex];

  const showComboMessage = useCallback(() => {
    const nextMessage = comboMessages[comboIndexRef.current % comboMessages.length];
    comboIndexRef.current += 1;
    setComboMessage(nextMessage);
    if (comboTimerRef.current) {
      window.clearTimeout(comboTimerRef.current);
    }
    comboTimerRef.current = window.setTimeout(() => {
      setComboMessage('');
    }, 2400);
  }, []);

  const wake = useCallback((nextMood?: PetMood) => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    if (nextMood) {
      setOverrideMood(nextMood);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setOverrideMood('sleepy');
    }, 14000);
  }, []);

  useEffect(() => {
    wake();

    const updateLook = (clientX: number, clientY: number) => {
      const target = buttonRef.current;
      if (!target) return;

      const bounds = target.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const rangeX = Math.max(window.innerWidth * 0.34, bounds.width * 5);
      const rangeY = Math.max(window.innerHeight * 0.34, bounds.height * 5);
      const x = normalizeLook(clientX - centerX, rangeX);
      const y = normalizeLook(clientY - centerY, rangeY);

      target.style.setProperty('--look-x', x.toFixed(3));
      target.style.setProperty('--look-y', y.toFixed(3));
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateLook(event.clientX, event.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (comboTimerRef.current) {
        window.clearTimeout(comboTimerRef.current);
      }
      if (clickStreakTimerRef.current) {
        window.clearTimeout(clickStreakTimerRef.current);
      }
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [wake]);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      drag.moved = true;
      wasDraggedRef.current = true;
      setIsDragging(true);
    }

    const minX = -(window.innerWidth - bounds.width - 24);
    const minY = -(window.innerHeight - bounds.height - 24);
    setOffset({
      x: clamp(drag.originX + dx, minX, 0),
      y: clamp(drag.originY + dy, minY, 0),
    });
  };

  const resetLook = () => {
    const target = buttonRef.current;
    if (!target) return;
    target.style.setProperty('--look-x', '0');
    target.style.setProperty('--look-y', '0');
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
      moved: false,
    };
    setIsDragging(false);
    wake('curious');
  };

  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const handleClick = () => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      wake('curious');
      return;
    }

    const nextIndex = (moodIndex + 1) % moods.length;
    const nextMood = moods[nextIndex];
    setMoodIndex(nextIndex);
    setOverrideMood(null);
    wake(nextMood);

    clickStreakRef.current += 1;
    if (clickStreakTimerRef.current) {
      window.clearTimeout(clickStreakTimerRef.current);
    }
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
      style={
        {
          '--pet-x': `${offset.x}px`,
          '--pet-y': `${offset.y}px`,
        } as React.CSSProperties
      }
    >
      <span className="alien-mascot__secret" aria-live="polite" data-visible={Boolean(comboMessage)}>
        {comboMessage}
      </span>
      <span className="alien-mascot__nap" aria-hidden="true">
        zzzzz
      </span>
      <span className="alien-mascot__halo" aria-hidden="true" />
      <svg
        viewBox="0 0 128 128"
        aria-hidden="true"
        className="alien-mascot__svg"
      >
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

          <g className="alien-mascot__left-arm">
            <path className="alien-mascot__arm-line" d="M27 55 C18 55 11 62 11 73 C11 79 13 84 15 87" />
            <path className="alien-mascot__palm" d="M9 83c2-2 8-2 10 0l-1 6h-8z" />
          </g>
          <g className="alien-mascot__right-arm">
            <path className="alien-mascot__arm-line" d="M101 55 C110 55 117 62 117 73 C117 79 115 84 113 87" />
            <path className="alien-mascot__palm" d="M109 83c2-2 8-2 10 0l-1 6h-8z" />
          </g>

          <g className="alien-mascot__left-leg">
            <path d="M42 82h8v31H30v-8h12z" />
          </g>
          <g className="alien-mascot__right-leg">
            <path d="M78 82h8v23h12v8H78z" />
          </g>

          <path
            className="alien-mascot__shell"
            fillRule="evenodd"
            d="M24 28h80v54H24z M32 36v38h64V36z"
          />

          <g className="alien-mascot__eyes">
            <rect className="alien-mascot__eye" x="41" y="51" width="10" height="10" rx="2" />
            <rect className="alien-mascot__eye" x="77" y="51" width="10" height="10" rx="2" />
          </g>
          <path className="alien-mascot__mouth" d="M55 68h18" />

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
