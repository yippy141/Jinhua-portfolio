// Single source of truth for the Sea Intro surface map. Coordinates, zoom,
// timing, and the dark-satellite colour grade all live here so the look can be
// tuned in one place without touching component logic.
//
// Constitution note: the surface must never read as a stock Google-Earth render.
// The grade below pulls Mapbox satellite imagery toward the deep-water palette
// (cool, desaturated, low contrast) so it sits inside the editorial identity.

// The token is provisioned in .env.local as NEXT_PUBLIC_MAPBOX_TOKEN. It is a
// public token by design (NEXT_PUBLIC_), restricted by URL referrer in the
// Mapbox dashboard. If it is absent the intro degrades silently to the depths.
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
export const hasMapboxToken = MAPBOX_TOKEN.length > 0;

// Satellite imagery so the descent reads as a real place. We grade it dark in
// SurfaceGlobe rather than picking a pre-darkened vector style, because we want
// the photoreal coastline of the Potomac to stay legible as we fly down.
export const MAPBOX_STYLE = "mapbox://styles/mapbox/satellite-v9";

type LngLat = [number, number];

// Surface: high above Washington, D.C. on the globe. No label is ever shown;
// this is just where the camera silently rests.
export const SURFACE_CENTER: LngLat = [-77.0369, 38.9072];
export const SURFACE_ZOOM = 2.4;

// Dive target: open Potomac water south of the National Mall, deliberately a
// public stretch of river and never a residence. At the final zoom the frame is
// water, not rooftops.
export const DIVE_TARGET: LngLat = [-77.045, 38.875];
export const DIVE_ZOOM = 15.5;
export const DIVE_PITCH = 40;

// Camera flight. 2.3s of Mapbox motion sits inside a 3.0s total timeline; the
// veil and final fade run on a parallel clock (see DiveVeil / SeaIntro).
export const DIVE_DURATION_MS = 2300;
export const TIMELINE_TOTAL_MS = 3000;
// Hard guard: if Mapbox `moveend` never fires (tab blur, GPU stall) we still
// resolve to the depths after this long so the visitor is never trapped.
export const TIMELINE_GUARD_MS = TIMELINE_TOTAL_MS + 800;
export const DIVE_CURVE = 1.4;

// Gentle constrained interaction on the surface.
export const SURFACE_MIN_ZOOM = 1.6;
export const SURFACE_MAX_ZOOM = 4.5;
// Slow tidal auto-rotate, well under the constitution's restraint bar.
export const ROTATE_DEG_PER_SEC = 1.4;

// Dark-satellite colour grade, applied to every raster layer in the style via
// setPaintProperty. Values chosen to desaturate and cool the imagery toward the
// deep-water tokens without crushing the coastline to black.
export const RASTER_GRADE = {
  saturation: -0.45,
  contrast: -0.15,
  brightnessMin: 0.0,
  brightnessMax: 0.72,
  hueRotate: 150, // nudge greens/browns toward tide-teal
} as const;

// Atmospheric fog for the globe: a cool deep-water haze, not a bright blue sky.
// Colours are the constitution deep-water tokens.
export const SURFACE_FOG = {
  color: "#0c1a17", // deep-water panel
  highColor: "#356b66", // tide, faint upper atmosphere
  spaceColor: "#07100f", // abyssal background behind the globe
  horizonBlend: 0.08,
  starIntensity: 0.05,
} as const;

export const SESSION_KEY = "sea-intro-complete";
