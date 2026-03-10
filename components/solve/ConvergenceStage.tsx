// @ts-nocheck
'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

/**
 * Stage 3 — Signals Converging
 * Clusters move toward center, forming faceted geometry.
 * The geometry morphs into a bright, glowing polyhedron (the GTM Kernel).
 * Brightness peaks here — warm, radiant, celebratory.
 */

const CLUSTER_COLORS = [
  new THREE.Color('#73F5FF'),
  new THREE.Color('#FF5910'),
  new THREE.Color('#E1FF00'),
  new THREE.Color('#ED0AD2'),
  new THREE.Color('#FFBDAE'),
];

function ConvergingParticles({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const icoRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 800 : 1600;
  const clusterCount = 5;

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const clusterPositions = new Float32Array(count * 3);
    const convergedPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const starsPerCluster = Math.floor(count / clusterCount);

    // Cluster start positions (spread out)
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const clusterCenters: THREE.Vector3[] = [];
    for (let c = 0; c < clusterCount; c++) {
      const y = 1 - (c / (clusterCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * c;
      clusterCenters.push(
        new THREE.Vector3(
          Math.cos(theta) * radius * 3,
          y * 2.5,
          Math.sin(theta) * radius * 1.5
        )
      );
    }

    // Icosahedron vertices for converged targets
    const icoGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const icoVerts = icoGeo.attributes.position.array;
    const numIcoVerts = icoVerts.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const clusterIdx = Math.min(Math.floor(i / starsPerCluster), clusterCount - 1);
      const center = clusterCenters[clusterIdx];
      const color = CLUSTER_COLORS[clusterIdx];

      // Cluster positions (start)
      const r = 0.3 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      clusterPositions[i3] = center.x + r * Math.sin(phi) * Math.cos(theta);
      clusterPositions[i3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta);
      clusterPositions[i3 + 2] = center.z + r * Math.cos(phi);

      // Converged — on icosahedron surface with slight jitter
      const vertIdx = (i % numIcoVerts) * 3;
      const jitter = 0.15;
      convergedPositions[i3] = icoVerts[vertIdx] + (Math.random() - 0.5) * jitter;
      convergedPositions[i3 + 1] = icoVerts[vertIdx + 1] + (Math.random() - 0.5) * jitter;
      convergedPositions[i3 + 2] = icoVerts[vertIdx + 2] + (Math.random() - 0.5) * jitter;

      positions[i3] = clusterPositions[i3];
      positions[i3 + 1] = clusterPositions[i3 + 1];
      positions[i3 + 2] = clusterPositions[i3 + 2];

      // Shift colors toward white/warm as they converge
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    icoGeo.dispose();
    return { positions, clusterPositions, convergedPositions, colors };
  }, [count, clusterCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const t = Math.max(0, Math.min(1, progress));

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colArray = pointsRef.current.geometry.attributes.color.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Interpolate cluster → converged
      posArray[i3] = data.clusterPositions[i3] + (data.convergedPositions[i3] - data.clusterPositions[i3]) * t;
      posArray[i3 + 1] = data.clusterPositions[i3 + 1] + (data.convergedPositions[i3 + 1] - data.clusterPositions[i3 + 1]) * t;
      posArray[i3 + 2] = data.clusterPositions[i3 + 2] + (data.convergedPositions[i3 + 2] - data.clusterPositions[i3 + 2]) * t;

      // Subtle orbital motion when converged
      if (t > 0.5) {
        const orbitalStrength = (t - 0.5) * 2;
        const angle = time * 0.3 + i * 0.01;
        posArray[i3] += Math.sin(angle) * 0.05 * orbitalStrength;
        posArray[i3 + 1] += Math.cos(angle * 0.7) * 0.05 * orbitalStrength;
      }

      // Colors warm up as convergence happens
      const warmth = t * 0.4;
      colArray[i3] = Math.min(1, data.colors[i3] + warmth);
      colArray[i3 + 1] = Math.min(1, data.colors[i3 + 1] + warmth * 0.5);
      colArray[i3 + 2] = Math.min(1, data.colors[i3 + 2] + warmth * 0.3);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;

    // Rotate the whole system slowly
    pointsRef.current.rotation.y = time * 0.1;

    // Icosahedron wireframe — appears and brightens
    if (icoRef.current) {
      const icoOpacity = Math.max(0, (t - 0.4) / 0.6);
      icoRef.current.material.opacity = icoOpacity * 0.35;
      icoRef.current.rotation.y = time * 0.15;
      icoRef.current.rotation.x = time * 0.1;
      const s = 0.5 + t * 1;
      icoRef.current.scale.set(s, s, s);
    }

    // Inner glow sphere
    if (glowRef.current) {
      const glowOpacity = Math.max(0, (t - 0.5) / 0.5);
      glowRef.current.material.opacity = glowOpacity * 0.2;
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      const gs = (0.3 + t * 1.2) * pulse;
      glowRef.current.scale.set(gs, gs, gs);
    }
  });

  return (
    <>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={data.positions} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={data.colors} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          transparent
          vertexColors
          size={0.045}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.95}
        />
      </points>

      {/* Wireframe icosahedron — the GTM Kernel shape forming */}
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#FF5910"
          wireframe
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#FF5910"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

function ConvergenceScene({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <ConvergingParticles progress={progress} />
    </>
  );
}

export function ConvergenceStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const progress = useTransform(scrollYProgress, [0.05, 0.6], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  useEffect(() => {
    const cb = () => setMounted(true);
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(cb, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(cb, 200);
    return () => clearTimeout(id);
  }, []);

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

  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    const unsubscribe = progress.on('change', (v) => setProgressValue(v));
    return unsubscribe;
  }, [progress]);

  return (
    <section ref={containerRef} className="relative h-[120vh] overflow-hidden">
      {/* Background — warming up */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1118] via-[#120c10] to-[#1a0e08]" />

      {/* Warm nebula glow behind the forming shape */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,89,16,0.3) 0%, rgba(237,10,210,0.15) 50%, transparent 70%)',
          opacity: useTransform(scrollYProgress, [0.3, 0.8], [0, 0.8]),
        }}
      />

      <div className="sticky top-0 h-screen w-full">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            frameloop={visible ? 'always' : 'never'}
            className="absolute inset-0"
          >
            <ConvergenceScene progress={progressValue} />
          </Canvas>
        )}

        {/* Top label — above the orb */}
        <motion.div
          className="absolute top-[6vh] left-0 right-0 pointer-events-none flex justify-center z-10"
          style={{ opacity: textOpacity }}
        >
          <p className="text-[14px] font-bold text-atomic-tangerine uppercase tracking-[4px]">
            Signals Converging
          </p>
        </motion.div>

        {/* Bottom text — below the orb */}
        <motion.div
          className="absolute bottom-[6vh] left-0 right-0 pointer-events-none flex justify-center z-10"
          style={{ opacity: textOpacity }}
        >
          <p className="text-3xl md:text-4xl lg:text-5xl font-normal text-white text-center max-w-2xl leading-tight">
            The system{' '}
            <span className="font-extrabold">takes shape.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
