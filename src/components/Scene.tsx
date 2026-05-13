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
  const segments = 25;
  const radius = 15;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    group.current.position.z = (time * 65) % 15;
    group.current.rotation.z = time * 0.3;
  });

  return (
    <group ref={group}>
      {[...Array(segments)].map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 8]} rotation={[0, 0, i * 0.4]}>
          <torusGeometry args={[radius, 0.03, 16, 100]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.4} />
        </mesh>
      ))}
      <Stars radius={50} depth={50} count={12000} factor={25} saturation={0} fade speed={12} />
    </group>
  );
}

function Starfield() {
  return (
    <Stars
      radius={100}
      depth={50}
      count={6000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}

function Particles({ count = 2000, speed = 1 }) {
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
    points.current.rotation.y = time * 0.04 * speed;
    points.current.rotation.z = time * 0.02 * speed;
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
      <pointsMaterial size={0.04} color="#818cf8" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function FloatingCore({ isTraveling }: { isTraveling: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (isTraveling) {
      meshRef.current.rotation.y = time * 6;
      meshRef.current.rotation.z = time * 3;
      outerRef.current.rotation.x = -time * 2;
    } else {
      outerRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <Float speed={isTraveling ? 12 : 2} rotationIntensity={isTraveling ? 8 : 0.5} floatIntensity={isTraveling ? 4 : 1}>
      <group>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[4, 15]} />
          <MeshDistortMaterial
            color={isTraveling ? "#ffffff" : "#4f46e5"}
            speed={isTraveling ? 8 : 2}
            distort={isTraveling ? 0.7 : 0.4}
            roughness={0.1}
            metalness={1}
            emissive={isTraveling ? "#818cf8" : "#000000"}
            emissiveIntensity={isTraveling ? 3 : 0}
          />
        </mesh>
        <mesh ref={outerRef}>
           <icosahedronGeometry args={[5.5, 2]} />
           <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

export default function Scene({ isTraveling }: { isTraveling: boolean }) {
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.05, 0.05), []);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setGlitchActive(true);
    const timer = setTimeout(() => setGlitchActive(false), 800);
    return () => clearTimeout(timer);
  }, [isTraveling]);

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={75} />
        <color attach="background" args={["#000000"]} />

        <ambientLight intensity={0.2} />
        <spotLight position={[15, 15, 15]} angle={0.15} penumbra={1} intensity={2.5} color="#818cf8" />
        <pointLight position={[-15, -15, -15]} intensity={1.5} color="#a855f7" />

        {isTraveling ? (
          <HyperTunnel />
        ) : (
          <>
            <Starfield />
            <Particles count={3500} speed={1} />
          </>
        )}

        <FloatingCore isTraveling={isTraveling} />

        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.1}
            mipmapBlur
            intensity={isTraveling ? 5 : 2}
            radius={0.4}
          />
          <Noise opacity={0.1} />
          <Vignette eskil={false} offset={0.1} darkness={1.3} />
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
              duration={new THREE.Vector2(0.1, 0.3)}
              strength={new THREE.Vector2(0.5, 1.0)}
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
          autoRotateSpeed={isTraveling ? 60 : 0.6}
        />
      </Canvas>
    </div>
  );
}
