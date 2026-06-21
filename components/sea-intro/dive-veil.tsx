"use client";

import { useEffect, useRef } from "react";

import { TIMELINE_TOTAL_MS } from "./mapbox-config";

// A short-lived water-surface pass that bridges the satellite globe and the
// underwater scene. It renders a single fullscreen quad: high cloud wisps part,
// a soft surface glare rises, caustics ramp, the surface breaks with a gentle
// refraction ripple, then everything settles into the deep-water tint while the
// ParticleField fades up beneath it.
//
// Lifecycle mirrors components/particle-field.tsx: dynamic three import, a
// try/catch WebGL guard (falls back to nothing visible, the CSS scrim carries
// the moment), and full disposal on unmount.

type ThreeModule = typeof import("three");

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Restrained on purpose: the glare is capped so it never flashes hard (constitution
// + photosensitivity), tones stay in the deep-water family.
const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uTime;
  uniform float uAspect;

  const vec3 TIDE = vec3(0.208, 0.420, 0.400);
  const vec3 SONAR = vec3(0.310, 0.702, 0.749);
  const vec3 DEEP = vec3(0.027, 0.063, 0.059);
  const vec3 PANEL = vec3(0.047, 0.102, 0.090);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv;
    p.x *= uAspect;
    vec2 center = vec2(0.5 * uAspect, 0.5);
    float dist = distance(p, center);
    float prog = clamp(uProgress, 0.0, 1.0);

    // Refraction ripple, peaking as the surface breaks (~0.55).
    float breakPhase = smoothstep(0.35, 0.7, prog) * (1.0 - smoothstep(0.7, 1.0, prog));
    float ripple = sin(dist * 42.0 - uTime * 4.0) * 0.5 + 0.5;
    vec2 refract = (p - center) * ripple * 0.015 * breakPhase;
    vec2 suv = uv + refract;

    // High cloud wisps drifting and parting in the first half.
    float clouds = fbm(suv * 3.0 + vec2(uTime * 0.04, uTime * 0.02));
    float cloudVeil = smoothstep(0.45, 0.9, clouds) * (1.0 - smoothstep(0.25, 0.6, prog));

    // Caustic light threads ramping toward the break.
    float caustic = fbm(suv * 7.0 - vec2(uTime * 0.12, uTime * 0.08));
    caustic = pow(caustic, 2.2);
    float causticAmt = caustic * smoothstep(0.2, 0.75, prog) * (1.0 - smoothstep(0.85, 1.0, prog));

    // Soft surface glare bloom, capped low so it never hard-flashes.
    float glare = (1.0 - smoothstep(0.0, 0.55, dist));
    float glareAmt = glare * breakPhase * 0.35;

    // Base colour travels from a tide-tinted surface haze down to the abyss.
    vec3 col = mix(PANEL, DEEP, smoothstep(0.4, 1.0, prog));
    col = mix(col, TIDE, cloudVeil * 0.5);
    col += SONAR * causticAmt * 0.25;
    col += vec3(0.55, 0.72, 0.70) * glareAmt; // muted, not white

    // Vignette toward the deep at the edges throughout.
    col = mix(col, DEEP, smoothstep(0.45, 1.1, dist) * 0.6);

    // Veil opacity: fade in quickly, hold through the break, end near-opaque as
    // the depths take over beneath us.
    float alphaIn = smoothstep(0.0, 0.12, prog);
    float alphaEnd = mix(0.78, 0.96, smoothstep(0.6, 1.0, prog));
    float alpha = alphaIn * alphaEnd;

    gl_FragColor = vec4(col, alpha);
  }
`;

function initVeil(THREE: ThreeModule, canvas: HTMLCanvasElement): () => void {
  let renderer: import("three").WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return () => {};
  }

  const sizeOf = () => ({
    w: canvas.clientWidth || window.innerWidth,
    h: canvas.clientHeight || window.innerHeight,
  });

  let { w, h } = sizeOf();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const uniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uAspect: { value: w / h },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(geometry, material);
  scene.add(quad);

  const start = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const elapsed = now - start;
    uniforms.uProgress.value = Math.min(elapsed / TIMELINE_TOTAL_MS, 1);
    uniforms.uTime.value = elapsed / 1000;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const onResize = () => {
    ({ w, h } = sizeOf());
    renderer.setSize(w, h, false);
    uniforms.uAspect.value = w / h;
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}

export function DiveVeil() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let cleanup = () => {};
    import("three").then((THREE) => {
      if (cancelled || !canvasRef.current) return;
      cleanup = initVeil(THREE, canvasRef.current);
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
