"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Stars,
  MeshDistortMaterial,
  Float,
  Text,
  Environment
} from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function Particles({ count = 2000, speed = 1 }) {
  const points = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 50;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 50;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * 0.05 * speed;
    points.current.rotation.x = time * 0.02 * speed;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          args={[particles, 3]}
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function NeonRings({ isTraveling }: { isTraveling: boolean }) {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    group.current.rotation.z = time * (isTraveling ? 2 : 0.2);
    group.current.rotation.x = time * (isTraveling ? 0.5 : 0.1);
  });

  return (
    <group ref={group}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <torusGeometry args={[10 + i * 2, 0.02, 16, 100]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#6366f1" : "#a855f7"} />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene({ isTraveling }: { isTraveling: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={75} />
        <color attach="background" args={["#020617"]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />

        <Stars
          radius={100}
          depth={50}
          count={isTraveling ? 15000 : 5000}
          factor={isTraveling ? 10 : 4}
          saturation={0}
          fade
          speed={isTraveling ? 10 : 1}
        />

        <Float speed={isTraveling ? 10 : 2} rotationIntensity={isTraveling ? 5 : 1} floatIntensity={isTraveling ? 5 : 1}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[4, 64, 64]} />
            <MeshDistortMaterial
              color={isTraveling ? "#4f46e5" : "#1e1b4b"}
              speed={isTraveling ? 10 : 2}
              distort={isTraveling ? 0.6 : 0.4}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>

        <Particles count={isTraveling ? 5000 : 2000} speed={isTraveling ? 20 : 1} />
        <NeonRings isTraveling={isTraveling} />

        <EffectComposer >
          <Bloom
            luminanceThreshold={0.2}
            mipmapBlur
            intensity={isTraveling ? 2.5 : 1.5}
            radius={0.4}
          />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          {isTraveling ? (
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.02, 0.02)}
            />
          ) : (
            <></>
          )}
        </EffectComposer>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={isTraveling ? 20 : 0.5} />
      </Canvas>
    </div>
  );
}
