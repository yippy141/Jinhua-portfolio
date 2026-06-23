"use client";

import { useEffect, useRef } from "react";

import type { DiveClock } from "./dive-clock";
import type { IntroConfig } from "./sea-intro-config";

// The dive transition, rebuilt as a top-down descent through a water surface.
// There is NO horizon and NO idle cloud layer: at rest the scene is fully
// transparent and only the globe shows. During the dive, water floods the
// viewport radially from the dive aperture (the optical centre), refracts and
// brightens, breaks with a cyan flare, then becomes an underwater volume with
// rising bubbles, caustics and light shafts that darkens to the ParticleField
// palette. The map stays visible beneath until the water is fully opaque.
//
// Lifecycle mirrors particle-field.tsx: dynamic three import, WebGL try/catch,
// full disposal on unmount.

type ThreeModule = typeof import("three");

type Center = { x: number; y: number }; // normalised, screen space (y down)

type DiveTransitionSceneProps = {
  clockRef: React.RefObject<DiveClock>;
  centerRef: React.RefObject<Center>;
  reducedMotion: boolean;
  config: IntroConfig;
};

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// One fragment shader covers approach, crossing and submersion, selected by
// progress. Kept restrained: the flare is capped, tones stay in the deep-water
// family, and there is never a flat black fade.
const QUAD_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uCenter;
  uniform float uCross;
  uniform vec3 uTurq;
  uniform vec3 uDeep;
  uniform vec3 uCyan;
  uniform vec3 uSky;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p); vec2 f=fract(p);
    vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),
               mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
  }
  float fbm(vec2 p){
    float v=0.0; float a=0.5;
    for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
    return v;
  }

  void main(){
    float prog = clamp(uProgress, 0.0, 1.0);
    if (prog < 0.46) { discard; } // surface state: globe only, no overlay

    vec2 d2 = vUv - uCenter;
    d2.x *= uAspect;
    float dist = length(d2);
    float maxR = length(vec2(uAspect, 1.0)) * 1.06;

    // Water floods outward from the aperture centre (no horizon line), fully
    // covering just before the map is removed at ~0.84.
    float reach = smoothstep(0.46, 0.82, prog) * maxR;
    float front = reach - dist; // >0 inside the water
    float water = smoothstep(-0.04, 0.06, front);

    // Concentric ripples expanding from the centre = downward descent.
    float ripple = sin(dist * 26.0 - uTime * 5.0 - prog * 8.0) * 0.5 + 0.5;

    float submer = smoothstep(uCross, 1.0, prog);
    // Inherited downward velocity just after the crossing: a brief continued
    // "fall" that decays over the submersion window (~0.84 -> 0.96).
    float inherited = clamp(1.0 - (prog - 0.84) / 0.12, 0.0, 1.0) * step(uCross, prog);

    // Base colour: shallow turquoise near the surface, deepening with descent.
    vec3 col = mix(uTurq, uDeep, submer);
    col += uCyan * ripple * 0.05 * (1.0 - submer);

    // Caustics + light shafts once below the surface. The downward pan speeds up
    // with the inherited velocity so the descent visibly continues underwater.
    vec2 cuv = vUv * vec2(uAspect, 1.0);
    float flow = uTime * 0.5 + inherited * 2.4;
    float caustic = fbm(cuv * 6.0 - vec2(0.0, flow));
    caustic = pow(caustic, 2.0);
    col += uCyan * caustic * submer * (1.0 - smoothstep(0.95, 1.0, prog)) * 0.35;
    float shafts = pow(0.5 + 0.5 * sin(vUv.x * 22.0 + uTime * 0.6), 3.0);
    col += uCyan * shafts * (1.0 - vUv.y) * submer * 0.12;
    // A subtle streak that rushes downward right after the crossing.
    col += uCyan * inherited * smoothstep(0.4, 1.0, fract(vUv.y * 4.0 - flow)) * 0.06;

    // Surface-break flare: a bright cyan ring riding the water front + a brief
    // central bloom, at the moment of impact (~0.74 -> 0.86) while velocity
    // continues. Capped so it never hard-flashes.
    float breakPhase = smoothstep(0.74, 0.84, prog) * (1.0 - smoothstep(0.84, 0.94, prog));
    float ring = exp(-pow((dist - reach) * 7.0, 2.0));
    col += uCyan * ring * breakPhase * 0.6;
    col += uSky * exp(-dist * 4.0) * breakPhase * 0.25;

    // Deepen the edges as we sink.
    col = mix(col, uDeep, smoothstep(0.4, 1.1, dist) * submer * 0.7);

    // Opacity: transparent until water arrives, fully opaque before the map is
    // removed, so the surface visibly replaces Mapbox (no black fade).
    float opacity = smoothstep(0.46, 0.82, prog);
    float alpha = clamp(water * opacity, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

const BUBBLE_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uRise;
  varying float vFade;
  void main(){
    // Screen-space points (ortho clip space). Rise upward, wrap top to bottom.
    float y = mod(position.y + uTime * uRise + aPhase * 2.0, 2.4) - 1.2;
    float x = position.x + sin(uTime * 0.6 + aPhase * 6.28) * 0.02;
    gl_Position = vec4(x, y, 0.0, 1.0);
    gl_PointSize = aSize;
    vFade = smoothstep(1.1, 0.6, abs(y));
  }
`;

const BUBBLE_FRAG = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying float vFade;
  void main(){
    vec2 c = gl_PointCoord - vec2(0.5);
    float r = length(c);
    if (r > 0.5) discard;
    float ring = smoothstep(0.5, 0.4, r) * (0.4 + 0.6 * smoothstep(0.15, 0.45, r));
    gl_FragColor = vec4(uColor, ring * uOpacity * vFade);
  }
`;

function initScene(
  THREE: ThreeModule,
  canvas: HTMLCanvasElement,
  config: IntroConfig,
  clockRef: React.RefObject<DiveClock>,
  centerRef: React.RefObject<Center>,
  reducedMotion: boolean,
): () => void {
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, reducedMotion ? 1.5 : 2));
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = true;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const quadGeo = new THREE.PlaneGeometry(2, 2);
  const quadMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    fragmentShader: QUAD_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: w / h },
      uCenter: { value: new THREE.Vector2(0.5, 0.42) },
      uCross: { value: config.scene.crossProgress },
      uTurq: { value: new THREE.Color(config.colors.surfaceTurquoise) },
      uDeep: { value: new THREE.Color(config.colors.deepWater) },
      uCyan: { value: new THREE.Color(config.colors.caustic) },
      uSky: { value: new THREE.Color(config.colors.skyCobalt) },
    },
  });
  const quad = new THREE.Mesh(quadGeo, quadMat);
  scene.add(quad);

  // ── rising bubbles (screen space) ──
  const count = config.bubbles.count;
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3 + 0] = Math.random() * 2 - 1;
    pos[i * 3 + 1] = Math.random() * 2 - 1;
    pos[i * 3 + 2] = 0;
    size[i] = config.bubbles.size * (0.6 + Math.random()) * (window.devicePixelRatio > 1 ? 1.4 : 1);
    phase[i] = Math.random();
  }
  const bubbleGeo = new THREE.BufferGeometry();
  bubbleGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  bubbleGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  bubbleGeo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  const bubbleMat = new THREE.ShaderMaterial({
    vertexShader: BUBBLE_VERT,
    fragmentShader: BUBBLE_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uRise: { value: 0.18 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color(config.colors.caustic) },
    },
  });
  const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
  scene.add(bubbles);

  const start = performance.now();
  let raf = 0;

  const render = () => {
    const clock = clockRef.current;
    const progress = clock ? clock.progress : 0;
    const time = reducedMotion ? 0 : (performance.now() - start) / 1000;
    const c = centerRef.current ?? { x: 0.5, y: 0.58 };

    quadMat.uniforms.uProgress.value = progress;
    quadMat.uniforms.uTime.value = time;
    // Convert screen-space (y down) centre to uv space (y up).
    (quadMat.uniforms.uCenter.value as import("three").Vector2).set(c.x, 1 - c.y);

    const submer = Math.max(
      0,
      Math.min(1, (progress - config.scene.crossProgress) / (1 - config.scene.crossProgress)),
    );
    // Bubbles rush past faster right after the crossing (inherited downward
    // velocity) and settle as we reach the deep.
    const inherited =
      progress > config.scene.crossProgress
        ? Math.max(0, Math.min(1, 1 - (progress - 0.84) / 0.12))
        : 0;
    bubbleMat.uniforms.uTime.value = time;
    bubbleMat.uniforms.uRise.value = 0.18 + inherited * 0.7;
    bubbleMat.uniforms.uOpacity.value = submer * (1 - Math.max(0, (progress - 0.97) / 0.03)) * 0.85;

    renderer.render(scene, camera);
  };

  const loop = () => {
    if (!document.hidden) render();
    raf = requestAnimationFrame(loop);
  };
  if (reducedMotion) render();
  else raf = requestAnimationFrame(loop);

  const onResize = () => {
    ({ w, h } = sizeOf());
    renderer.setSize(w, h, false);
    quadMat.uniforms.uAspect.value = w / h;
    if (reducedMotion) render();
  };
  window.addEventListener("resize", onResize);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    quadGeo.dispose();
    bubbleGeo.dispose();
    quadMat.dispose();
    bubbleMat.dispose();
    renderer.dispose();
  };
}

export function DiveTransitionScene({
  clockRef,
  centerRef,
  reducedMotion,
  config,
}: DiveTransitionSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let cleanup = () => {};
    import("three").then((THREE) => {
      if (cancelled || !canvasRef.current) return;
      cleanup = initScene(THREE, canvasRef.current, config, clockRef, centerRef, reducedMotion);
    });
    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
