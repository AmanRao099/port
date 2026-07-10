import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export function MorphingBlob({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    const t = state.clock.getElapsedTime();

    targetRotation.current.x = state.pointer.y * 0.35;
    targetRotation.current.y = state.pointer.x * 0.45;

    mesh.rotation.x += (targetRotation.current.x - mesh.rotation.x) * 0.03;
    mesh.rotation.y += delta * 0.12 + (targetRotation.current.y - mesh.rotation.y) * 0.03;

    material.distort = 0.42 + Math.sin(t * 0.6) * 0.1;
    material.speed = 1.8;

    // wireframe ghost drifts out of sync, like a mis-registered video field
    const wire = wireRef.current;
    if (wire) {
      wire.rotation.x = mesh.rotation.x - 0.06 + Math.sin(t * 1.7) * 0.02;
      wire.rotation.y = mesh.rotation.y + 0.08 + Math.cos(t * 1.3) * 0.02;
      const jitter = Math.sin(t * 9.0) > 0.96 ? 0.06 : 0;
      wire.position.x = jitter;
      wire.scale.setScalar(1.06 + Math.sin(t * 0.8) * 0.015);
    }
  });

  const position: [number, number, number] = isMobile ? [0.3, -0.6, -2] : [2.1, -0.1, -1.6];
  const scale = isMobile ? 0.95 : 1.5;

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <group position={position} scale={scale}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 5]} />
          <MeshDistortMaterial
            ref={materialRef}
            color="#00c97e"
            emissive="#003d26"
            emissiveIntensity={0.55}
            roughness={0.3}
            metalness={0.5}
            flatShading
            distort={0.42}
            speed={1.8}
          />
        </mesh>
        <mesh ref={wireRef} scale={1.06}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#ff2975" wireframe transparent opacity={0.28} />
        </mesh>
      </group>
    </Float>
  );
}
