import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";

/** Endless synthwave floor — the grid scrolls toward the camera and fades into fog. */
export function RetroGrid() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // scroll one cell, then snap back so the motion loops seamlessly
    ref.current.position.z = (ref.current.position.z + delta * 0.6) % 0.5;
  });

  return (
    <group ref={ref} position={[0, -1.6, 0]}>
      <Grid
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#0e4d33"
        sectionSize={2.5}
        sectionThickness={1.1}
        sectionColor="#00ff9f"
        fadeDistance={16}
        fadeStrength={1.6}
        infiniteGrid
      />
    </group>
  );
}
