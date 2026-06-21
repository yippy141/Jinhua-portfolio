"use client";

import { useEffect, useRef } from "react";

import {
  lerp,
  sampleSceneCameraY,
} from "./dive-clock";
import type { DiveClock } from "./dive-clock";
import type { IntroConfig } from "./sea-intro-config";

// A real spatial transition, not a flat overlay. A perspective camera descends
// from the atmosphere through a displaced water surface into the deep. Layers:
// drifting parallax clouds, a Fresnel/glint water plane that physically occludes
// the map before it is removed, then an underwater volume with depth fog, rising
// bubbles and light shafts that converge on the existing ParticleField palette.

type ThreeModule = typeof import("three");
type ThreeColor = import("three").Color;

type DiveTransitionSceneProps = {
  clockRef: React.RefObject<DiveClock>;
  reducedMotion: boolean;
  config: IntroConfig;
};

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a || 1), 0), 1);
  return t * t * (3 - 2 * t);
};

const CLOUD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CLOUD_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uSeed;
  uniform vec3 uTint;

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
    vec2 p = vUv * 3.0 + vec2(uSeed, uSeed * 0.5);
    p += vec2(uTime * 0.03, uTime * 0.015);
    float n = fbm(p);
    // soft round falloff so planes read as billowing masses, not squares
    float edge = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x)
               * smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    float a = smoothstep(0.42, 0.85, n) * edge * uOpacity;
    vec3 col = mix(uTint, vec3(1.0), smoothstep(0.5, 0.95, n) * 0.5);
    gl_FragColor = vec4(col, a);
  }
`;

const BUBBLE_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uRise;
  uniform float uSpan;
  varying float vAlpha;
  void main(){
    vec3 pos = position;
    float y = mod(pos.y + uTime * uRise + aPhase * uSpan, uSpan) - uSpan * 0.5;
    pos.y = y;
    pos.x += sin(uTime * 0.7 + aPhase * 6.28) * 1.5;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (300.0 / max(-mv.z, 1.0));
    vAlpha = 1.0;
  }
`;

const BUBBLE_FRAG = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying float vAlpha;
  void main(){
    vec2 d = gl_PointCoord - vec2(0.5);
    float r = length(d);
    if(r > 0.5) discard;
    float ring = smoothstep(0.5, 0.42, r) * (0.5 + 0.5 * smoothstep(0.2, 0.45, r));
    gl_FragColor = vec4(uColor, ring * uOpacity * vAlpha);
  }
`;

const WATER_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uDisp;
  uniform float uWaveSpeed;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vCrest;

  float wave(vec2 p){
    float t = uTime * uWaveSpeed;
    float h = sin(p.x * 0.05 + t) * 0.5
            + sin(p.y * 0.045 - t * 0.8) * 0.5
            + sin((p.x + p.y) * 0.08 + t * 1.3) * 0.25;
    return h * uDisp;
  }
  void main(){
    vec3 pos = position;
    float h = wave(position.xz);
    pos.y += h;
    float e = 2.0;
    float hx = wave(position.xz + vec2(e, 0.0));
    float hz = wave(position.xz + vec2(0.0, e));
    vec3 n = normalize(vec3(h - hx, e, h - hz));
    vNormal = mat3(modelMatrix) * n;
    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorld = wp.xyz;
    vCrest = smoothstep(0.5, 1.0, h / (uDisp + 0.001));
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const WATER_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uDeep;
  uniform vec3 uSky;
  uniform vec3 uSun;
  uniform float uFresnelP;
  uniform float uGlint;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vCrest;
  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), uFresnelP);
    vec3 base = mix(uDeep, uSky, clamp(fres, 0.0, 1.0));
    vec3 L = normalize(uSun);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 140.0) * uGlint;
    vec3 col = base + vec3(1.0, 0.86, 0.66) * spec;
    col += vCrest * 0.12;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const SHAFT_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  void main(){
    float horiz = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
    float vert = (1.0 - vUv.y); // brightest near the surface (top)
    float shimmer = 0.85 + 0.15 * sin(uTime * 1.5 + vUv.y * 12.0);
    float a = horiz * vert * uOpacity * shimmer;
    gl_FragColor = vec4(uColor, a);
  }
`;

const SHAFT_VERT = CLOUD_VERT;

