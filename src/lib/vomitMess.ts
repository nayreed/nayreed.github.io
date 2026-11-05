// The robot's vomit, stuck to the "glass" of the screen.
//
// One full-screen canvas sits above the page (below the robot). Chunks that hit it become
// glossy splats with droplets, a few drip slowly down, and the visitor scrubs them off with a
// cloth that replaces the cursor: the first pass smears, the next one lifts it off. The mess
// is snapshotted to localStorage so a page refresh doesn't get rid of it (expires after 24h).
// Framework-free so it can live on top of whatever React has rendered.

type Point = { x: number; y: number };

type Listener = {
  onSettled?: () => void; // splats and drips have stopped moving
  onProgress?: (dirtLeft: number) => void; // 1 = as dirty as it started, 0 = clean
  onCleaned?: () => void;
  onClothChange?: (holding: boolean) => void;
};

type Drip = { x: number; y: number; width: number; length: number; maxLength: number; speed: number; color: string };

const STORAGE_KEY = 'nayreed-screen-mess';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const CLOTH_RADIUS = 22;
const CLEAN_ENOUGH = 0.08; // fraction of the starting dirt that counts as clean
const SPLAT_COLORS = ['#9bbf3a', '#b0c94f', '#8bb032', '#a9c45a'];
const SPLAT_DARK = '#5d7a1c';

const rand = (a: number, b: number) => a + Math.random() * (b - a);

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let sheen: HTMLCanvasElement | null = null;
let sheenCtx: CanvasRenderingContext2D | null = null;
let cloth: HTMLDivElement | null = null;
let dpr = 1;
let listener: Listener = {};
let active = false;
let settled = false;
let holding = false;
let initialDirt = 0;
let lastDirt = 1;
let refreshes = 0;
let splats: (Point & { r: number })[] = [];
let drips: Drip[] = [];
let dripFrame = 0;
let settleTimer = 0;
let sheenFrame = 0;
let measureTimer = 0;

// ---------------------------------------------------------------------------
// Canvas setup
// ---------------------------------------------------------------------------

const ensureCanvas = () => {
  if (canvas && ctx) return;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'screen-mess';
  sheen = document.createElement('canvas');
  sheen.setAttribute('aria-hidden', 'true');
  sheen.className = 'screen-mess screen-mess--sheen';
  document.body.append(canvas, sheen);
  ctx = canvas.getContext('2d');
  sheenCtx = sheen.getContext('2d');
  sizeCanvases(false);
  window.addEventListener('resize', () => sizeCanvases(true));
  window.addEventListener('pagehide', save);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('pointermove', moveCloth, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && holding) dropCloth();
  });
};

