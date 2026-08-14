import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Device glyphs — particles placed along line/circle primitives      */
/* ------------------------------------------------------------------ */

function line(cx, cy, x1, y1, x2, y2, step) {
  const pts = [];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const n = Math.max(2, Math.round(len / step));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([cx + x1 + dx * t, cy + y1 + dy * t]);
  }
  return pts;
}

function rect(cx, cy, w, h, step) {
  const hw = w / 2;
  const hh = h / 2;
  return [
    ...line(cx, cy, -hw, -hh, hw, -hh, step),
    ...line(cx, cy, hw, -hh, hw, hh, step),
    ...line(cx, cy, hw, hh, -hw, hh, step),
    ...line(cx, cy, -hw, hh, -hw, -hh, step),
  ];
}

function arc(cx, cy, r, step, from = 0, to = Math.PI * 2) {
  const pts = [];
  const span = to - from;
  const n = Math.max(8, Math.round((r * span) / step));
  for (let i = 0; i <= n; i++) {
    const a = from + (i / n) * span;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

// Each device is a list of [x, y] outline points, built in its own space.
function devicePoints(device, step) {
  switch (device) {
    case 'phone':
      return [
        ...rect(0, 0, 11, 20, step),
        ...line(0, 0, -6.5, 6.5, 6.5, 6.5, step),
        ...line(0, 0, -3, -7.5, 3, -7.5, step),
      ];
    case 'laptop':
      return [
        ...rect(0, -1, 22, 13, step),
        ...line(0, 5.5, -11, 5.5, 11, 5.5, step),
        ...line(0, 8.5, -7, 8.5, 7, 8.5, step),
      ];
    case 'headphones':
      return [
        ...arc(0, 0, 9, step, 0, Math.PI), // band (top half)
        ...rect(-9, 0, 3.5, 7, step), // left cup
        ...rect(9, 0, 3.5, 7, step), // right cup
        ...line(0, 0, -6, 3, 6, 3, step), // headband accent
      ];
    case 'battery':
      return [
        ...rect(0, 0, 9, 17, step),
        ...line(0, 0, -4.5, -8.5, 4.5, -8.5, step),
        ...line(0, 0, -2.5, -2, 2.5, 4, step),
        ...line(0, 0, 0, 4, 0, 7, step),
      ];
    case 'monitor':
      return [
        ...rect(0, -1, 20, 12, step),
        ...line(0, 5, 0, 9, step),
        ...line(0, 9, -4, 9, 4, 9, step),
      ];
    case 'tablet':
      return [
        ...rect(0, 0, 13, 17, step),
        ...arc(0, 7, 1.4, step), // home button
        ...line(0, 0, -4.5, -4, 4.5, 4, step), // screen accent
      ];
    default:
      return [];
  }
}

const DEVICES = ['phone', 'laptop', 'headphones', 'battery', 'monitor', 'tablet'];
// 3 columns × 2 rows
const GRID_X = [-72, 0, 72];
const GRID_Y = [-30, 30];

// Brand colors (0..1)
const GREEN_A = [0.36, 0.8, 0.58]; // eco-300
const GREEN_B = [0.22, 0.62, 0.47]; // deeper eco
const GOLD = [0.88, 0.65, 0.15]; // gold-500

function buildFormation(step) {
  const formation = []; // [x, y, z] per particle
  const phases = []; // idle-bob phase per particle
  const baseColors = []; // [r, g, b] per particle
  let idx = 0;
  DEVICES.forEach((device, d) => {
    const col = d % 3;
    const row = Math.floor(d / 3);
    const pts = devicePoints(device, step);
    for (const [px, py] of pts) {
      // jitter for a soft "constellation" feel
      const jx = (Math.random() - 0.5) * 0.9;
      const jy = (Math.random() - 0.5) * 0.9;
      formation.push([GRID_X[col] + px + jx, GRID_Y[row] + py + jy, 0]);
      phases.push((idx * 1.618) % (Math.PI * 2));
      const mix = Math.random();
      baseColors.push([
        GREEN_A[0] + (GREEN_B[0] - GREEN_A[0]) * mix,
        GREEN_A[1] + (GREEN_B[1] - GREEN_A[1]) * mix,
        GREEN_A[2] + (GREEN_B[2] - GREEN_A[2]) * mix,
      ]);
      idx++;
    }
  });
  return { formation, phases, baseColors };
}

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* ------------------------------------------------------------------ */
/*  Scene setup                                                        */
/* ------------------------------------------------------------------ */

function createScene(container) {
  const width = container.clientWidth || 640;
  const height = container.clientHeight || 256;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0); // transparent — composite over the aurora
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
  camera.position.set(0, 0, 300);
  camera.lookAt(0, 0, 0);

  const { formation, phases, baseColors } = buildFormation(1.05);
  const N = formation.length;

  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const glowTex = makeGlowTexture();
  const material = new THREE.PointsMaterial({
    size: 4.4,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Recovery core — a gold glow sprite that grows as the stream converges
  const coreMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: 0xe0a527,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const core = new THREE.Sprite(coreMat);
  core.position.set(0, 78, -20);
  core.scale.set(90, 90, 1);
  scene.add(core);

  // Seed the position/color buffers so the FIRST frame renders the formation
  // (never leave particles at the origin, even before the first rAF tick).
  for (let i = 0; i < N; i++) {
    positions[i * 3] = formation[i][0];
    positions[i * 3 + 1] = formation[i][1];
    positions[i * 3 + 2] = formation[i][2];
    colors[i * 3] = baseColors[i][0];
    colors[i * 3 + 1] = baseColors[i][1];
    colors[i * 3 + 2] = baseColors[i][2];
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;

  // progressTarget is written by onScroll() right after createScene returns,
  // but frame(0) runs synchronously INSIDE createScene — so default it to 0
  // or the first frame computes (undefined - 0) = NaN and wipes the seeded
  // formation buffer, rendering nothing forever.
  const state = { progress: 0, progressTarget: 0, time: 0, running: false, raf: 0 };

  // One frame of the animation. `p` is the eased scroll progress (0..1).
  function frame(dt) {
    state.time += dt;
    // Ease toward the target so the dissolve is smooth
    state.progress += (state.progressTarget - state.progress) * 0.07;

    const p = Math.pow(Math.min(1, Math.max(0, state.progress)), 1.12);
    const bob = Math.sin(state.time * 1.6) * 1.4; // idle float

    for (let i = 0; i < N; i++) {
      const fx = formation[i][0];
      const fy = formation[i][1];

      // Stream target at full dissolve: particles rise along a funnel
      // that tightens into the recovery core, spiraling with time.
      const tH = i / N;
      const ang = i * 2.399963 + state.time * 0.9; // golden-angle swirl
      const radius = (1 - tH) * 58;
      const sx = Math.cos(ang) * radius;
      const sy = 30 + tH * 88;
      const sz = Math.sin(ang) * radius * 0.42;

      const e = p; // per-particle dissolve amount
      positions[i * 3] = fx * (1 - e) + sx * e;
      positions[i * 3 + 1] = (fy + bob * 0.5 + Math.sin(state.time * 1.2 + phases[i]) * 1.6) * (1 - e) + sy * e;
      positions[i * 3 + 2] = formation[i][2] * (1 - e) + sz * e;

      // Green devices → gold value as they're recovered
      const b = baseColors[i];
      colors[i * 3] = b[0] + (GOLD[0] - b[0]) * e;
      colors[i * 3 + 1] = b[1] + (GOLD[1] - b[1]) * e;
      colors[i * 3 + 2] = b[2] + (GOLD[2] - b[2]) * e;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    // Core breathes in as recovery completes
    const pulse = Math.sin(state.time * 3.2) * 10 * p;
    core.scale.set(90 + 70 * p + pulse, 90 + 70 * p + pulse, 1);
    coreMat.opacity = p * 0.85;

    renderer.render(scene, camera);
  }

  // Draw the first frame synchronously (no rAF wait) so the formation is
  // visible the moment the chunk lands — and verifiable in any environment.
  frame(0);

  function loop(t) {
    if (!state.running) return;
    const dt = Math.min(0.05, (t - (state.lastT || t)) / 1000);
    state.lastT = t;
    frame(dt);
    state.raf = requestAnimationFrame(loop);
  }

  function start() {
    if (state.running) return;
    state.running = true;
    state.lastT = performance.now();
    state.raf = requestAnimationFrame(loop);
  }

  function stop() {
    state.running = false;
    cancelAnimationFrame(state.raf);
  }

  return {
    renderer,
    geometry,
    material,
    glowTex,
    coreMat,
    core,
    scene,
    camera,
    points,
    state,
    frame,
    start,
    stop,
  };
}

/* ------------------------------------------------------------------ */
/*  Component — mounts the scene with guards, wires scroll + visibility */
/* ------------------------------------------------------------------ */

export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // Reduced motion: leave the slot empty — the static aurora shows through.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    // WebGL2 probe on a SCRATCH canvas — never the real one, or three.js's
    // `getContext('webgl2')` call on our canvas would fail after we created
    // a webgl1 context on it.
    let probe = null;
    try {
      probe = document.createElement('canvas');
      if (!probe.getContext('webgl2')) return undefined; // silently degrade
    } finally {
      probe = null;
    }

    let handle;
    try {
      handle = createScene(container);
    } catch {
      return undefined; // any renderer failure → empty slot, never crash the page
    }

    const { renderer, state, start, stop } = handle;

    // Scroll progress: 0 while the container is at/below the viewport top,
    // 1 once it has fully scrolled past. Mirrors the hero's parallax math.
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const h = rect.height || 1;
      state.progressTarget = Math.min(1, Math.max(0, -rect.top / h));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Only render while near the viewport
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '240px' }
    );
    io.observe(container);

    // Keep the canvas sized to its box
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 256;
      renderer.setSize(w, h);
      handle.camera.aspect = w / h;
      handle.camera.updateProjectionMatrix();
    });
    ro.observe(container);

    // Test hook for live verification / debugging
    window.__heroScene = {
      get progress() {
        return state.progressTarget;
      },
      set progress(v) {
        state.progressTarget = v;
      },
      render: () => handle.frame(0),
      particleCount: () => handle.geometry.attributes.position.count,
      _dbg: {
        scene: handle.scene,
        camera: handle.camera,
        renderer: handle.renderer,
        points: handle.points,
        state,
      },
    };

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      io.disconnect();
      ro.disconnect();
      stop();
      delete window.__heroScene;
      // Dispose GPU resources so StrictMode remounts are safe
      handle.geometry.dispose();
      handle.material.dispose();
      handle.glowTex.dispose();
      handle.coreMat.dispose();
      handle.renderer.dispose();
      if (handle.renderer.domElement.parentNode === container) {
        container.removeChild(handle.renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative mx-auto mt-12 h-56 md:h-64 w-full max-w-3xl"
    />
  );
}
