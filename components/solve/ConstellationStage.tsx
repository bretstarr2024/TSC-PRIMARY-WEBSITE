// @ts-nocheck
'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

/**
 * Stage 2 — Constellations Forming
 * Scattered stars begin connecting into clusters via lines.
 * Clusters represent buyer questions, problem spaces, opportunity clusters.
 * As user scrolls, connections tighten and labels fade in.
 */

const CLUSTER_LABELS = [
  'Buyer Questions',
  'Problem Spaces',
  'Opportunity Clusters',
  'Intent Signals',
  'Competitive Gaps',
];

const CLUSTER_COLORS = [
  new THREE.Color('#73F5FF'),
  new THREE.Color('#FF5910'),
  new THREE.Color('#E1FF00'),
  new THREE.Color('#ED0AD2'),
  new THREE.Color('#FFBDAE'),
];

// Generate cluster centers and star positions
function generateClusters(count: number, clusterCount: number) {
  const clusterCenters: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < clusterCount; i++) {
    const y = 1 - (i / (clusterCount - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    clusterCenters.push(
      new THREE.Vector3(
        Math.cos(theta) * radius * 3.5,
        y * 2.5,
        Math.sin(theta) * radius * 2 - 1
      )
    );
  }

  const positions = new Float32Array(count * 3);
  const scatteredPositions = new Float32Array(count * 3);
  const clusteredPositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const clusterAssignments = new Int32Array(count);
  const starsPerCluster = Math.floor(count / clusterCount);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const clusterIdx = Math.min(Math.floor(i / starsPerCluster), clusterCount - 1);
    clusterAssignments[i] = clusterIdx;
    const center = clusterCenters[clusterIdx];
    const color = CLUSTER_COLORS[clusterIdx];

    // Scattered positions — wide spread
    const sTheta = Math.random() * Math.PI * 2;
    const sPhi = Math.acos(2 * Math.random() - 1);
    const sR = 3 + Math.random() * 5;
    scatteredPositions[i3] = sR * Math.sin(sPhi) * Math.cos(sTheta);
    scatteredPositions[i3 + 1] = sR * Math.sin(sPhi) * Math.sin(sTheta);
    scatteredPositions[i3 + 2] = sR * Math.cos(sPhi);

    // Clustered positions — tight around center
    const cR = 0.3 + Math.random() * 0.8;
    const cTheta = Math.random() * Math.PI * 2;
    const cPhi = Math.acos(2 * Math.random() - 1);
    clusteredPositions[i3] = center.x + cR * Math.sin(cPhi) * Math.cos(cTheta);
    clusteredPositions[i3 + 1] = center.y + cR * Math.sin(cPhi) * Math.sin(cTheta);
    clusteredPositions[i3 + 2] = center.z + cR * Math.cos(cPhi);

    // Start scattered
    positions[i3] = scatteredPositions[i3];
    positions[i3 + 1] = scatteredPositions[i3 + 1];
    positions[i3 + 2] = scatteredPositions[i3 + 2];

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  return { positions, scatteredPositions, clusteredPositions, colors, clusterAssignments, clusterCenters };
}

function ConstellationParticles({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 600 : 1200;
  const clusterCount = CLUSTER_LABELS.length;

  const data = useMemo(() => generateClusters(count, clusterCount), [count, clusterCount]);

  // Build line connections between nearby stars in same cluster
  const linePositions = useMemo(() => {
    const maxLines = count * 2;
    return new Float32Array(maxLines * 6);
  }, [count]);

  const lineColors = useMemo(() => {
    const maxLines = count * 2;
    return new Float32Array(maxLines * 6);
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;
    const time = state.clock.elapsedTime;
    const t = Math.max(0, Math.min(1, progress));

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Interpolate positions
    for (let i = 0; i < count * 3; i++) {
      posArray[i] = data.scatteredPositions[i] + (data.clusteredPositions[i] - data.scatteredPositions[i]) * t;
    }

    // Add subtle drift
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += Math.sin(time * 0.5 + i * 0.1) * 0.02 * (1 - t * 0.5);
      posArray[i3 + 1] += Math.cos(time * 0.3 + i * 0.15) * 0.02 * (1 - t * 0.5);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Update lines — only show when progress > 0.2, connect nearby stars in same cluster
    let lineIdx = 0;
    const connectionThreshold = 2.5 - t * 1.5; // Tighter as clusters form

    if (t > 0.15) {
      const lineOpacity = Math.min(1, (t - 0.15) / 0.3);

      for (let i = 0; i < count && lineIdx < count * 2; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < Math.min(i + 15, count) && lineIdx < count * 2; j++) {
          if (data.clusterAssignments[i] !== data.clusterAssignments[j]) continue;
          const j3 = j * 3;
          const dx = posArray[i3] - posArray[j3];
          const dy = posArray[i3 + 1] - posArray[j3 + 1];
          const dz = posArray[i3 + 2] - posArray[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionThreshold) {
            const l6 = lineIdx * 6;
            linePositions[l6] = posArray[i3];
            linePositions[l6 + 1] = posArray[i3 + 1];
            linePositions[l6 + 2] = posArray[i3 + 2];
            linePositions[l6 + 3] = posArray[j3];
            linePositions[l6 + 4] = posArray[j3 + 1];
            linePositions[l6 + 5] = posArray[j3 + 2];

            const color = CLUSTER_COLORS[data.clusterAssignments[i]];
            const alpha = lineOpacity * (1 - dist / connectionThreshold) * 0.5;
            lineColors[l6] = color.r * alpha;
            lineColors[l6 + 1] = color.g * alpha;
            lineColors[l6 + 2] = color.b * alpha;
            lineColors[l6 + 3] = color.r * alpha;
            lineColors[l6 + 4] = color.g * alpha;
            lineColors[l6 + 5] = color.b * alpha;

            lineIdx++;
          }
        }
      }
    }

    // Zero out remaining lines
    for (let i = lineIdx * 6; i < linePositions.length; i++) {
      linePositions[i] = 0;
      lineColors[i] = 0;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
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
          size={0.04}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </points>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={linePositions} count={linePositions.length / 3} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={lineColors} count={lineColors.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial
          transparent
          vertexColors
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </lineSegments>
    </>
  );
}

function ConstellationScene({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <ConstellationParticles progress={progress} />
    </>
  );
}

export function ConstellationStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const progress = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.4, 0.65], [0, 1]);

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

  // Track progress value for Three.js scene
  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    const unsubscribe = progress.on('change', (v) => setProgressValue(v));
    return unsubscribe;
  }, [progress]);

  return (
    <section ref={containerRef} className="relative h-[120vh] -mb-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1118] via-[#0a0e1a] to-[#0c1118]" />
      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-[2]" style={{ background: 'linear-gradient(to bottom, transparent, #0c1118)' }} />

      {/* Canvas */}
      <div className="sticky top-0 h-screen w-full">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            frameloop={visible ? 'always' : 'never'}
            className="absolute inset-0"
          >
            <ConstellationScene progress={progressValue} />
          </Canvas>
        )}

        {/* Cluster labels — fade in as constellations form */}
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ opacity: labelOpacity }}
        >
          <div className="relative w-full max-w-4xl h-[500px]">
            {CLUSTER_LABELS.map((label, i) => {
              const angle = (i / CLUSTER_LABELS.length) * Math.PI * 2 - Math.PI / 2;
              const rx = 38 + Math.cos(angle) * 8;
              const ry = 42 + Math.sin(angle) * 30;
              return (
                <div
                  key={label}
                  className="absolute text-xs md:text-sm font-bold uppercase tracking-widest whitespace-nowrap"
                  style={{
                    left: `${rx}%`,
                    top: `${ry}%`,
                    color: CLUSTER_COLORS[i].getStyle(),
                    textShadow: `0 0 20px ${CLUSTER_COLORS[i].getStyle()}`,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
