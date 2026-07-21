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

const SHANGHAI: Vec2 = [121.4737, 31.2304];

// Two debug-selectable public-water dive targets (?diveTarget=huangpu|yangtze).
// Both are Shanghai-area open-water coordinates, never land or a residence.
export type DiveTargetId = "huangpu" | "yangtze";
export const DIVE_TARGETS: Record<
  DiveTargetId,
  { center: Vec2; label: string }
> = {
  // Broad Huangpu water between the Bund and Lujiazui.
  huangpu: { center: [121.4933, 31.2452], label: "Huangpu River" },
  // Open Yangtze estuary water east of central Shanghai.
  yangtze: { center: [121.78, 31.45], label: "Yangtze Estuary" },
};
export const DEFAULT_DIVE_TARGET: DiveTargetId = "huangpu";

function mix2(a: Vec2, b: Vec2, t: number): Vec2 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// A continuous camera path from orbit to the chosen water. Crucially it keeps
// MOVING (centre, zoom, pitch all change) right through the surface crossing and
// past the occlusion point, so the geographic motion never freezes while the
// water layer takes over. The final frames are zoomed in over open water.
export function buildCameraPath(target: Vec2, isMobile: boolean): CameraKeyframe[] {
  if (isMobile) {
    return [
      { atProgress: 0.0, center: SHANGHAI, zoom: 3.2, pitch: 0, bearing: 0, easing: "linear" },
      { atProgress: 0.4, center: mix2(SHANGHAI, target, 0.5), zoom: 8.4, pitch: 18, bearing: 12, easing: "easeInOut" },
      { atProgress: 0.74, center: target, zoom: 13.8, pitch: 40, bearing: 24, easing: "easeOut" },
      // Keeps rushing in through the crossing and past occlusion.
      { atProgress: 0.86, center: target, zoom: 15.8, pitch: 48, bearing: 28, easing: "easeOut" },
    ];
  }
  return [
    { atProgress: 0.0, center: SHANGHAI, zoom: 3.0, pitch: 0, bearing: 0, easing: "linear" },
    { atProgress: 0.16, center: SHANGHAI, zoom: 3.6, pitch: 4, bearing: 6, easing: "easeIn" },
    { atProgress: 0.42, center: mix2(SHANGHAI, target, 0.5), zoom: 7.8, pitch: 20, bearing: 16, easing: "easeInOut" },
    { atProgress: 0.62, center: mix2(SHANGHAI, target, 0.85), zoom: 11.6, pitch: 34, bearing: 24, easing: "easeInOut" },
    { atProgress: 0.74, center: target, zoom: 13.8, pitch: 44, bearing: 30, easing: "easeOut" },
    { atProgress: 0.82, center: target, zoom: 15.4, pitch: 52, bearing: 33, easing: "easeOut" },
    // Final keyframe past occlusion so motion never flatlines before map.remove().
    { atProgress: 0.86, center: target, zoom: 16.4, pitch: 56, bearing: 35, easing: "easeOut" },
  ];
}

export const INTRO_CONFIG: IntroConfig = {
  timing: {
    totalMs: 6800,
    holdMs: 500,
    // The water fully occludes the map (and the map is removed) only after the
    // crossing, while the camera is still moving.
    occludeProgress: 0.84,
    // The homepage appears only well after the camera has entered the water.
    depthsRevealProgress: 0.95,
    reducedMotionCrossfadeMs: 420,
  },
  surface: {
    center: SHANGHAI,
    zoom: 3.0,
    pitch: 0,
    bearing: 0,
    autoRotateDegPerSec: 1.6,
    minZoom: 2.2,
    // High enough that the dive can zoom right in over the water. Idle surface
    // zoom is held constant by disabling scroll-zoom (see DawnGlobe), so this
    // does not loosen the surface interaction.
    maxZoom: 17,
    lightPreset: "dawn",
  },
  cameraPath: buildCameraPath(DIVE_TARGETS[DEFAULT_DIVE_TARGET].center, false),
  atmosphere: {
    spaceColor: "#0a1a3a", // deep cobalt, not near-black
    highColor: "#5fd2e6", // cyan atmospheric rim
    horizonColor: "#f4c89a", // warm sunrise band
    horizonBlend: 0.04,
    starIntensity: 0.12,
  },
  scene: {
    crossProgress: 0.74,
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
  timing: { totalMs: 5600 },
  surface: { zoom: 3.2, autoRotateDegPerSec: 1.2 },
  clouds: { layers: 3, density: 0.5, parallax: 18 },
  bubbles: { count: 320, size: 2.0 },
};

export function resolveConfig(
  isMobile: boolean,
  targetId: DiveTargetId = DEFAULT_DIVE_TARGET,
): IntroConfig {
  const target = DIVE_TARGETS[targetId].center;
  const cameraPath = buildCameraPath(target, isMobile);
  if (!isMobile) {
    return { ...INTRO_CONFIG, cameraPath };
  }
  const o = MOBILE_OVERRIDES;
  return {
    ...INTRO_CONFIG,
    timing: { ...INTRO_CONFIG.timing, ...o.timing },
    surface: { ...INTRO_CONFIG.surface, ...o.surface },
    clouds: { ...INTRO_CONFIG.clouds, ...o.clouds },
    bubbles: { ...INTRO_CONFIG.bubbles, ...o.bubbles },
    scene: { ...INTRO_CONFIG.scene, ...o.scene },
    cameraPath,
  };
}
