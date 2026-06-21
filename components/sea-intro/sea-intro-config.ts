// Single typed home for every visual + timing constant in the Sea Intro V2
// sequence. Tune the whole cinematic here without hunting through components.
//
// Art direction: "Stratospheric Dawn". Luminous cobalt space, a readable Earth
// with a cyan atmospheric rim and a warm sunrise glint, layered parallax clouds,
// then a continuous dive through a real water surface into the existing
// deep-water depths. Nothing here is decorative chrome: no HUD, no coordinates.

export type Vec2 = [number, number];
export type EasingName =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "easeInOutCubic";

export interface CameraKeyframe {
  // Position along the dive, 0 (orbit) .. 1 (settled on the water).
  atProgress: number;
  center: Vec2; // [lng, lat]
  zoom: number;
  pitch: number; // degrees
  bearing: number; // degrees
  // Easing used to approach THIS keyframe from the previous one.
  easing: EasingName;
}

export interface IntroConfig {
  // ── master timing ──
  timing: {
    totalMs: number; // full dive duration
    holdMs: number; // brief hold before the camera accelerates
    // Progress at which the water plane has fully occluded the map and Mapbox
    // can be destroyed.
    occludeProgress: number;
    // Progress at which the underwater depths begin their layered entrance.
    depthsRevealProgress: number;
    reducedMotionCrossfadeMs: number;
  };

  // ── surface (orbital idle) ──
  surface: {
    center: Vec2;
    zoom: number;
    pitch: number;
    bearing: number;
    autoRotateDegPerSec: number;
    minZoom: number;
    maxZoom: number;
    // Mapbox Standard-satellite light preset for the dawn mood.
    lightPreset: "dawn" | "day" | "dusk" | "night";
  };

  // ── camera flight (Mapbox) ──
  cameraPath: CameraKeyframe[];

  // ── atmosphere / fog (Mapbox globe) ──
  atmosphere: {
    spaceColor: string; // deep cobalt behind the globe
    highColor: string; // cyan upper atmosphere rim
    horizonColor: string; // warm sunrise band near the horizon
    horizonBlend: number;
    starIntensity: number;
  };

  // ── dive transition scene (Three.js) ──
  scene: {
    crossProgress: number; // progress where the camera passes the water surface
    // Optical centre of the dive (normalised 0..1), set live from the aperture.
    apertureCenter: Vec2;
  };

  colors: {
    skyCobalt: string; // reflected sky in the water Fresnel
    sunrise: string; // warm glint
    surfaceTurquoise: string; // shallow water tint
    deepWater: string; // matches ParticleField background (#07100F)
    caustic: string; // sub-surface light threads
    sonar: string; // rare highlight
  };

  clouds: {
    layers: number;
    density: number; // 0..1 coverage
    speed: number; // drift units / second
    parallax: number; // depth spread between layers
    idleOpacity: number; // faint drift while resting on the surface
  };

  water: {
    displacement: number; // wave height
    waveSpeed: number;
    fresnelPower: number;
    glintStrength: number;
    size: number; // plane size in scene units
  };

  refraction: {
    strength: number; // distortion at the crossing
    flareMs: number; // surface-break flare duration
  };

  bubbles: {
    count: number;
    riseSpeed: number;
    size: number;
  };

  fog: {
    // Underwater depth fog progresses from a turquoise shallow to the deep
    // water that matches ParticleField, so the scenes converge.
    nearColor: string;
    farColor: string;
    densityStart: number;
    densityEnd: number;
  };

  // ── depths entrance (homepage reveal) ──
  reveal: {
    // Progress offsets (relative to depthsRevealProgress .. 1) at which each
    // layer begins entering. Layered, never one flat fade.
    backgroundAt: number;
    chromeAt: number;
    heroAt: number;
    graphAt: number;
    layerDurationMs: number;
  };
}

// Mobile overrides: a shorter, simpler path and lighter shaders, never just a
// shrunk desktop composition.
export interface IntroConfigOverrides {
  timing?: Partial<IntroConfig["timing"]>;
  surface?: Partial<IntroConfig["surface"]>;
  clouds?: Partial<IntroConfig["clouds"]>;
  bubbles?: Partial<IntroConfig["bubbles"]>;
  scene?: Partial<IntroConfig["scene"]>;
  cameraPath?: CameraKeyframe[];
}

const DC: Vec2 = [-77.0369, 38.9072];
// A broad public stretch of the tidal Potomac south of Washington, wide enough
// that the final satellite frame is primarily open water, not roads and land.
const POTOMAC: Vec2 = [-77.032, 38.785];

