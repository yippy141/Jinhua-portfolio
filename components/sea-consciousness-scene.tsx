"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

type SeaConsciousnessSceneProps = {
  reduceMotion: boolean;
};

const PARTICLE_COUNT = 360;

export function SeaConsciousnessScene({
  reduceMotion,
}: SeaConsciousnessSceneProps) {
  return (
    <SceneErrorBoundary>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ zIndex: -40 }}
      >
        <Canvas
          fallback={null}
          frameloop={reduceMotion ? "demand" : "always"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7], fov: 48 }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "low-power",
          }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor("#000000", 0);
            scene.fog = new THREE.FogExp2("#07100f", 0.055);
          }}
        >
          <ParticleField reduceMotion={reduceMotion} />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}

function ParticleField({ reduceMotion }: SeaConsciousnessSceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const random = createSeededRandom(42);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const palette = [
      new THREE.Color("#d8f7ff"),
      new THREE.Color("#b8d9c6"),
      new THREE.Color("#f0d79f"),
      new THREE.Color("#c9c3ff"),
    ];

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const positionIndex = index * 3;
      const depth = random();
      const spread = 4.2 + depth * 4.8;
      const color = palette[Math.floor(random() * palette.length)];

      positions[positionIndex] = (random() - 0.5) * spread * 2.2;
      positions[positionIndex + 1] = (random() - 0.5) * spread * 1.25;
      positions[positionIndex + 2] = (random() - 0.5) * 7.5;

      colors[positionIndex] = color.r;
      colors[positionIndex + 1] = color.g;
      colors[positionIndex + 2] = color.b;
    }

    const fieldGeometry = new THREE.BufferGeometry();
    fieldGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    fieldGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );

    return fieldGeometry;
  }, []);

  useFrame((state, delta) => {
    if (reduceMotion || !pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y += delta * 0.012;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.045) * 0.04;
    pointsRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.075) * 0.045;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        transparent
        depthWrite={false}
        opacity={0.58}
        size={0.026}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function createSeededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