// Keep the stains where they were on the glass when the window changes size.
const sizeCanvases = (keep: boolean) => {
  if (!canvas || !ctx || !sheen || !sheenCtx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  let copy: HTMLCanvasElement | null = null;
  if (keep && canvas.width && canvas.height) {
    copy = document.createElement('canvas');
    copy.width = canvas.width;
    copy.height = canvas.height;
    copy.getContext('2d')?.drawImage(canvas, 0, 0);
  }
  for (const c of [canvas, sheen]) {
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  sheenCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (copy) ctx.drawImage(copy, 0, 0, w, h);
};

// ---------------------------------------------------------------------------
// Splats and drips
// ---------------------------------------------------------------------------

const drawSplat = (x: number, y: number, r: number, color: string) => {
  if (!ctx) return;
  const c = ctx;
  // Irregular blob: a ring of points with uneven radii and the odd spike.
  const lobes = Math.round(rand(9, 14));
  const offset = rand(0, Math.PI * 2);
  c.beginPath();
  for (let i = 0; i <= lobes; i++) {
    const a = offset + (i / lobes) * Math.PI * 2;
    const reach = r * (Math.random() < 0.18 ? rand(1.15, 1.45) : rand(0.78, 1.05));
    const px = x + Math.cos(a) * reach;
    const py = y + Math.sin(a) * reach;
    if (i === 0) c.moveTo(px, py);
    else {
      const mid = offset + ((i - 0.5) / lobes) * Math.PI * 2;
      const inner = r * rand(0.7, 0.95);
      c.quadraticCurveTo(x + Math.cos(mid) * inner, y + Math.sin(mid) * inner, px, py);
    }
  }
  c.closePath();
  c.globalAlpha = 0.9;
  c.fillStyle = color;
  c.fill();
  c.globalAlpha = 0.35;
  c.strokeStyle = SPLAT_DARK;
  c.lineWidth = 1.4;
  c.stroke();

  // Chunky pixel bits inside, in the robot's blocky style.
  c.globalAlpha = 0.55;
  c.fillStyle = SPLAT_DARK;
  const bits = Math.round(rand(2, 5));
  for (let i = 0; i < bits; i++) {
    const a = rand(0, Math.PI * 2);
    const d = rand(0, r * 0.55);
    const s = rand(1.6, Math.max(2, r * 0.22));
    c.fillRect(x + Math.cos(a) * d - s / 2, y + Math.sin(a) * d - s / 2, s, s);
  }

  // Glossy highlight so it reads as stuck to glass, not painted on the page.
  c.save();
  c.globalAlpha = 0.3;
  c.fillStyle = '#ffffff';
  c.translate(x - r * 0.3, y - r * 0.35);
  c.rotate(-0.5);
  c.beginPath();
  c.ellipse(0, 0, r * 0.38, r * 0.16, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();

  // Droplets flung around the impact.
  const drops = Math.round(rand(3, 7));
  for (let i = 0; i < drops; i++) {
    const a = rand(0, Math.PI * 2);
    const d = r * rand(1.35, 2.4);
    const dr = Math.max(0.9, r * rand(0.07, 0.2));
    c.globalAlpha = 0.85;
    c.fillStyle = color;
    c.beginPath();
    c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, dr, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
};

const runDrips = () => {
  if (dripFrame) return;
  let last = performance.now();
  const step = (now: number) => {
    const dt = Math.min(40, now - last);
    last = now;
    if (!ctx) return;
    let moving = 0;
    for (const d of drips) {
      if (d.speed <= 0) continue;
      const from = d.length;
      d.length = Math.min(d.maxLength, d.length + d.speed * dt);
      d.speed *= 0.982; // runny at first, then it slows and stops (about 2 s)
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = d.color;
      ctx.lineCap = 'round';
      ctx.lineWidth = d.width;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y + from);
      ctx.lineTo(d.x, d.y + d.length);
      ctx.stroke();
      if (d.length >= d.maxLength || d.speed < 0.006) {
        d.speed = 0;
        ctx.fillStyle = d.color; // a bead where it stopped
        ctx.beginPath();
        ctx.arc(d.x, d.y + d.length, d.width * 0.75, 0, Math.PI * 2);
        ctx.fill();
      } else moving++;
    }
    ctx.globalAlpha = 1;
    if (moving) dripFrame = requestAnimationFrame(step);
    else {
      dripFrame = 0;
      drips = drips.filter((d) => d.speed > 0);
    }
  };
  dripFrame = requestAnimationFrame(step);
};

/** A chunk hits the glass at (x, y) in screen coordinates. */
export const splat = (x: number, y: number, size: number) => {
  if (x < -20 || y < -20 || x > window.innerWidth + 20 || y > window.innerHeight + 20) return;
  ensureCanvas();
  active = true;
  settled = false;
  const r = size;
  const color = SPLAT_COLORS[Math.floor(Math.random() * SPLAT_COLORS.length)];
  drawSplat(x, y, r, color);
  splats.push({ x, y, r });
  if (r > 7 && Math.random() < 0.3) {
    drips.push({
      x: x + rand(-r * 0.4, r * 0.4),
      y: y + r * 0.6,
      width: Math.max(2, r * rand(0.25, 0.4)),
      length: 0,
      maxLength: rand(18, 80),
      speed: rand(0.03, 0.07),
      color,
    });
    runDrips();
  }
  // Consider it settled once nothing new has landed for a while and drips have stopped.
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(function waitForDrips() {
    if (dripFrame) {
      settleTimer = window.setTimeout(waitForDrips, 300);
      return;
    }
    settled = true;
    initialDirt = measure();
    lastDirt = 1;
    save();
    listener.onSettled?.();
  }, 900);
};

// ---------------------------------------------------------------------------
// Measuring how dirty the screen is
// ---------------------------------------------------------------------------

let sampler: HTMLCanvasElement | null = null;

const measure = () => {
  if (!canvas) return 0;
  sampler ??= document.createElement('canvas');
  sampler.width = 96;
  sampler.height = 60;
  const s = sampler.getContext('2d', { willReadFrequently: true });
  if (!s) return 0;
  s.clearRect(0, 0, 96, 60);
  s.drawImage(canvas, 0, 0, 96, 60);
  const data = s.getImageData(0, 0, 96, 60).data;
  let dirty = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 60) dirty++; // ignore faint haze
  return dirty;
};

const checkProgress = () => {
  if (!settled || !initialDirt) return;
  const left = measure() / initialDirt;
  lastDirt = left;
  setClothDirt(1 - left);
  listener.onProgress?.(left);
  if (left <= CLEAN_ENOUGH) finish();
};

// ---------------------------------------------------------------------------
// Wiping
// ---------------------------------------------------------------------------

/** Rub from (x0, y0) to (x1, y1): the cloth soaks up part of the mess under it each pass. */
export const wipe = (x0: number, y0: number, x1: number, y1: number, radius = CLOTH_RADIUS) => {
  if (!ctx || !canvas || !active) return;
  const c = ctx;
  const r = radius;
  // Soak up: soft-edged, partial lift along the stroke (uneven edges leave natural streaks).
  c.save();
  c.globalCompositeOperation = 'destination-out';
  const distance = Math.hypot(x1 - x0, y1 - y0);
  const steps = Math.max(1, Math.ceil(distance / (r / 3)));
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    const y = y0 + ((y1 - y0) * i) / steps;
    const g = c.createRadialGradient(x, y, r * 0.15, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,0.32)'); // a little per pass: it takes real rubbing
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
  drawSheen(x0, y0, x1, y1, r);
  window.clearTimeout(measureTimer);
  measureTimer = window.setTimeout(checkProgress, 120);
};

// A brief wet streak where the cloth passed, which dries off. Recent strokes are redrawn each
// frame with fading strength, so the sheen disappears completely (no leftover haze).
const SHEEN_MS = 500;
let sheenStrokes: { x0: number; y0: number; x1: number; y1: number; r: number; t: number }[] = [];

const drawSheen = (x0: number, y0: number, x1: number, y1: number, r: number) => {
  sheenStrokes.push({ x0, y0, x1, y1, r, t: performance.now() });
  if (sheenFrame) return;
  const dry = (now: number) => {
    if (!sheenCtx || !sheen) return;
    sheenCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    sheenStrokes = sheenStrokes.filter((s) => now - s.t < SHEEN_MS);
    sheenCtx.strokeStyle = '#ffffff';
    sheenCtx.lineCap = 'round';
    for (const s of sheenStrokes) {
      sheenCtx.globalAlpha = 0.06 * (1 - (now - s.t) / SHEEN_MS);
      sheenCtx.lineWidth = s.r * 1.4;
      sheenCtx.beginPath();
      sheenCtx.moveTo(s.x0, s.y0);
      sheenCtx.lineTo(s.x1, s.y1);
      sheenCtx.stroke();
    }
    sheenCtx.globalAlpha = 1;
    sheenFrame = sheenStrokes.length ? requestAnimationFrame(dry) : 0;
  };
  sheenFrame = requestAnimationFrame(dry);
};

// ---------------------------------------------------------------------------
// The cloth (replaces the cursor while held)
// ---------------------------------------------------------------------------

// A soft white cloth with fold shading and a stitched hem. The stains it picks up appear
// in three stages as the screen gets cleaner.
const CLOTH_SVG = `
<svg viewBox="0 0 48 40" width="48" height="40" aria-hidden="true">
  <path d="M6 9 C14 5 30 4 41 6 C43 14 44 24 42 33 C30 36 17 36 5 33 C4 25 4 16 6 9 Z"
        fill="#fbfbf9" stroke="#9fa5ad" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M8 12 C18 16 30 15 40 11 L40 15 C30 19 18 20 8 16 Z" fill="#ebece8"/>
  <path d="M7 26 C18 24 31 26 41 24" stroke="#dfe0dc" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M9 11 C16 8 30 7 38 9 C40 16 40 24 39 30 C29 32 18 32 8 30 C7 23 7 17 9 11 Z"
        stroke="#c5c9ce" stroke-width="1" stroke-dasharray="2 2" fill="none"/>
  <g class="cloth-dirt" data-stage="1" opacity="0">
    <path d="M14 21 c3-3 8-2 9 1 c1 4-4 6-8 5 c-3-1-3-4-1-6z" fill="#9bbf3a" opacity="0.85"/>
  </g>
  <g class="cloth-dirt" data-stage="2" opacity="0">
    <path d="M27 13 c2-2 6-1 6 2 c0 3-4 4-6 2 c-1-1-1-3 0-4z" fill="#8bb032" opacity="0.85"/>
    <rect x="20" y="26" width="3" height="3" fill="#5d7a1c"/>
  </g>
  <g class="cloth-dirt" data-stage="3" opacity="0">
    <path d="M28 24 c2-2 7-1 7 2 c0 3-5 4-7 2z" fill="#a9c45a" opacity="0.9"/>
    <path d="M10 14 c2-1 4 0 4 2 c-1 2-3 2-4 1z" fill="#9bbf3a" opacity="0.8"/>
    <rect x="33" y="19" width="2.5" height="2.5" fill="#5d7a1c"/>
  </g>
</svg>`;

const setClothDirt = (amount: number) => {
  if (!cloth) return;
  cloth.querySelectorAll<SVGGElement>('.cloth-dirt').forEach((group) => {
    const stage = Number(group.dataset.stage);
    const start = [0, 0.05, 0.35, 0.65][stage];
    group.setAttribute('opacity', Math.max(0, Math.min(1, (amount - start) * 4)).toFixed(2));
  });
};

// The cloth trails the pointer a touch (it has some weight), squashes when pressed, drags at
// an angle when moved fast, and the wiping happens wherever the cloth actually is.
let pointerX = -100;
let pointerY = -100;
let clothX = -100;
let clothY = -100;
let clothAngle = -10;
let clothSkew = 0;
let pressing = false;
let clothFrame = 0;
let clothLast = 0;

const runCloth = () => {
  if (clothFrame) return;
  clothLast = performance.now();
  const step = (now: number) => {
    if (!holding || !cloth) {
      clothFrame = 0;
      return;
    }
    const dt = Math.min(40, Math.max(1, now - clothLast));
    clothLast = now;
    const ease = 1 - Math.exp(-dt / (pressing ? 45 : 28)); // heavier while pressed into the glass
    const nx = clothX + (pointerX - clothX) * ease;
    const ny = clothY + (pointerY - clothY) * ease;
    const vx = (nx - clothX) / dt;
    if (pressing) wipe(clothX, clothY, nx, ny);
    clothX = nx;
    clothY = ny;
    clothAngle += (-10 + Math.max(-24, Math.min(24, vx * 22)) - clothAngle) * Math.min(1, dt / 70);
    clothSkew += (Math.max(-14, Math.min(14, -vx * 10)) - clothSkew) * Math.min(1, dt / 60);
    const sx = pressing ? 1.05 : 1;
    const sy = pressing ? 0.9 : 1;
    cloth.style.transform = `translate(${(clothX - 24).toFixed(1)}px, ${(clothY - 20).toFixed(1)}px) rotate(${clothAngle.toFixed(1)}deg) skewX(${clothSkew.toFixed(1)}deg) scale(${sx}, ${sy})`;
    clothFrame = requestAnimationFrame(step);
  };
  clothFrame = requestAnimationFrame(step);
};

const moveCloth = (event: PointerEvent) => {
  if (!holding) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
};

const onPointerDown = (event: PointerEvent) => {
  if (!holding || !canvas) return;
  pressing = true;
  pointerX = event.clientX;
  pointerY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
};

const onPointerUp = (event: PointerEvent) => {
  if (!pressing) return;
  pressing = false;
  if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  save();
};

export const takeCloth = (at?: Point) => {
  if (!active || holding) return;
  ensureCanvas();
  holding = true;
  if (!cloth) {
    cloth = document.createElement('div');
    cloth.className = 'screen-mess-cloth';
    cloth.setAttribute('aria-hidden', 'true');
    cloth.innerHTML = CLOTH_SVG;
    document.body.appendChild(cloth);
  }
  if (at) {
    clothX = pointerX = at.x;
    clothY = pointerY = at.y;
  }
  setClothDirt(1 - lastDirt);
  cloth.style.display = 'block';
  runCloth();
  document.documentElement.classList.add('cloth-mode');
  listener.onClothChange?.(true);
};

export const dropCloth = () => {
  if (!holding) return;
  holding = false;
  pressing = false;
  if (cloth) cloth.style.display = 'none';
  document.documentElement.classList.remove('cloth-mode');
  listener.onClothChange?.(false);
};

// ---------------------------------------------------------------------------
// Finishing, persistence, queries
// ---------------------------------------------------------------------------

/** Fade whatever is left, run a shine across the glass, and forget the mess. */
export const finish = () => {
  if (!active || !canvas) return;
  active = false;
  settled = false;
  dropCloth();
  const c = canvas;
  c.style.transition = 'opacity 500ms ease';
  c.style.opacity = '0';
  window.setTimeout(() => {
    ctx?.clearRect(0, 0, c.width, c.height);
    c.style.transition = '';
    c.style.opacity = '';
  }, 520);
  const shine = document.createElement('div');
  shine.className = 'screen-mess-shine';
  shine.setAttribute('aria-hidden', 'true');
  document.body.appendChild(shine);
  window.setTimeout(() => shine.remove(), 900);
  splats = [];
  drips = [];
  refreshes = 0;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  listener.onCleaned?.();
};

function save() {
  if (!active || !settled || !canvas) return;
  try {
    const small = document.createElement('canvas');
    small.width = Math.max(1, Math.round(window.innerWidth / 2));
    small.height = Math.max(1, Math.round(window.innerHeight / 2));
    small.getContext('2d')?.drawImage(canvas, 0, 0, small.width, small.height);
    const image = small.toDataURL('image/webp', 0.8);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ image, savedAt: Date.now(), refreshes, splats: splats.slice(0, 40) })
    );
  } catch {
    // storage full or blocked: the mess just won't survive a reload
  }
}

