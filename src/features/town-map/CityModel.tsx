import { Html, RoundedBox } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Box3, Color, DoubleSide, Material, Mesh, Object3D, Sphere } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { CityMapConfig, ModelBounds } from "./types";
import { FALLBACK_MODEL_BOUNDS } from "./utils";

interface PreparedModel {
  object: Object3D;
  bounds: ModelBounds;
}

interface CityModelProps {
  city: CityMapConfig;
  onBoundsChange: (bounds: ModelBounds) => void;
  onModelReady?: (model: Object3D | null) => void;
}

type MaterialLike = Material & {
  transparent?: boolean;
  opacity?: number;
  depthWrite?: boolean;
  alphaTest?: number;
  side?: number;
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
};

function applyPalette(material: Material) {
  const mat = material as MaterialLike;
  const name = material.name.toLowerCase();

  mat.transparent = false;
  mat.opacity = 1;
  mat.depthWrite = true;
  mat.alphaTest = 0;
  mat.side = DoubleSide;

  if (mat.color) {
    if (name.includes("tree_material")) {
      mat.color.set("#4f8a3f");
    } else if (name.includes("forest_material")) {
      mat.color.set("#5a9848");
    } else if (name.includes("grass_material")) {
      mat.color.set("#78b35b");
    } else if (name.includes("garden_material")) {
      mat.color.set("#82bf63");
    } else if (name.includes("shrubbery_material")) {
      mat.color.set("#7caf59");
    } else if (name.includes("waterway_material")) {
      mat.color.set("#4c93ab");
    } else if (name.includes("water_material")) {
      mat.color.set("#7dc2d8");
    } else if (name.includes("simple  osm buildings_material")) {
      mat.color.set("#d6d8dd");
    }
  }

  if (mat.emissive) {
    mat.emissive.set("#000000");
    mat.emissiveIntensity = 0;
  }

  if (typeof mat.roughness === "number") {
    if (name.includes("water_material") || name.includes("waterway_material")) {
      mat.roughness = 0.2;
    } else if (name.includes("simple  osm buildings_material")) {
      mat.roughness = 0.88;
    } else {
      mat.roughness = 0.96;
    }
  }

  if (typeof mat.metalness === "number") {
    mat.metalness = 0.02;
  }

  material.needsUpdate = true;
}

function prepareModel(scene: Object3D, targetRadius: number): PreparedModel {
  const object = scene.clone(true);
  object.traverse((node) => {
    if (node instanceof Mesh) {
      node.castShadow = true;
      node.receiveShadow = true;

      const sourceMaterials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      const uniqueMaterials = sourceMaterials.map((material) =>
        material ? material.clone() : material,
      );

      if (Array.isArray(node.material)) {
        node.material = uniqueMaterials as Material[];
      } else {
        node.material = uniqueMaterials[0] as Material;
      }

      uniqueMaterials.forEach((material) => {
        if (material) {
          applyPalette(material);
        }
      });
    }
  });

  const sourceBounds = new Box3().setFromObject(object);
  const sphere = sourceBounds.getBoundingSphere(new Sphere());

  if (!Number.isFinite(sphere.radius) || sphere.radius <= 0) {
    return { object, bounds: FALLBACK_MODEL_BOUNDS };
  }

  const scale = targetRadius / sphere.radius;
  object.scale.setScalar(scale);
  object.position.set(
    -sphere.center.x * scale,
    -sourceBounds.min.y * scale,
    -sphere.center.z * scale,
  );

  const fittedBounds = new Box3().setFromObject(object);

  return {
    object,
    bounds: {
      min: [fittedBounds.min.x, fittedBounds.min.y, fittedBounds.min.z],
      max: [fittedBounds.max.x, fittedBounds.max.y, fittedBounds.max.z],
    },
  };
}

export default function CityModel({ city, onBoundsChange, onModelReady }: CityModelProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [model, setModel] = useState<PreparedModel | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();

    setStatus("loading");
    setModel(null);
    onBoundsChange(FALLBACK_MODEL_BOUNDS);
    onModelReady?.(null);

    loader.load(
      city.model.modelUrl,
      (gltf) => {
        if (cancelled) return;
        const prepared = prepareModel(gltf.scene, city.model.targetRadius);
        setModel(prepared);
        setStatus("ready");
        onBoundsChange(prepared.bounds);
        onModelReady?.(prepared.object);
      },
      undefined,
      () => {
        if (cancelled) return;
        setStatus("error");
        onBoundsChange(FALLBACK_MODEL_BOUNDS);
        onModelReady?.(null);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [city.model.modelUrl, city.model.targetRadius, onBoundsChange, onModelReady]);

  if (status === "ready" && model) {
    return <primitive object={model.object} />;
  }

  const statusMessage =
    status === "error"
      ? "Cityweft model not found at /public/models/pittsburgh-cityweft.glb"
      : "Loading Pittsburgh Cityweft model...";

  return (
    <group>
      <RoundedBox args={[8, 0.2, 6]} position={[0, 0.12, 0]} radius={0.12} smoothness={6}>
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} metalness={0.04} />
      </RoundedBox>
      <RoundedBox args={[4.8, 1, 3.4]} position={[0, 0.6, 0]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} metalness={0.05} />
      </RoundedBox>
      <Html center position={[0, 1.2, 0]} transform distanceFactor={8}>
        <div className="rounded-lg border border-border bg-background/90 px-3 py-2 text-xs text-foreground shadow-md backdrop-blur-sm">
          {statusMessage}
        </div>
      </Html>
    </group>
  );
}
