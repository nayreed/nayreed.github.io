import React, { useState } from 'react';

const moods = ['idle', 'excited', 'curious'] as const;
type Mood = (typeof moods)[number];

const InteractiveAlien = () => {
  const [moodIndex, setMoodIndex] = useState(0);
  const [look, setLook] = useState({ x: 0, y: 0 });

  const mood: Mood = moods[moodIndex];

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setLook({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  };

  const resetLook = () => setLook({ x: 0, y: 0 });

  return (
    <button
      type="button"
      aria-label="Interact with the alien mascot"
      className="alien-mascot fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-4 z-40 h-16 w-16 sm:bottom-[calc(env(safe-area-inset-bottom)+1.75rem)] sm:right-7 sm:h-[72px] sm:w-[72px]"
      data-mood={mood}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetLook}
      onBlur={resetLook}
      onClick={() => setMoodIndex((current) => (current + 1) % moods.length)}
      style={
        {
          '--look-x': look.x.toFixed(3),
          '--look-y': look.y.toFixed(3),
        } as React.CSSProperties
      }
    >
      <span className="alien-mascot__halo" aria-hidden="true" />
      <svg
        viewBox="0 0 128 128"
        aria-hidden="true"
        className="alien-mascot__svg"
      >
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
