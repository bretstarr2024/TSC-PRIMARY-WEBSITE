// @ts-nocheck
'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Icosahedron, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function CursorReactiveParticles() {
  const ref = useRef<THREE.Points>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const { positions, basePositions, colors } = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const tangerine = new THREE.Color('#FF5910');
    const tidal = new THREE.Color('#73F5FF');
    const cactus = new THREE.Color('#E1FF00');
    const sprinkles = new THREE.Color('#ED0AD2');

    const palette = [tangerine, tangerine, tangerine, tidal, cactus, sprinkles];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    return { positions, basePositions, colors };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;

    ref.current.rotation.y = time * 0.03;
    ref.current.rotation.x = Math.sin(time * 0.02) * 0.1;

    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    const mx = mouseRef.current.x * viewport.width * 0.5;
    const my = mouseRef.current.y * viewport.height * 0.5;

    for (let i = 0; i < posArray.length; i += 3) {
      const bx = basePositions[i];
      const by = basePositions[i + 1];
      const bz = basePositions[i + 2];

      const dx = bx - mx;
      const dy = by - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 3;

      if (dist < repelRadius) {
        const force = (1 - dist / repelRadius) * 1.5;
        posArray[i] = bx + dx * force * 0.3;
        posArray[i + 1] = by + dy * force * 0.3;
      } else {
        posArray[i] += (bx - posArray[i]) * 0.05;
        posArray[i + 1] += (by - posArray[i + 1]) * 0.05;
      }
      posArray[i + 2] += (bz - posArray[i + 2]) * 0.05;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

function FloatingWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#FF5910',
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Icosahedron ref={meshRef} args={[2, 1]} material={material} />
    </Float>
  );
}

function InnerGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#73F5FF',
      transparent: true,
      opacity: 0.08,
    });
  }, []);

  return <Sphere ref={meshRef} args={[1, 32, 32]} material={material} />;
}

function Scene() {
  const light = useMemo(() => new THREE.AmbientLight(0xffffff, 0.3), []);

  return (
    <>
      <primitive object={light} />
      <CursorReactiveParticles />
      <FloatingWireframe />
      <InnerGlow />
    </>
  );
}

export function HeroParticles() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pause rendering when off-screen to save GPU cycles
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        frameloop={visible ? 'always' : 'never'}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
