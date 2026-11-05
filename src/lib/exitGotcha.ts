// "exit" easter egg: the whole site switches off like an old CRT monitor,
// stays dark for a moment, shouts GOTCHA!!!, then comes back as if nothing happened.
// Plain DOM + Web Animations API, so it works on top of whatever React has rendered.

let running = false;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function playExitGotcha(): Promise<void> {
  const root = document.getElementById('root');
  if (running || !root) return;
  running = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = document.documentElement;
  const saved = {
    overflow: html.style.overflow,
    position: root.style.position,
    zIndex: root.style.zIndex,
    transformOrigin: root.style.transformOrigin,
    visibility: root.style.visibility,
  };

  // Black backdrop behind the page, so the collapsing page shrinks onto a dark screen.
  const backdrop = document.createElement('div');
  backdrop.setAttribute('aria-hidden', 'true');
  Object.assign(backdrop.style, {
    position: 'fixed',
    inset: '0',
    background: '#000',
    zIndex: '9998',
  });

  // Glowing horizontal line the screen collapses into (theme-independent).
  const line = document.createElement('div');
  line.setAttribute('aria-hidden', 'true');
  Object.assign(line.style, {
    position: 'fixed',
    left: '0',
    right: '0',
    top: '50%',
    height: '3px',
    marginTop: '-1.5px',
    background: '#fffdf7',
    boxShadow: '0 0 14px 4px rgba(255, 253, 247, 0.65)',
    zIndex: '10000',
    opacity: '0',
    pointerEvents: 'none',
  });

  // The GOTCHA text sits above everything.
  const text = document.createElement('div');
  text.setAttribute('role', 'status');
  text.textContent = 'GOTCHA!!!';
  text.className = 'font-display font-black';
  Object.assign(text.style, {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 'clamp(3.5rem, 16vw, 13rem)',
    lineHeight: '1',
    color: '#f3efe6',
    zIndex: '10000',
    opacity: '0',
    pointerEvents: 'none',
  });

  try {
    html.style.overflow = 'hidden';
    document.body.append(backdrop, line, text);
    // Lift the page above the backdrop and collapse it around the middle of the visible screen.
    root.style.position = 'relative';
    root.style.zIndex = '9999';
    root.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;

    if (reduceMotion) {
      root.style.visibility = 'hidden';
    } else {
      const easeIn = 'cubic-bezier(0.55, 0, 1, 0.45)';
      // 1) the page squeezes vertically while a bright line glows up in the middle
      await Promise.all([
        root.animate([{ transform: 'scale(1, 1)' }, { transform: 'scale(1, 0.006)' }], {
          duration: 320,
          easing: easeIn,
          fill: 'forwards',
        }).finished,
        line.animate([{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1 }], {
          duration: 320,
          fill: 'forwards',
        }).finished,
      ]);
      root.style.visibility = 'hidden';
      root.getAnimations().forEach((a) => a.cancel());
      // 2) the line shrinks sideways to a dot, then the dot fades out
      await line.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0.004)' }], {
        duration: 220,
        easing: easeIn,
        fill: 'forwards',
      }).finished;
      await line.animate(
        [
          { transform: 'scaleX(0.004)', opacity: 1 },
          { transform: 'scaleX(0.004)', opacity: 0 },
        ],
        { duration: 160, fill: 'forwards' }
      ).finished;
    }

    // 3) a moment of darkness
    await wait(reduceMotion ? 400 : 700);

    // 4) GOTCHA!!! pops in and holds
    await text.animate(
      reduceMotion
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: 'scale(0.6)' },
            { opacity: 1, transform: 'scale(1.06)', offset: 0.7 },
            { opacity: 1, transform: 'scale(1)' },
          ],
      { duration: 260, easing: 'ease-out', fill: 'forwards' }
    ).finished;
    await wait(1200);

    // 5) the site fades back in while the joke fades out
    root.style.visibility = saved.visibility;
    root.style.zIndex = saved.zIndex;
    root.style.position = saved.position;
    const fadeOut = { duration: 500, easing: 'ease-in-out', fill: 'forwards' as const };
    await Promise.all([
      text.animate(
        reduceMotion
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [
              { opacity: 1, transform: 'scale(1)' },
              { opacity: 0, transform: 'scale(1.08)' },
            ],
        fadeOut
      ).finished,
      backdrop.animate([{ opacity: 1 }, { opacity: 0 }], fadeOut).finished,
    ]);
  } finally {
    backdrop.remove();
    line.remove();
    text.remove();
    root.getAnimations().forEach((a) => a.cancel());
    root.style.visibility = saved.visibility;
    root.style.zIndex = saved.zIndex;
    root.style.position = saved.position;
    root.style.transformOrigin = saved.transformOrigin;
    html.style.overflow = saved.overflow;
    running = false;
  }
}
