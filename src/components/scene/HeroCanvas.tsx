import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Pixelation,
  ChromaticAberration,
  Scanline,
  Glitch,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import * as THREE from "three";
import { MorphingBlob } from "./MorphingBlob";
import { ParticleField } from "./ParticleField";
import { RetroGrid } from "./RetroGrid";

function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    const targetX = pointer.x * 0.7;
    const targetY = pointer.y * 0.35 + 0.1;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroCanvas({ isMobile }: { isMobile: boolean }) {
  const dpr = useRef<[number, number]>([1, isMobile ? 1.5 : 2]);

  const glitchDelay = useMemo(() => new THREE.Vector2(4, 9), []);
  const glitchDuration = useMemo(() => new THREE.Vector2(0.1, 0.35), []);
  const glitchStrength = useMemo(() => new THREE.Vector2(0.15, 0.6), []);
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.0016, 0.0011), []);

  return (
    <Canvas
      dpr={dpr.current}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.1, 6.2], fov: 38 }}
    >
      <color attach="background" args={["#020403"]} />
      <fog attach="fog" args={["#020403", 6, 14]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 4]} intensity={0.8} color="#d8ffe4" />
      <pointLight position={[-1, -2, -2]} intensity={2.6} color="#ff2975" />
      <pointLight position={[4, 1, 1]} intensity={2.4} color="#00e5ff" />
      <pointLight position={[0, 3, 2]} intensity={1.6} color="#00ff9f" />

      <Suspense fallback={null}>
        <RetroGrid />
        <MorphingBlob isMobile={isMobile} />
        <ParticleField isMobile={isMobile} />
      </Suspense>

      <CameraRig />

      {!isMobile && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.22} luminanceSmoothing={0.9} mipmapBlur />
          <ChromaticAberration offset={aberrationOffset} radialModulation modulationOffset={0.4} />
          <Glitch
            mode={GlitchMode.SPORADIC}
            delay={glitchDelay}
            duration={glitchDuration}
            strength={glitchStrength}
            ratio={0.85}
          />
          <Scanline blendFunction={BlendFunction.OVERLAY} density={1.4} opacity={0.22} />
          <Noise premultiply opacity={0.35} />
          <Pixelation granularity={4} />
          <Vignette eskil={false} offset={0.12} darkness={0.95} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
