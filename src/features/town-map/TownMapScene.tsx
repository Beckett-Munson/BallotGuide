import {
  ContactShadows,
  Environment,
  Grid,
  Html,
  Line,
  OrbitControls,
} from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Box3, Color, Material, Mesh, Object3D, Raycaster, Vector3 } from "three";
import { TOPIC_COLORS, hsl } from "@/lib/topicColors";
import CityModel from "./CityModel";
import type { CityMapConfig, CityPolicyAnnotation, ModelBounds, Vec3 } from "./types";
import { FALLBACK_MODEL_BOUNDS, mapPointToModelPosition } from "./utils";

interface TownMapSceneProps {
  city: CityMapConfig;
  annotations: CityPolicyAnnotation[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

interface MarkerProps {
  annotation: CityPolicyAnnotation;
  position: Vec3;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

interface AnnotationPlacement {
  position: Vec3;
  highlightMeshIds: string[];
}

interface MeshMeta {
  mesh: Mesh;
  nameKey: string;
  materialKey: string;
  center: Vector3;
  topY: number;
}

type HighlightMaterial = Material & {
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  userData?: Record<string, unknown>;
};

interface MaterialSnapshot {
  colorHex?: number;
  emissiveHex?: number;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
}

const BASE_SNAPSHOT_KEY = "__townMapBase";

function materialNames(mesh: Mesh): string {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials
    .map((material) => material?.name?.toLowerCase() ?? "")
    .join(" ");
}

function topicTokens(topic: string): string[] {
  switch (topic) {
    case "water":
      return ["water_", "waterway_", "water_material", "waterway_material"];
    case "transit":
      return [
        "roadwayintersection_",
        "path_",
        "asphalt_",
        "busstop_",
        "roadwayintersection_material",
        "asphalt_material",
      ];
    case "environment":
      return [
        "tree_",
        "forest_",
        "grass_",
        "garden_",
        "shrubbery_",
        "tree_material",
        "forest_material",
        "grass_material",
      ];
    default:
      return ["simple  osm buildings_", "simple  osm buildings_material"];
  }
}

function topicHighlightLimit(topic: string): number {
  if (topic === "environment") return 32;
  if (topic === "water") return 12;
  if (topic === "transit") return 16;
  return 8;
}

function ensureMaterialSnapshot(material: HighlightMaterial) {
  if (!material.userData) {
    material.userData = {};
  }

  if (material.userData[BASE_SNAPSHOT_KEY]) {
    return;
  }

  const snapshot: MaterialSnapshot = {};
  if (material.color) snapshot.colorHex = material.color.getHex();
  if (material.emissive) snapshot.emissiveHex = material.emissive.getHex();
  if (typeof material.emissiveIntensity === "number") {
    snapshot.emissiveIntensity = material.emissiveIntensity;
  }
  if (typeof material.roughness === "number") snapshot.roughness = material.roughness;
  if (typeof material.metalness === "number") snapshot.metalness = material.metalness;

  material.userData[BASE_SNAPSHOT_KEY] = snapshot;
}

function restoreMaterial(material: HighlightMaterial) {
  const snapshot = material.userData?.[BASE_SNAPSHOT_KEY] as MaterialSnapshot | undefined;
  if (!snapshot) return;

  if (material.color && typeof snapshot.colorHex === "number") {
    material.color.setHex(snapshot.colorHex);
  }
  if (material.emissive && typeof snapshot.emissiveHex === "number") {
    material.emissive.setHex(snapshot.emissiveHex);
  }
  if (typeof material.emissiveIntensity === "number" && typeof snapshot.emissiveIntensity === "number") {
    material.emissiveIntensity = snapshot.emissiveIntensity;
  }
  if (typeof material.roughness === "number" && typeof snapshot.roughness === "number") {
    material.roughness = snapshot.roughness;
  }
  if (typeof material.metalness === "number" && typeof snapshot.metalness === "number") {
    material.metalness = snapshot.metalness;
  }
}

function highlightMaterial(material: HighlightMaterial, color: Color) {
  restoreMaterial(material);
  if (material.color) {
    material.color.lerp(color, 0.35);
  }
  if (typeof material.roughness === "number") {
    material.roughness = Math.max(0.35, material.roughness - 0.25);
  }
}

function AnnotationMarker({ annotation, position, selected, onSelect }: MarkerProps) {
  const topicColor = TOPIC_COLORS[annotation.topic];
  const color = topicColor ? hsl(topicColor) : "#334155";
  const [x, y, z] = position;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(selected ? null : annotation.id);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  return (
    <group position={[x, y, z]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <ringGeometry args={[0.08, 0.14, 28]} />
        <meshBasicMaterial color={color} transparent opacity={selected ? 0.95 : 0.62} />
      </mesh>

      <Line points={[[0, 0.03, 0], [0, 0.35, 0]]} color={color} transparent opacity={0.8} />

      <Html center position={[0, 0.42, 0]} zIndexRange={[6, 0]}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(selected ? null : annotation.id);
          }}
          className="rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-md backdrop-blur-sm transition-colors"
          style={{
            backgroundColor: selected ? color : "rgba(255,255,255,0.95)",
            borderColor: color,
            color: selected ? "#ffffff" : color,
          }}
        >
          {annotation.markerLabel}
        </button>
      </Html>
    </group>
  );
}

export default function TownMapScene({
  city,
  annotations,
  selectedId,
  onSelect,
}: TownMapSceneProps) {
  const [modelBounds, setModelBounds] = useState<ModelBounds>(FALLBACK_MODEL_BOUNDS);
  const [modelObject, setModelObject] = useState<Object3D | null>(null);
  const raycaster = useMemo(() => new Raycaster(), []);
  const down = useMemo(() => new Vector3(0, -1, 0), []);

  const meshCatalog = useMemo(() => {
    if (!modelObject) {
      return {
        all: [] as MeshMeta[],
        byUuid: new Map<string, MeshMeta>(),
      };
    }

    modelObject.updateMatrixWorld(true);
    const box = new Box3();
    const center = new Vector3();
    const all: MeshMeta[] = [];
    const byUuid = new Map<string, MeshMeta>();

    modelObject.traverse((node) => {
      if (!(node instanceof Mesh)) return;

      box.setFromObject(node);
      box.getCenter(center);
      const meta: MeshMeta = {
        mesh: node,
        nameKey: node.name.toLowerCase(),
        materialKey: materialNames(node),
        center: center.clone(),
        topY: box.max.y,
      };

      all.push(meta);
      byUuid.set(node.uuid, meta);
    });

    return { all, byUuid };
  }, [modelObject]);

  const placements = useMemo(() => {
    const map = new Map<string, AnnotationPlacement>();
    const modelHeight = modelBounds.max[1] - modelBounds.min[1];
    const defaultY = modelBounds.min[1] + modelHeight * 0.35;
    const raycastStartY = modelBounds.max[1] + Math.max(2, modelHeight * 2);
    const rayOrigin = new Vector3();

    for (const annotation of annotations) {
      const [x, , z] = mapPointToModelPosition(annotation.mapPoint, modelBounds);
      const queryPoint = new Vector3(x, defaultY, z);
      const limit = topicHighlightLimit(annotation.topic);
      let candidates: MeshMeta[] = [];
      let position: Vec3 = [x, defaultY, z];

      if (modelObject && annotation.nodeNames && annotation.nodeNames.length > 0) {
        const byName = annotation.nodeNames.map((value) => value.toLowerCase());
        candidates = meshCatalog.all.filter((meta) =>
          byName.some((name) => meta.nameKey === name),
        );
      }

      if (modelObject && candidates.length === 0) {
        const tokens = topicTokens(annotation.topic);
        const layerMatches = meshCatalog.all.filter((meta) =>
          tokens.some(
            (token) =>
              meta.nameKey.includes(token) || meta.materialKey.includes(token),
          ),
        );

        if (layerMatches.length > 0) {
          candidates = layerMatches
            .sort(
              (a, b) =>
                a.center.distanceToSquared(queryPoint) -
                b.center.distanceToSquared(queryPoint),
            )
            .slice(0, limit);
        }
      }

      if (modelObject && candidates.length === 0) {
        rayOrigin.set(x, raycastStartY, z);
        raycaster.set(rayOrigin, down);
        const hits = raycaster.intersectObject(modelObject, true);
        const hit = hits.find((entry) => entry.object instanceof Mesh);
        if (hit) {
          const meshMeta = meshCatalog.byUuid.get(hit.object.uuid);
          if (meshMeta) {
            candidates = [meshMeta];
          } else {
            position = [hit.point.x, hit.point.y + 0.05, hit.point.z];
          }
        }
      }

      if (candidates.length > 0) {
        const primary = candidates[0];
        position = [primary.center.x, primary.topY + 0.05, primary.center.z];
      }

      map.set(annotation.id, {
        position,
        highlightMeshIds: candidates.map((entry) => entry.mesh.uuid),
      });
    }

    return map;
  }, [annotations, down, meshCatalog, modelBounds, modelObject, raycaster]);

  useEffect(() => {
    if (!modelObject) return;

    const selectedAnnotation =
      selectedId ? annotations.find((annotation) => annotation.id === selectedId) : undefined;
    const selectedPlacement = selectedId ? placements.get(selectedId) : undefined;
    const highlightColor = new Color(
      selectedAnnotation && TOPIC_COLORS[selectedAnnotation.topic]
        ? hsl(TOPIC_COLORS[selectedAnnotation.topic])
        : "#3b82f6",
    );
    const highlightSet = new Set(selectedPlacement?.highlightMeshIds ?? []);

    modelObject.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      const isHighlighted = highlightSet.has(node.uuid);

      materials.forEach((material) => {
        if (!material) return;
        const typed = material as HighlightMaterial;
        ensureMaterialSnapshot(typed);
        if (isHighlighted) {
          highlightMaterial(typed, highlightColor);
        } else {
          restoreMaterial(typed);
        }
      });
    });
  }, [annotations, modelObject, placements, selectedId]);

