import { useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { X } from "lucide-react";
import { TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";

// ---------------------------------------------------------------------------
// Hardcoded town feature data
// ---------------------------------------------------------------------------

interface TownFeature {
  id: string;
  label: string;
  emoji: string;
  topic: string;
  position: [number, number, number];
  description: string;
  ballotRef: string;
}

const FEATURES: TownFeature[] = [
  {
    id: "tree",
    label: "City Park",
    emoji: "🌳",
    topic: "environment",
    position: [-3.5, 0, -1.5],
    description:
      "Question 2 keeps water systems public, protecting the funding that maintains parks and green infrastructure. Public water management ensures city trees and green spaces receive reliable, affordable service — rather than being subject to private utility cost-cutting.",
    ballotRef: "Ballot Question 2 · Environment",
  },
  {
    id: "fountain",
    label: "Public Fountain",
    emoji: "⛲",
    topic: "water",
    position: [0, 0, 0],
    description:
      "Question 2 permanently blocks privatization of Pittsburgh's water and sewer systems. Communities across PA where water was privatized saw 30–50% rate increases within a few years. This fountain represents public infrastructure that stays accountable to voters.",
    ballotRef: "Ballot Question 2 · Water & Utilities",
  },
  {
    id: "bike",
    label: "Bike Lane",
    emoji: "🚲",
    topic: "transit",
    position: [4, 0, 1.5],
    description:
      "The next mayor shapes transportation policy. Democrat Corey O'Connor advocates for better neighborhood connections and Port Authority funding, while Republican Tony Moreno focuses on road infrastructure and reducing commute times.",
    ballotRef: "Mayor's Race · Transportation",
  },
  {
    id: "house",
    label: "Neighborhood Home",
    emoji: "🏠",
    topic: "housing",
    position: [-4, 0, 3.5],
    description:
      "Water and sewer costs are a significant part of monthly housing expenses. Question 2 helps stabilize utility costs for homeowners and renters, as private utilities in PA have frequently raised rates after acquiring public systems.",
    ballotRef: "Ballot Question 2 · Housing",
  },
  {
    id: "townhall",
    label: "City Hall",
    emoji: "🏛️",
    topic: "government",
    position: [3.5, 0, -3],
    description:
      "All three ballot questions amend Pittsburgh's Home Rule Charter. Question 1 adds anti-discrimination protections. Question 2 blocks water privatization. Question 3 limits future citizen-initiated charter amendments — two council members voted against it, citing concerns about restricting democratic participation.",
    ballotRef: "Questions 1, 2 & 3 · Government Reform",
  },
];

// ---------------------------------------------------------------------------
// Reusable pointer-event handlers
// ---------------------------------------------------------------------------

function useFeatureEvents(
  featureId: string,
  isSelected: boolean,
  onSelect: (id: string | null) => void,
  onHover: (id: string | null) => void,
) {
  return {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(isSelected ? null : featureId);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
      onHover(featureId);
    },
    onPointerOut: () => {
      document.body.style.cursor = "auto";
      onHover(null);
    },
  };
}

// ---------------------------------------------------------------------------
// Geometry components
// ---------------------------------------------------------------------------

function TreeGeometry({ hovered }: { hovered: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 1, 8]} />
        <meshStandardMaterial color="#6d4c41" />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.6, 10, 8]} />
        <meshStandardMaterial
          color={hovered ? "#66bb6a" : "#43a047"}
          emissive={hovered ? "#2e7d32" : "#000000"}
          emissiveIntensity={hovered ? 0.25 : 0}
        />
      </mesh>
      {/* Second smaller tree */}
      <mesh position={[1.1, 0.35, 0.4]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.7, 8]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      <mesh position={[1.1, 0.95, 0.4]} castShadow>
        <sphereGeometry args={[0.4, 10, 8]} />
        <meshStandardMaterial
          color={hovered ? "#81c784" : "#66bb6a"}
          emissive={hovered ? "#2e7d32" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      {/* Park bench */}
      <mesh position={[0.5, 0.2, 0.8]} castShadow>
        <boxGeometry args={[0.7, 0.04, 0.25]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh position={[0.5, 0.1, 0.65]}>
        <boxGeometry args={[0.7, 0.2, 0.04]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
    </group>
  );
}

function FountainGeometry({ hovered }: { hovered: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.3, 16]} />
        <meshStandardMaterial color={hovered ? "#b0bec5" : "#9e9e9e"} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.2, 16]} />
        <meshStandardMaterial color="#78909c" />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.04, 16]} />
        <meshStandardMaterial color={hovered ? "#64b5f6" : "#42a5f5"} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.04, 0.07, 0.3, 8]} />
        <meshStandardMaterial color="#bdbdbd" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.07, 8, 6]} />
        <meshStandardMaterial color="#90caf9" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function BikeGeometry({ hovered }: { hovered: boolean }) {
  const color = hovered ? "#78909c" : "#607d8b";
  return (
    <group rotation={[0, Math.PI / 6, 0]}>
      {/* Wheels */}
      <mesh position={[-0.32, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.03, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.32, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.03, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.55, 0.035, 0.035]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.1, 0.42, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.25, 0.03, 0.03]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[-0.28, 0.5, 0]}>
        <boxGeometry args={[0.03, 0.18, 0.22]} />
        <meshStandardMaterial color="#455a64" />
      </mesh>
      {/* Seat */}
      <mesh position={[0.18, 0.5, 0]}>
        <boxGeometry args={[0.12, 0.03, 0.08]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      {/* Bike lane stripe */}
      <mesh position={[0, 0.011, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 2.2]} />
        <meshStandardMaterial color="#fff176" />
      </mesh>
    </group>
  );
}

