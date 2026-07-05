import React, { useCallback, useEffect, useRef, useState } from 'react';

const moods = ['idle', 'happy', 'curious'] as const;
type Mood = (typeof moods)[number];
type PetMood = Mood | 'charged' | 'sleepy';

const moodMessages: Record<PetMood, string> = {
  idle: 'hi',
  happy: 'boop',
  curious: 'hmm',
  charged: 'zap',
  sleepy: 'zzz',
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const InteractiveAlien = () => {
  const [moodIndex, setMoodIndex] = useState(0);
  const [overrideMood, setOverrideMood] = useState<PetMood | null>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('hi');
  const [energy, setEnergy] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [sparkKey, setSparkKey] = useState(0);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const wasDraggedRef = useRef(false);
  const messageTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const mood: PetMood = overrideMood ?? moods[moodIndex];

  const showMessage = useCallback((next: string) => {
    setMessage(next);
    if (messageTimerRef.current) {
      window.clearTimeout(messageTimerRef.current);
    }
    messageTimerRef.current = window.setTimeout(() => {
      setMessage('');
    }, 2400);
  }, []);

  const wake = useCallback((nextMood?: PetMood, nextMessage?: string) => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    if (nextMood) {
      setOverrideMood(nextMood);
    }
    if (nextMessage) {
      showMessage(nextMessage);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setOverrideMood('sleepy');
      showMessage(moodMessages.sleepy);
    }, 14000);
  }, [showMessage]);

  useEffect(() => {
    wake(undefined, moodMessages.idle);
    return () => {
      if (messageTimerRef.current) {
        window.clearTimeout(messageTimerRef.current);
      }
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [wake]);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setLook({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });

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

  const resetLook = () => setLook({ x: 0, y: 0 });

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
    wake('curious', '...');
  };

  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
    resetLook();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      wake('curious', 'parked');
      return;
    }
    if (event.detail > 1) return;

    const nextIndex = (moodIndex + 1) % moods.length;
    const nextMood = moods[nextIndex];
    setMoodIndex(nextIndex);
    setOverrideMood(null);
    setEnergy((current) => clamp(current + 1, 1, 4));
    wake(nextMood, moodMessages[nextMood]);
  };

  const handleDoubleClick = () => {
    setEnergy(4);
    setSparkKey((current) => current + 1);
    wake('charged', moodMessages.charged);
  };

  return (
    <button
      type="button"
      aria-label="Interact with the alien mascot"
      className="alien-mascot fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-4 z-40 h-16 w-16 sm:bottom-[calc(env(safe-area-inset-bottom)+1.75rem)] sm:right-7 sm:h-[72px] sm:w-[72px]"
      data-mood={mood}
      data-dragging={isDragging}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onPointerLeave={resetLook}
      onBlur={resetLook}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={
        {
          '--look-x': look.x.toFixed(3),
          '--look-y': look.y.toFixed(3),
          '--pet-x': `${offset.x}px`,
          '--pet-y': `${offset.y}px`,
        } as React.CSSProperties
      }
    >
      <span className="alien-mascot__bubble" aria-live="polite" data-visible={Boolean(message)}>
        {message}
      </span>
      <span className="alien-mascot__pips" aria-hidden="true">
        {[0, 1, 2, 3].map((pip) => (
          <span
            key={pip}
            className="alien-mascot__pip"
            data-active={pip < energy}
          />
        ))}
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
            <path d="M24 50H5v32h8V60h11z" />
          </g>
          <g className="alien-mascot__right-arm">
            <path d="M104 50h19v32h-8V60h-11z" />
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