  return (
    <>
      <color attach="background" args={["#dff3f4"]} />
      <fog attach="fog" args={["#dff3f4", 8, 28]} />

      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#dbeafe", "#a7f3d0", 0.45]} />
      <directionalLight
        position={[8, 12, 7]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <Environment preset="city" />

      <Grid
        position={[0, -0.001, 0]}
        args={[28, 28]}
        cellColor="#9ca3af"
        sectionColor="#64748b"
        cellSize={0.45}
        sectionSize={3}
        cellThickness={0.35}
        sectionThickness={0.7}
        fadeDistance={26}
        fadeStrength={1}
        infiniteGrid
      />

      <group position={city.model.transform.position} rotation={city.model.transform.rotation}>
        <CityModel city={city} onBoundsChange={setModelBounds} onModelReady={setModelObject} />
        {annotations.map((annotation) => (
          <AnnotationMarker
            key={annotation.id}
            annotation={annotation}
            position={placements.get(annotation.id)?.position ?? [0, 0, 0]}
            selected={selectedId === annotation.id}
            onSelect={onSelect}
          />
        ))}
      </group>

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.28}
        scale={16}
        blur={2}
        far={8}
        resolution={512}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={!selectedId}
        autoRotateSpeed={0.58}
        target={city.camera.target}
        minDistance={city.camera.minDistance}
        maxDistance={city.camera.maxDistance}
        minPolarAngle={city.camera.minPolarAngle}
        maxPolarAngle={Math.min(city.camera.maxPolarAngle, 1.35)}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}
