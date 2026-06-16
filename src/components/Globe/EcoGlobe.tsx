/**
 * Interactive 3D wireframe globe with colored emission data points.
 * Clean geometric style — no photo textures.
 */

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface RegionData {
  name: string;
  lat: number;
  lng: number;
  co2PerCapita: number;
  gridFactor: number;
  population: string;
}

const REGIONS: RegionData[] = [
  { name: 'India', lat: 20.5, lng: 78.9, co2PerCapita: 1.9, gridFactor: 0.71, population: '1.4B' },
  { name: 'China', lat: 35.8, lng: 104.1, co2PerCapita: 8.0, gridFactor: 0.58, population: '1.4B' },
  { name: 'United States', lat: 37.1, lng: -95.7, co2PerCapita: 14.7, gridFactor: 0.38, population: '336M' },
  { name: 'Germany', lat: 51.1, lng: 10.4, co2PerCapita: 8.1, gridFactor: 0.35, population: '84M' },
  { name: 'Brazil', lat: -14.2, lng: -51.9, co2PerCapita: 2.3, gridFactor: 0.08, population: '216M' },
  { name: 'Nigeria', lat: 9.0, lng: 8.6, co2PerCapita: 0.6, gridFactor: 0.43, population: '224M' },
  { name: 'Australia', lat: -25.2, lng: 133.7, co2PerCapita: 15.0, gridFactor: 0.66, population: '26M' },
  { name: 'Japan', lat: 36.2, lng: 138.2, co2PerCapita: 8.5, gridFactor: 0.47, population: '125M' },
  { name: 'UK', lat: 55.3, lng: -3.4, co2PerCapita: 5.2, gridFactor: 0.21, population: '67M' },
  { name: 'Saudi Arabia', lat: 23.8, lng: 45.0, co2PerCapita: 18.7, gridFactor: 0.72, population: '36M' },
  { name: 'Canada', lat: 56.1, lng: -106.3, co2PerCapita: 14.2, gridFactor: 0.12, population: '40M' },
  { name: 'Russia', lat: 61.5, lng: 105.3, co2PerCapita: 11.4, gridFactor: 0.33, population: '144M' },
  { name: 'South Africa', lat: -30.5, lng: 22.9, co2PerCapita: 6.7, gridFactor: 0.87, population: '60M' },
  { name: 'Indonesia', lat: -0.7, lng: 113.9, co2PerCapita: 2.1, gridFactor: 0.76, population: '277M' },
  { name: 'France', lat: 46.2, lng: 2.2, co2PerCapita: 4.5, gridFactor: 0.05, population: '68M' },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function getEmissionColor(co2: number): string {
  if (co2 <= 3) return '#10B981';
  if (co2 <= 8) return '#F59E0B';
  if (co2 <= 14) return '#F97316';
  return '#EF4444';
}

function WireframeGlobe({ onHover }: { onHover: (region: RegionData | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  const points = useMemo(() => {
    return REGIONS.map(region => ({
      region,
      pos: latLngToVector3(region.lat, region.lng, 1.01),
      color: getEmissionColor(region.co2PerCapita),
      size: 0.015 + (region.co2PerCapita / 20) * 0.02,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main wireframe sphere */}
      <mesh>
        <sphereGeometry args={[1, 36, 36]} />
        <meshBasicMaterial wireframe color="#10B981" opacity={0.12} transparent />
      </mesh>

      {/* Second wireframe for depth */}
      <mesh rotation={[0, Math.PI / 6, 0]}>
        <sphereGeometry args={[0.99, 18, 18]} />
        <meshBasicMaterial wireframe color="#10B981" opacity={0.06} transparent />
      </mesh>

      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.005, 1.01, 64]} />
        <meshBasicMaterial color="#10B981" opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Latitude lines */}
      {[-60, -30, 30, 60].map(lat => {
        const r = Math.cos((lat * Math.PI) / 180);
        const y = Math.sin((lat * Math.PI) / 180);
        return (
          <mesh key={lat} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.002, r + 0.002, 48]} />
            <meshBasicMaterial color="#10B981" opacity={0.08} transparent side={THREE.DoubleSide} />
          </mesh>
        );
      })}

      {/* Data points */}
      {points.map(({ region, pos, color, size }) => (
        <group key={region.name} position={pos}>
          {/* Glowing dot */}
          <mesh
            onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover(region); }}
            onPointerOut={() => { document.body.style.cursor = 'default'; onHover(null); }}
          >
            <sphereGeometry args={[size, 12, 12]} />
            <meshBasicMaterial color={color} />
          </mesh>
          {/* Outer glow ring */}
          <mesh>
            <ringGeometry args={[size + 0.005, size + 0.015, 16]} />
            <meshBasicMaterial color={color} opacity={0.4} transparent side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function EcoGlobe() {
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);

  return (
    <div className="relative w-full aspect-square max-w-[480px] mx-auto">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[60%] h-[60%] rounded-full" style={{ background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)' }} />
      </div>

      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} style={{ background: 'transparent' }} gl={{ antialias: true, alpha: true }}>
        <WireframeGlobe onHover={setHoveredRegion} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI * 2.5 / 3.5} />
      </Canvas>

      {/* Tooltip */}
      {hoveredRegion && (
        <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-56 card p-4 animate-scale-in z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ background: getEmissionColor(hoveredRegion.co2PerCapita), boxShadow: `0 0 6px ${getEmissionColor(hoveredRegion.co2PerCapita)}` }} />
            <h3 className="font-bold text-sm text-[var(--text)]">{hoveredRegion.name}</h3>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-[var(--text-muted)]">CO₂/capita</span><span className="font-semibold text-[var(--text)]">{hoveredRegion.co2PerCapita} t/yr</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-muted)]">Grid factor</span><span className="font-semibold text-[var(--text)]">{hoveredRegion.gridFactor} kg/kWh</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-muted)]">Population</span><span className="font-semibold text-[var(--text)]">{hoveredRegion.population}</span></div>
          </div>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min((hoveredRegion.co2PerCapita / 20) * 100, 100)}%`, background: getEmissionColor(hoveredRegion.co2PerCapita) }} />
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[9px] text-[var(--text-muted)] card !rounded-full !p-2 !px-4">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981]" /> Low</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F97316]" /> High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Critical</span>
      </div>
    </div>
  );
}
