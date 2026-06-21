"use client";

import { useEffect, useState } from "react";

import { phaseAtProgress, phaseStart } from "./dive-clock";
import type { DiveClock } from "./dive-clock";

// Development-only tuning surface, enabled with ?introDebug=1. Intentionally
// plain: it is not production UI. Lets us scrub the sequence, jump between
// phases, pause/resume, and read the current phase + elapsed time.

type IntroDebugPanelProps = {
  clockRef: React.RefObject<DiveClock>;
  paused: boolean;
  onRestart: () => void;
  onSurface: () => void;
  onDepths: () => void;
  // Enter the dive and seek to a progress value (pauses for inspection).
  onSeek: (progress: number) => void;
  onTogglePause: () => void;
};

const JUMPS: { label: string; progress: number }[] = [
  { label: "Atmosphere", progress: phaseStart("atmosphere") },
  { label: "Water approach", progress: phaseStart("water-approach") },
  { label: "Water crossing", progress: phaseStart("water-crossing") },
  { label: "Underwater", progress: phaseStart("submersion") },
];

export function IntroDebugPanel({
  clockRef,
  paused,
  onRestart,
  onSurface,
  onDepths,
  onSeek,
  onTogglePause,
}: IntroDebugPanelProps) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Poll the shared clock for a live readout without coupling to React renders.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const c = clockRef.current;
      if (c) {
        setProgress(c.progress);
        setElapsed(Math.round(c.progress * c.durationMs));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clockRef]);

  const phase = phaseAtProgress(progress);

  const btn =
    "rounded border border-white/25 px-2 py-1 text-[11px] text-white/90 hover:bg-white/15";

  return (
    <div className="fixed bottom-3 left-3 z-[100] w-64 rounded-md border border-white/20 bg-black/70 p-3 font-mono text-[11px] text-white/90 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold">intro debug</span>
        <span className="text-white/60">{(progress * 100).toFixed(1)}%</span>
      </div>
      <div className="mb-2 text-white/70">
        phase: <span className="text-white">{phase}</span>
        <br />
        elapsed: <span className="text-white">{elapsed}ms</span>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={progress}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="mb-2 w-full"
        aria-label="Scrub transition progress"
      />

      <div className="mb-2 flex flex-wrap gap-1">
        <button type="button" className={btn} onClick={onRestart}>
          Restart
        </button>
        <button type="button" className={btn} onClick={onSurface}>
          Surface
        </button>
        <button type="button" className={btn} onClick={onTogglePause}>
          {paused ? "Resume" : "Pause"}
        </button>
        <button type="button" className={btn} onClick={onDepths}>
          Depths
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {JUMPS.map((j) => (
          <button
            key={j.label}
            type="button"
            className={btn}
            onClick={() => onSeek(j.progress)}
          >
            {j.label}
          </button>
        ))}
      </div>
    </div>
  );
}