function HouseGeometry({ hovered }: { hovered: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.1, 1.1, 0.9]} />
        <meshStandardMaterial color={hovered ? "#ffe0b2" : "#ffcc80"} />
      </mesh>
      <mesh position={[0, 1.32, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.9, 0.55, 4]} />
        <meshStandardMaterial color="#a1887f" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.3, 0.46]}>
        <boxGeometry args={[0.25, 0.55, 0.02]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {/* Window */}
      <mesh position={[0.3, 0.7, 0.46]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial color="#bbdefb" />
      </mesh>
      <mesh position={[-0.3, 0.7, 0.46]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial color="#bbdefb" />
      </mesh>
    </group>
  );
}

function TownHallGeometry({ hovered }: { hovered: boolean }) {
  return (
    <group>
      {/* Steps */}
      <mesh position={[0, 0.06, 0.8]} castShadow>
        <boxGeometry args={[2.2, 0.12, 0.6]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      {/* Main building */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2, 1.4, 1.4]} />
        <meshStandardMaterial color={hovered ? "#d7ccc8" : "#bcaaa4"} />
      </mesh>
      {/* Pediment */}
      <mesh position={[0, 1.65, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.3, 0.45, 4]} />
        <meshStandardMaterial color="#a1887f" />
      </mesh>
      {/* Pillars */}
      {[-0.6, -0.2, 0.2, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.65, 0.75]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
      ))}
      {/* Clock */}
      <mesh position={[0, 1.2, 0.71]}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial color="#fff8e1" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Geometry lookup
// ---------------------------------------------------------------------------

const GEOMETRY_MAP: Record<string, React.FC<{ hovered: boolean }>> = {
  tree: TreeGeometry,
  fountain: FountainGeometry,
  bike: BikeGeometry,
  house: HouseGeometry,
  townhall: TownHallGeometry,
};

// ---------------------------------------------------------------------------
// Interactive feature wrapper (lives inside Canvas)
// ---------------------------------------------------------------------------

interface FeatureGroupProps {
  feature: TownFeature;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

function FeatureGroup({ feature, isSelected, onSelect, hoveredId, onHover }: FeatureGroupProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const isHovered = hoveredId === feature.id;
  const events = useFeatureEvents(feature.id, isSelected, onSelect, onHover);
  const Geom = GEOMETRY_MAP[feature.id];

  // Gentle bob when selected
  useFrame(() => {
    if (!groupRef.current) return;
    const target = isSelected ? Math.sin(Date.now() * 0.003) * 0.08 : 0;
    groupRef.current.position.y += (target - groupRef.current.position.y) * 0.1;
  });

  return (
    <group position={feature.position}>
      <group ref={groupRef}>
        {/* Invisible enlarged click target */}
        <mesh visible={false} {...events}>
          <boxGeometry args={[2.2, 3, 2.2]} />
        </mesh>

        {Geom && <Geom hovered={isHovered || isSelected} />}

        {/* Selection / hover ring on ground */}
        {(isSelected || isHovered) && (
          <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.95, 1.15, 32]} />
            <meshBasicMaterial
              color={TOPIC_COLORS[feature.topic] ? hsl(TOPIC_COLORS[feature.topic]) : "#ffffff"}
              transparent
              opacity={isSelected ? 0.65 : 0.35}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Decorative (non-interactive) buildings
// ---------------------------------------------------------------------------

function DecorativeBuildings() {
  const buildings: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = [
    { pos: [-1.5, 0.6, -4.5], size: [1.3, 1.2, 1], color: "#e8e0d4" },
    { pos: [0.8, 0.9, -4.5], size: [1.5, 1.8, 1.1], color: "#d7ccc8" },
    { pos: [-5, 0.45, -4], size: [1, 0.9, 0.9], color: "#efebe9" },
    { pos: [6, 0.5, -1], size: [1.2, 1, 1], color: "#e0e0e0" },
    { pos: [5.5, 0.35, 3.5], size: [1.4, 0.7, 0.9], color: "#efebe9" },
    { pos: [-6, 0.55, 1], size: [1, 1.1, 1], color: "#d7ccc8" },
  ];

  return (
    <>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos} castShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Scene (all 3D content)
// ---------------------------------------------------------------------------

interface SceneProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

function Scene({ selectedId, onSelect, hoveredId, onHover }: SceneProps) {
  return (
    <>
      {/* Sky color */}
      <color attach="background" args={["#dcedc8"]} />

      {/* Lighting */}
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[8, 14, 8]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <hemisphereLight args={["#b3e5fc", "#a5d6a7", 0.35]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#81c784" />
      </mesh>

      {/* Sidewalk paths */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 14]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Road */}
      <mesh position={[0, 0.008, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 1.8]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      {/* Road center line */}
      <mesh position={[0, 0.012, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 0.06]} />
        <meshStandardMaterial color="#fff176" />
      </mesh>

      {/* Decorative buildings */}
      <DecorativeBuildings />

      {/* Interactive features */}
      {FEATURES.map((f) => (
        <FeatureGroup
          key={f.id}
          feature={f}
          isSelected={selectedId === f.id}
          onSelect={onSelect}
          hoveredId={hoveredId}
          onHover={onHover}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI / 2.3}
        minDistance={7}
        maxDistance={20}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Info panel (pure HTML overlay)
// ---------------------------------------------------------------------------

function InfoPanel({ feature, onClose }: { feature: TownFeature; onClose: () => void }) {
  const color = TOPIC_COLORS[feature.topic];

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-xl z-10 animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-2.5 mb-3 pr-6">
        <span className="text-2xl leading-none mt-0.5">{feature.emoji}</span>
        <div>
          <h4 className="font-display font-semibold text-foreground text-sm leading-tight">
            {feature.label}
          </h4>
          <span
            className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: color ? hslAlpha(color, 0.15) : undefined,
              color: color ? hsl(color) : undefined,
            }}
          >
            {feature.topic.replace("_", " ")}
          </span>
        </div>
      </div>

      <p className="text-sm text-foreground/85 leading-relaxed mb-2">
        {feature.description}
      </p>
      <p className="text-xs text-muted-foreground">{feature.ballotRef}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function TownMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedFeature = FEATURES.find((f) => f.id === selectedId) ?? null;

  return (
    <div className="relative rounded-xl overflow-hidden border border-border bg-muted" style={{ height: 420 }}>
      <Canvas
        camera={{ position: [10, 9, 10], fov: 42 }}
        shadows
        gl={{ antialias: true }}
        // Deselect when clicking empty space
        onPointerMissed={() => setSelectedId(null)}
      >
        <Scene
          selectedId={selectedId}
          onSelect={setSelectedId}
          hoveredId={hoveredId}
          onHover={setHoveredId}
        />
      </Canvas>

      {/* Hint */}
      {!selectedFeature && (
        <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
          <span className="text-[11px] text-muted-foreground/70 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
            Click a feature to see ballot impact · Drag to rotate
          </span>
        </div>
      )}

      {/* Info panel */}
      {selectedFeature && <InfoPanel feature={selectedFeature} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
