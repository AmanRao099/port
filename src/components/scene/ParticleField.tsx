import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function randomInSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

export function ParticleField({ isMobile }: { isMobile: boolean }) {
  const greenRef = useRef<THREE.Points>(null);
  const cyanRef = useRef<THREE.Points>(null);
  const count = isMobile ? 700 : 1800;
  const green = useMemo(() => randomInSphere(count, 6.5), [count]);
  const cyan = useMemo(() => randomInSphere(Math.floor(count / 3), 7), [count]);

  useFrame((_, delta) => {
    if (greenRef.current) {
      greenRef.current.rotation.y += delta * 0.025;
      greenRef.current.rotation.x += delta * 0.008;
    }
    if (cyanRef.current) {
      cyanRef.current.rotation.y -= delta * 0.018;
    }
  });

  return (
    <>
      <Points ref={greenRef} positions={green} frustumCulled>
        <PointMaterial
          transparent
          color="#00ff9f"
          size={isMobile ? 0.015 : 0.018}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5}
        />
      </Points>
      <Points ref={cyanRef} positions={cyan} frustumCulled>
        <PointMaterial
          transparent
          color="#00e5ff"
          size={isMobile ? 0.02 : 0.024}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.35}
        />
      </Points>
    </>
  );
}
