/**
 * Interactive 3D globe with world map texture showing global CO₂ emission data points.
 * Hovering a region displays its emission info in a tooltip.
 */

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

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

const EARTH_MAP_URL = 'https://unpkg.com/three-globe@2.34.1/example/img/earth-blue-marble.jpg';
const EARTH_TOPOLOGY_URL = 'https://unpkg.com/three-globe@2.34.1/example/img/earth-topology.png';

function GlobeWithMap({ onHover }: { onHover: (region: RegionData | null) => void }) {
  const globeRef = useRef<THREE.Group>(null);
  const earthTexture = useLoader(TextureLoader, EARTH_MAP_URL);
  const bumpTexture = useLoader(TextureLoader, EARTH_TOPOLOGY_URL);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  const pointMeshes = useMemo(() => {
    return REGIONS.map(region => {
      const pos = latLngToVector3(region.lat, region.lng, 1.015);
      const color = getEmissionColor(region.co2PerCapita);
      return { region, pos, color };
    });
  }, []);

  function handlePointerOver(e: ThreeEvent<PointerEvent>, region: RegionData) {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    onHover(region);
  }

  function handlePointerOut() {
    document.body.style.cursor = 'default';
    onHover(null);
  }

  return (
    <group ref={globeRef}>
      {/* Earth sphere with real map texture */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.03}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Atmosphere glow ring */}
      <mesh>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshBasicMaterial
          color="#10B981"
          opacity={0.04}
          transparent
          side={THREE.BackSide}
        />
      </mesh>

      {/* Data point markers */}
      {pointMeshes.map(({ region, pos, color }) => (
        <group key={region.name} position={pos}>
          {/* Main dot */}
          <mesh
            onPointerOver={(e) => handlePointerOver(e, region)}
            onPointerOut={handlePointerOut}
          >
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
          {/* Outer pulse ring */}
          <mesh>
            <ringGeometry args={[0.025, 0.04, 24]} />
            <meshBasicMaterial color={color} opacity={0.5} transparent side={THREE.DoubleSide} />
          </mesh>
          {/* Vertical beam */}
          <mesh position={[0, 0, 0.03]}>
            <cylinderGeometry args={[0.002, 0.002, 0.04, 8]} />
            <meshBasicMaterial color={color} opacity={0.6} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function EcoGlobe() {
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      {/* Ambient glow behind globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[70%] h-[70%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 42 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 3, 5]} intensity={0.8} />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} />
        <GlobeWithMap onHover={setHoveredRegion} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI * 2.5 / 3.5}
        />
      </Canvas>

      {/* Tooltip card */}
      {hoveredRegion && (
        <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64 liquid-glass p-4 animate-scale-in z-10">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ background: getEmissionColor(hoveredRegion.co2PerCapita), boxShadow: `0 0 8px ${getEmissionColor(hoveredRegion.co2PerCapita)}` }}
            />
            <h3 className="font-bold text-sm text-[var(--text)]">{hoveredRegion.name}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">CO₂ per capita</span>
              <span className="font-bold text-[var(--text)]">{hoveredRegion.co2PerCapita} t/year</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Grid emission factor</span>
              <span className="font-bold text-[var(--text)]">{hoveredRegion.gridFactor} kg/kWh</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Population</span>
              <span className="font-bold text-[var(--text)]">{hoveredRegion.population}</span>
            </div>
          </div>
          {/* Emission bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[9px] text-[var(--text-muted)] mb-1">
              <span>Emissions level</span>
              <span>Global avg: 4.7 t</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((hoveredRegion.co2PerCapita / 20) * 100, 100)}%`,
                  background: `linear-gradient(90deg, #10B981, ${getEmissionColor(hoveredRegion.co2PerCapita)})`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] text-[var(--text-muted)] glass rounded-full px-4 py-2">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> &lt;3t</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> 3-8t</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" /> 8-14t</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> &gt;14t</span>
      </div>
    </div>
  );
}