export const INTRO_CONFIG: IntroConfig = {
  timing: {
    totalMs: 6800,
    holdMs: 500,
    occludeProgress: 0.82,
    depthsRevealProgress: 0.92,
    reducedMotionCrossfadeMs: 420,
  },
  surface: {
    center: DC,
    zoom: 3.0,
    pitch: 0,
    bearing: 0,
    autoRotateDegPerSec: 1.6,
    minZoom: 2.2,
    maxZoom: 5,
    lightPreset: "dawn",
  },
  cameraPath: [
    { atProgress: 0.0, center: DC, zoom: 3.0, pitch: 0, bearing: 0, easing: "linear" },
    { atProgress: 0.16, center: DC, zoom: 3.5, pitch: 4, bearing: 6, easing: "easeIn" },
    { atProgress: 0.42, center: [-77.035, 38.86], zoom: 7.8, pitch: 22, bearing: 16, easing: "easeInOut" },
    { atProgress: 0.62, center: [-77.033, 38.82], zoom: 11.4, pitch: 36, bearing: 24, easing: "easeInOut" },
    // End near-top-down over broad water so the surface fills the frame.
    { atProgress: 0.74, center: POTOMAC, zoom: 13.4, pitch: 28, bearing: 30, easing: "easeOut" },
  ],
  atmosphere: {
    spaceColor: "#0a1a3a", // deep cobalt, not near-black
    highColor: "#5fd2e6", // cyan atmospheric rim
    horizonColor: "#f4c89a", // warm sunrise band
    horizonBlend: 0.04,
    starIntensity: 0.12,
  },
  scene: {
    crossProgress: 0.72,
    apertureCenter: [0.5, 0.58],
  },
  colors: {
    skyCobalt: "#16315f",
    sunrise: "#ffd9a8",
    surfaceTurquoise: "#2fb6c4",
    deepWater: "#07100f",
    caustic: "#7fe3ea",
    sonar: "#4fb3bf",
  },
  clouds: {
    layers: 5,
    density: 0.55,
    speed: 0.6,
    parallax: 26,
    idleOpacity: 0.32,
  },
  water: {
    displacement: 1.6,
    waveSpeed: 0.8,
    fresnelPower: 3.0,
    glintStrength: 0.85,
    size: 1400,
  },
  refraction: {
    strength: 0.06,
    flareMs: 420,
  },
  bubbles: {
    count: 900,
    riseSpeed: 14,
    size: 2.4,
  },
  fog: {
    nearColor: "#2fb6c4",
    farColor: "#07100f",
    densityStart: 0.006,
    densityEnd: 0.05,
  },
  reveal: {
    backgroundAt: 0.0,
    chromeAt: 0.2,
    heroAt: 0.42,
    graphAt: 0.6,
    layerDurationMs: 900,
  },
};

export const MOBILE_OVERRIDES: IntroConfigOverrides = {
  timing: { totalMs: 5600, occludeProgress: 0.82, depthsRevealProgress: 0.92 },
  surface: { zoom: 3.2, autoRotateDegPerSec: 1.2 },
  clouds: { layers: 3, density: 0.5, parallax: 18 },
  bubbles: { count: 320, size: 2.0 },
  // Shorter, simpler path: fewer waypoints, gentle near-top-down ending.
  cameraPath: [
    { atProgress: 0.0, center: DC, zoom: 3.2, pitch: 0, bearing: 0, easing: "linear" },
    { atProgress: 0.4, center: [-77.034, 38.85], zoom: 8.4, pitch: 20, bearing: 12, easing: "easeInOut" },
    { atProgress: 0.74, center: POTOMAC, zoom: 13.2, pitch: 24, bearing: 24, easing: "easeOut" },
  ],
};

export function resolveConfig(isMobile: boolean): IntroConfig {
  if (!isMobile) return INTRO_CONFIG;
  const o = MOBILE_OVERRIDES;
  return {
    ...INTRO_CONFIG,
    timing: { ...INTRO_CONFIG.timing, ...o.timing },
    surface: { ...INTRO_CONFIG.surface, ...o.surface },
    clouds: { ...INTRO_CONFIG.clouds, ...o.clouds },
    bubbles: { ...INTRO_CONFIG.bubbles, ...o.bubbles },
    scene: { ...INTRO_CONFIG.scene, ...o.scene },
    cameraPath: o.cameraPath ?? INTRO_CONFIG.cameraPath,
  };
}
