"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Stars,
  MeshDistortMaterial,
  Float,
} from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
  Glitch,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";

function HyperTunnel() {
  const group = useRef<THREE.Group>(null!);
  const segments = 30;
  const radius = 15;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    group.current.position.z = (time * 80) % 20;
    group.current.rotation.z = time * 0.5;
  });

  return (
    <group ref={group}>
      {[...Array(segments)].map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 10]} rotation={[0, 0, i * 0.5]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
      <Stars radius={50} depth={50} count={15000} factor={30} saturation={0} fade speed={15} />
    </group>
  );
}

function Starfield() {
  return (
    <Stars
      radius={100}
      depth={50}
      count={8000}
      factor={6}
      saturation={0}
      fade
      speed={1}
    />
  );
}

function Particles({ count = 3000, speed = 1 }) {
  const points = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 60;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 60;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * 0.05 * speed;
    points.current.rotation.z = time * 0.03 * speed;
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
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function DistortedSphere({ isTraveling }: { isTraveling: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (isTraveling) {
      meshRef.current.rotation.y = time * 10;
      meshRef.current.rotation.z = time * 5;
      outerRef.current.rotation.x = -time * 4;
    } else {
      meshRef.current.rotation.y = time * 0.2;
      outerRef.current.rotation.y = time * 0.4;
    }
  });

  return (
    <Float speed={isTraveling ? 15 : 2} rotationIntensity={isTraveling ? 10 : 0.5} floatIntensity={isTraveling ? 5 : 1}>
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[5, 64, 64]} />
          <MeshDistortMaterial
            color={isTraveling ? "#ffffff" : "#4f46e5"}
            speed={isTraveling ? 12 : 3}
            distort={isTraveling ? 0.8 : 0.5}
            roughness={0}
            metalness={1}
            emissive={isTraveling ? "#ffffff" : "#6366f1"}
            emissiveIntensity={isTraveling ? 5 : 1}
          />
        </mesh>
        <mesh ref={outerRef}>
           <sphereGeometry args={[7, 32, 32]} />
           <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

export default function Scene({ isTraveling }: { isTraveling: boolean }) {
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.08, 0.08), []);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setGlitchActive(true);
    const timer = setTimeout(() => setGlitchActive(false), 1000);
    return () => clearTimeout(timer);
  }, [isTraveling]);

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={75} />
        <color attach="background" args={["#000000"]} />

        <ambientLight intensity={0.2} />
        <spotLight position={[15, 15, 15]} angle={0.15} penumbra={1} intensity={3} color="#ffffff" />
        <pointLight position={[-15, -15, -15]} intensity={2} color="#4f46e5" />

        {isTraveling ? (
          <HyperTunnel />
        ) : (
          <>
            <Starfield />
            <Particles count={4000} speed={1} />
          </>
        )}

        <DistortedSphere isTraveling={isTraveling} />

        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.1}
            mipmapBlur
            intensity={isTraveling ? 8 : 3}
            radius={0.5}
          />
          <Noise opacity={0.15} />
          <Vignette eskil={false} offset={0.1} darkness={1.5} />
          {isTraveling ? (
            <ChromaticAberration
              blendFunction={BlendFunction.SCREEN}
              offset={chromaticOffset}
            />
          ) : (
            <group />
          )}
          {glitchActive ? (
            <Glitch
              delay={new THREE.Vector2(0, 0)}
              duration={new THREE.Vector2(0.2, 0.4)}
              strength={new THREE.Vector2(0.8, 1.2)}
              mode={GlitchMode.CONSTANT_WILD}
            />
          ) : (
            <group />
          )}
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={isTraveling ? 80 : 0.8}
        />
      </Canvas>
    </div>
  );
}