/**
 * Bring back a mess saved before a reload. Resolves to how many times the visitor has
 * refreshed with a dirty screen (1 = first time), or 0 if there was nothing to restore.
 */
export const restore = (): Promise<number> =>
  new Promise((resolve) => {
    let saved: { image: string; savedAt: number; refreshes?: number; splats?: (Point & { r: number })[] } | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      saved = raw ? JSON.parse(raw) : null;
    } catch {
      saved = null;
    }
    if (!saved?.image || Date.now() - saved.savedAt > MAX_AGE_MS) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      resolve(0);
      return;
    }
    const image = new Image();
    image.onload = () => {
      ensureCanvas();
      ctx?.drawImage(image, 0, 0, window.innerWidth, window.innerHeight);
      active = true;
      settled = true;
      splats = saved?.splats ?? [];
      initialDirt = measure();
      refreshes = (saved?.refreshes ?? 0) + 1;
      save();
      resolve(refreshes);
    };
    image.onerror = () => resolve(0);
    image.src = saved.image;
  });

export const setMessListener = (next: Listener) => {
  listener = next;
};

export const isMessy = () => active;
export const isHoldingCloth = () => holding;
export const dirtLeft = () => lastDirt;

/** Where the stains are, biggest first (screen coordinates). */
export const stainSpots = (): Point[] =>
  [...splats].sort((a, b) => b.r - a.r).map(({ x, y }) => ({ x, y }));
