"use client";

import { useCallback, useEffect, useReducer, useState } from "react";

import { hasMapboxToken, SESSION_KEY } from "./mapbox-config";

// The intro is a small three-state machine. "surface" shows the globe,
// "diving" runs the locked camera + veil transition, "depths" is the existing
// underwater portfolio. We resolve the initial state on the client only, so the
// server always renders the depths shell (SSR-safe, no-JS friendly).
export type IntroState = "surface" | "diving" | "depths";

type Action =
  | { type: "RESOLVE"; state: IntroState }
  | { type: "DIVE" }
  | { type: "TIMELINE_END" }
  | { type: "SKIP" }
  | { type: "REPLAY" }
  // Unconditional set, used by the V2 orchestrator and the debug panel to jump
  // directly between phases.
  | { type: "FORCE"; state: IntroState };

function reducer(state: IntroState, action: Action): IntroState {
  switch (action.type) {
    case "RESOLVE":
      // One-shot resolution from the post-mount effect. Only honoured while we
      // are still on the server-rendered "depths" placeholder.
      return state === "depths" ? action.state : state;
    case "DIVE":
      return state === "surface" ? "diving" : state;
    case "TIMELINE_END":
      return state === "diving" ? "depths" : state;
    case "SKIP":
      return state === "surface" ? "depths" : state;
    case "REPLAY":
      return state === "depths" ? "surface" : state;
    case "FORCE":
      return action.state;
    default:
      return state;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Cheap WebGL capability probe. Mapbox and the dive veil both need a context;
// if none is available we skip straight to the depths, which self-degrades to a
// static CSS atmosphere.
function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

function isLocalPreviewHost(): boolean {
  if (typeof window === "undefined") return true;

  const hostname = window.location.hostname;
  return (
    hostname === "localhost" ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    hostname.startsWith("127.")
  );
}

function shouldRememberIntroCompletion(): boolean {
  return !isLocalPreviewHost();
}

function reportLocalGlobeCapability(webgl: boolean) {
  if (!isLocalPreviewHost() || (hasMapboxToken && webgl)) return;

  console.info("[sea-intro] Globe unavailable on localhost.", {
    hasMapboxToken,
    webgl,
  });
}

function sessionComplete(): boolean {
  if (!shouldRememberIntroCompletion()) return false;

  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

// Dev / share affordance: ?intro=force always replays the intro from the
// surface, ignoring the per-session memory.
function forceReplayRequested(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("intro") === "force" || params.get("introDebug") === "1";
  } catch {
    return false;
  }
}

function markSessionComplete() {
  if (!shouldRememberIntroCompletion()) return;

  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Private mode or storage disabled: the intro simply replays next load.
  }
}

function clearSession() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // No-op.
  }
}

export type SeaIntroController = {
  state: IntroState;
  // True once the client has mounted and resolved the real initial state. Until
  // then we render the SSR depths placeholder.
  resolved: boolean;
  // True when the surface should be a still frame: reduced motion only.
  reducedMotion: boolean;
  // True when a globe is actually possible (token + WebGL), so "Return to
  // surface" can be offered even to a returning visitor.
  introCapable: boolean;
  // True while the camera/veil transition owns the screen; input is locked.
  locked: boolean;
  dive: () => void;
  skip: () => void;
  replay: () => void;
  finishDive: () => void;
  // Debug / orchestrator: jump to any state. `complete` also marks the session.
  force: (next: IntroState, opts?: { complete?: boolean }) => void;
};

export function useSeaIntroState(): SeaIntroController {
  const [state, dispatch] = useReducer(reducer, "depths");
  const [resolved, setResolved] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [introCapable, setIntroCapable] = useState(false);

  // Resolve the real entry state once, on the client.
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const webgl = hasWebGL();
    const capable = hasMapboxToken && webgl;
    reportLocalGlobeCapability(webgl);

    const force = forceReplayRequested();
    const nextState =
      !capable || (sessionComplete() && !force) ? "depths" : "surface";

    const raf = requestAnimationFrame(() => {
      setReducedMotion(reduced);
      setIntroCapable(capable);
      setResolved(true);
      // Returning visitor (without a force flag), or no globe possible: land in
      // the depths silently.
      dispatch({ type: "RESOLVE", state: nextState });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const dive = useCallback(() => dispatch({ type: "DIVE" }), []);

  const finishDive = useCallback(() => {
    markSessionComplete();
    dispatch({ type: "TIMELINE_END" });
  }, []);

  const skip = useCallback(() => {
    markSessionComplete();
    dispatch({ type: "SKIP" });
  }, []);

  const replay = useCallback(() => {
    clearSession();
    dispatch({ type: "REPLAY" });
  }, []);

  const force = useCallback(
    (next: IntroState, opts?: { complete?: boolean }) => {
      if (opts?.complete) markSessionComplete();
      else if (next === "surface") clearSession();
      dispatch({ type: "FORCE", state: next });
    },
    [],
  );

  return {
    state,
    resolved,
    reducedMotion,
    introCapable,
    locked: state === "diving",
    dive,
    skip,
    replay,
    finishDive,
    force,
  };
}