function initScene(
  THREE: ThreeModule,
  canvas: HTMLCanvasElement,
  config: IntroConfig,
  clockRef: React.RefObject<DiveClock>,
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

  const deep = new THREE.Color(config.colors.deepWater);
  renderer.setClearColor(deep, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(config.fog.nearColor, config.fog.densityStart);

  const camera = new THREE.PerspectiveCamera(config.scene.fov, w / h, 0.1, 2000);
  camera.position.set(0, config.scene.cameraStartY, 0);

  const sunDir = new THREE.Vector3(0.6, 0.5, 0.35).normalize();

  // ── clouds ──
  const cloudTint = new THREE.Color(config.colors.sunrise);
  const cloudGeo = new THREE.PlaneGeometry(1, 1);
  type CloudRec = {
    mesh: import("three").Mesh;
    mat: import("three").ShaderMaterial;
    depth: number;
  };
  const clouds: CloudRec[] = [];
  const resetCloud = (mesh: import("three").Mesh) => {
    mesh.position.set(
      (Math.random() - 0.5) * 260,
      lerp(-12, 52, Math.random()),
      lerp(-420, -60, Math.random()),
    );
    const s = lerp(120, 320, Math.random());
    mesh.scale.set(s, s * 0.6, 1);
  };
  for (let i = 0; i < config.clouds.layers * 3; i++) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: CLOUD_VERT,
      fragmentShader: CLOUD_FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: config.clouds.idleOpacity },
        uSeed: { value: Math.random() * 10 },
        uTint: { value: cloudTint },
      },
    });
    const mesh = new THREE.Mesh(cloudGeo, mat);
    resetCloud(mesh);
    scene.add(mesh);
    clouds.push({ mesh, mat, depth: 0.4 + Math.random() });
  }

  // ── water plane ──
  const waterGeo = new THREE.PlaneGeometry(
    config.water.size,
    config.water.size,
    128,
    128,
  );
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.ShaderMaterial({
    vertexShader: WATER_VERT,
    fragmentShader: WATER_FRAG,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uDisp: { value: config.water.displacement },
      uWaveSpeed: { value: config.water.waveSpeed },
      uDeep: { value: new THREE.Color(config.colors.surfaceTurquoise) },
      uSky: { value: new THREE.Color(config.colors.skyCobalt) },
      uSun: { value: sunDir },
      uFresnelP: { value: config.water.fresnelPower },
      uGlint: { value: config.water.glintStrength },
    },
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(0, 0, -120);
  water.visible = false;
  scene.add(water);

  // ── bubbles ──
  const bubbleCount = config.bubbles.count;
  const bSpan = 260;
  const bPos = new Float32Array(bubbleCount * 3);
  const bSize = new Float32Array(bubbleCount);
  const bPhase = new Float32Array(bubbleCount);
  for (let i = 0; i < bubbleCount; i++) {
    bPos[i * 3 + 0] = (Math.random() - 0.5) * 120;
    bPos[i * 3 + 1] = (Math.random() - 0.5) * bSpan;
    bPos[i * 3 + 2] = lerp(-220, 20, Math.random());
    bSize[i] = config.bubbles.size * (0.5 + Math.random());
    bPhase[i] = Math.random();
  }
  const bubbleGeo = new THREE.BufferGeometry();
  bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));
  bubbleGeo.setAttribute("aSize", new THREE.BufferAttribute(bSize, 1));
  bubbleGeo.setAttribute("aPhase", new THREE.BufferAttribute(bPhase, 1));
  const bubbleMat = new THREE.ShaderMaterial({
    vertexShader: BUBBLE_VERT,
    fragmentShader: BUBBLE_FRAG,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uRise: { value: config.bubbles.riseSpeed },
      uSpan: { value: bSpan },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color(config.colors.caustic) },
    },
  });
  const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
  scene.add(bubbles);

  // ── light shafts (also carry the caustic-tinted light just below surface) ──
  const shaftMats: import("three").ShaderMaterial[] = [];
  const shaftGeo = new THREE.PlaneGeometry(1, 1);
  for (let i = 0; i < 5; i++) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: SHAFT_VERT,
      fragmentShader: SHAFT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color(config.colors.caustic) },
      },
    });
    const mesh = new THREE.Mesh(shaftGeo, mat);
    mesh.position.set((Math.random() - 0.5) * 160, -60, lerp(-200, -40, Math.random()));
    mesh.scale.set(lerp(18, 40, Math.random()), 220, 1);
    scene.add(mesh);
    shaftMats.push(mat);
  }

  const surfaceTurq = new THREE.Color(config.colors.surfaceTurquoise);
  const fogNear = new THREE.Color(config.fog.nearColor);
  const fogFar = new THREE.Color(config.fog.farColor);
  const tmpColor = new THREE.Color();

  const applyProgress = (progress: number, time: number) => {
    const cfg = config;
    // camera descent + downward tilt
    const camY = sampleSceneCameraY(cfg, progress);
    camera.position.y = camY;
    const pitchDeg = lerp(12, 52, smoothstep(0.3, 0.92, progress));
    const pitch = (pitchDeg * Math.PI) / 180;
    const dir = new THREE.Vector3(0, -Math.sin(pitch), -Math.cos(pitch));
    camera.lookAt(camera.position.clone().add(dir.multiplyScalar(120)));

    // clouds: faint idle drift, swell through the atmosphere, gone underwater
    const cloudOpacity =
      progress < 0.04
        ? cfg.clouds.idleOpacity
        : lerp(cfg.clouds.idleOpacity, 0.7, smoothstep(0.1, 0.5, progress)) *
          (1 - smoothstep(0.66, 0.82, progress));
    for (const c of clouds) {
      c.mat.uniforms.uTime.value = time;
      c.mat.uniforms.uOpacity.value = cloudOpacity;
      if (!reducedMotion) {
        c.mesh.position.z +=
          cfg.clouds.speed * c.depth * (1 + cfg.clouds.parallax * 0.04);
        if (c.mesh.position.z > 30) resetCloud(c.mesh);
      }
    }

    // water surface: appears for the approach + crossing, occludes the map
    water.visible = progress > 0.5;
    waterMat.uniforms.uTime.value = time;

    // underwater visibility
    const underwater = smoothstep(cfg.scene.crossProgress, cfg.timing.occludeProgress, progress);
    bubbleMat.uniforms.uTime.value = time;
    bubbleMat.uniforms.uOpacity.value = underwater * 0.9;
    const shaftOpacity = underwater * (1 - smoothstep(0.96, 1.0, progress)) * 0.5;
    for (const m of shaftMats) {
      m.uniforms.uTime.value = time;
      m.uniforms.uOpacity.value = shaftOpacity;
    }

    // depth fog: turquoise shallow -> deep water, converging on ParticleField
    const fogT = smoothstep(cfg.scene.crossProgress, 1.0, progress);
    tmpColor.copy(fogNear).lerp(fogFar, fogT);
    (scene.fog as import("three").FogExp2).color.copy(tmpColor);
    (scene.fog as import("three").FogExp2).density = lerp(
      cfg.fog.densityStart,
      cfg.fog.densityEnd,
      smoothstep(cfg.scene.crossProgress, 1.0, progress),
    );
    // water shallow tint also deepens slightly with descent
    tmpColor.copy(surfaceTurq).lerp(fogFar, fogT * 0.6);
    (waterMat.uniforms.uDeep.value as ThreeColor).copy(tmpColor);

    // Clear alpha: transparent above water (map shows), opaque deep water once
    // we are below the surface so the underwater fills the frame and converges
    // to the ParticleField colour.
    const clearAlpha = smoothstep(cfg.scene.crossProgress, cfg.timing.occludeProgress, progress);
    renderer.setClearColor(fogFar, clearAlpha);
  };

  let raf = 0;
  const start = performance.now();
  const render = () => {
    const clock = clockRef.current;
    const progress = clock ? clock.progress : 0;
    const time = reducedMotion ? 0 : (performance.now() - start) / 1000;
    applyProgress(progress, time);
    renderer.render(scene, camera);
  };

  const loop = () => {
    render();
    raf = requestAnimationFrame(loop);
  };

  if (reducedMotion) {
    render(); // single luminous static frame
  } else {
    raf = requestAnimationFrame(loop);
  }

  const onResize = () => {
    ({ w, h } = sizeOf());
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (reducedMotion) render();
  };
  window.addEventListener("resize", onResize);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    cloudGeo.dispose();
    waterGeo.dispose();
    bubbleGeo.dispose();
    shaftGeo.dispose();
    waterMat.dispose();
    bubbleMat.dispose();
    for (const c of clouds) c.mat.dispose();
    for (const m of shaftMats) m.dispose();
    renderer.dispose();
  };
}

export function DiveTransitionScene({
  clockRef,
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
      cleanup = initScene(THREE, canvasRef.current, config, clockRef, reducedMotion);
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
