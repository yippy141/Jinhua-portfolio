"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

// Deep-sea atmosphere ported from design-source/particles.js to a client-only
// component. It sits BEHIND the Phase 2 graph as a decorative layer and never
// takes pointer events, so the graph, nav, and hero stay fully usable.
//
// Recolored to the constitution deep-water tokens (no index.html mint):
//   plankton  -> tide #356B66 .. sonar #4FB3BF
//   fog       -> deep-water background #07100F
//   currents  -> a muted deep tide
//
// Guards: no animation under prefers-reduced-motion (one static frame), and the
// loop pauses while the tab is hidden.

type ThreeModule = typeof import("three");

const PARTICLE_COUNT = 1000; // modest, stays smooth on an average laptop

function initParticles(
  THREE: ThreeModule,
  canvas: HTMLCanvasElement,
  options: { animate: boolean },
): () => void {
  let renderer: import("three").WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    // No WebGL context: leave the static CSS atmosphere in place.
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
  scene.fog = new THREE.FogExp2(0x07100f, 0.012); // deep-water background

  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 400);
  camera.position.set(0, 0, 60);

  // ── plankton particle field ──
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const phase = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 220;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 180 - 20;
    sizes[i] = Math.random() * 1.6 + 0.4;
    phase[i] = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));

  const vertex = `
    attribute float aSize;
    attribute float aPhase;
    uniform float uTime;
    varying float vAlpha;
    varying float vDepth;
    void main() {
      vec3 p = position;
      p.y += mod(uTime * 0.6 + aPhase * 4.0, 160.0) - 80.0;
      p.x += sin(uTime * 0.15 + aPhase) * 1.6;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * (220.0 / -mv.z);
      vAlpha = 0.45 + 0.55 * sin(uTime * 1.2 + aPhase * 2.0);
      vDepth = clamp(1.0 - (-mv.z / 180.0), 0.0, 1.0);
    }
  `;
  // tide #356B66 -> sonar #4FB3BF (constitution deep-water teals, no mint)
  const fragment = `
    varying float vAlpha;
    varying float vDepth;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      if (d > 0.5) discard;
      float core = smoothstep(0.5, 0.0, d);
      float halo = smoothstep(0.5, 0.15, d) * 0.35;
      vec3 col = mix(vec3(0.208, 0.420, 0.400), vec3(0.310, 0.702, 0.749), core);
      float a = (core + halo) * vAlpha * (0.35 + vDepth * 0.85);
      gl_FragColor = vec4(col, a);
    }
  `;
  const mat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ── faint deep currents ──
  const lineGeo = new THREE.BufferGeometry();
  const linePts: number[] = [];
  for (let i = 0; i < 14; i++) {
    const z = -60 - i * 8;
    const y = (Math.random() - 0.5) * 80;
    linePts.push(-200, y, z, 200, y + (Math.random() - 0.5) * 30, z);
  }
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x223f3a, // muted deep tide
    transparent: true,
    opacity: 0.2,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // ── parallax (gentle, follows the pointer) ──
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onPointerMove = (event: PointerEvent) => {
    target.x = (event.clientX / window.innerWidth - 0.5) * 2;
    target.y = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  const onResize = () => {
    const next = sizeOf();
    w = next.w;
    h = next.h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    if (!options.animate) renderer.render(scene, camera); // keep the static frame correct
  };

  const clock = new THREE.Clock();
  let elapsed = 0;
  let rafId = 0;

  const renderFrame = () => {
    mat.uniforms.uTime.value = elapsed;
    eased.x += (target.x - eased.x) * 0.04;
    eased.y += (target.y - eased.y) * 0.04;
    camera.position.x = eased.x * 5;
    camera.position.y = -eased.y * 3;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };

  // Returning to a visible tab: flush the accumulated time so nothing jumps.
  const onVisibility = () => {
    if (!document.hidden) clock.getDelta();
  };

  if (options.animate) {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      if (document.hidden) return; // guard 2: paused while the tab is hidden
      elapsed += dt;
      renderFrame();
    };
    tick();
  } else {
    // guard 1: reduced motion -> a single static frame, no loop.
    window.addEventListener("resize", onResize);
    renderFrame();
  }

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    geo.dispose();
    mat.dispose();
    lineGeo.dispose();
    lineMat.dispose();
    renderer.dispose();
  };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isWide, setIsWide] = useState(false);

  // The graph (and so this atmosphere) only shows from md up. Phones use the
  // Phase 2 stacked list, so we never spin up WebGL there.
  useEffect(() => {
    const mountedId = window.setTimeout(() => setMounted(true), 0);
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => {
      window.clearTimeout(mountedId);
      query.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !isWide) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanup = () => {};
    import("three").then((THREE) => {
      if (cancelled || !canvasRef.current) return;
      cleanup = initParticles(THREE, canvasRef.current, {
        animate: !prefersReducedMotion,
      });
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [mounted, isWide, prefersReducedMotion]);

  if (!mounted || !isWide) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
