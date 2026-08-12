import { useEffect, useRef, useState } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.06;
  // Gentle drift toward the cursor
  p += (u_mouse - 0.5) * 0.18;

  float n = fbm(p * 2.1 + vec2(t * 0.55, -t * 0.32));
  float n2 = fbm(p * 3.6 - vec2(t * 0.45, t * 0.28) + n * 1.9);
  float n3 = fbm(p * 6.2 + vec2(-t * 0.6, t * 0.45) + n2 * 1.6);

  vec3 base       = vec3(0.035, 0.055, 0.047);
  vec3 forestDeep = vec3(0.118, 0.251, 0.200);
  vec3 forest     = vec3(0.180, 0.365, 0.275);
  vec3 gold       = vec3(0.878, 0.647, 0.153);
  vec3 paleGold   = vec3(0.949, 0.804, 0.467);

  vec3 col = base;
  col = mix(col, forestDeep, smoothstep(0.30, 0.72, n));
  col = mix(col, forest, smoothstep(0.48, 0.85, n2));
  // Gold veins — the "recovered value" story
  float goldMask = smoothstep(0.60, 0.95, n3);
  col = mix(col, gold, goldMask * 0.75);
  col = mix(col, paleGold, goldMask * smoothstep(0.82, 0.98, n3) * 0.35);

  // Soft glow rising from the lower-center (behind the headline)
  float centerGlow = smoothstep(1.35, 0.0, length((uv - vec2(0.5, 0.40)) * vec2(1.15, 1.35)));
  col += forest * centerGlow * 0.14;
  col += gold * centerGlow * 0.05 * (0.6 + 0.4 * sin(t * 1.4));

  // Vignette keeps the edges deep and the text contrast high
  float vig = smoothstep(1.55, 0.5, length((uv - 0.5) * vec2(1.05, 1.3)));
  col *= 0.55 + 0.45 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

function createProgram(gl) {
  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('HeroAurora shader error:', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };

  const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('HeroAurora program link error:', gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

/**
 * Dependency-free WebGL aurora backdrop in the botanical palette.
 * Gated behind an in-view check and skipped entirely for users who
 * prefer reduced motion (the parent renders a static gradient instead).
 */
export default function HeroAurora() {
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEnabled(true);
          io.disconnect();
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return; // WebGL unavailable — static gradient shows instead

    const program = createProgram(gl);
    if (!program) return;
    gl.useProgram(program);

    // Fullscreen triangle
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    let target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      target = {
        x: (e.clientX - rect.left) / Math.max(1, rect.width),
        y: (e.clientY - rect.top) / Math.max(1, rect.height),
      };
    };
    window.addEventListener('mousemove', onMove);

    const start = performance.now();
    let raf;
    const frame = (now) => {
      const t = (now - start) / 1000;
      // Smooth the cursor so the drift feels premium, not jittery
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, 1.0 - mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
