export type Vec3 = [number, number, number];
export type NormalizedMapPoint = [number, number];

export interface CityCameraSettings {
  position: Vec3;
  target: Vec3;
  fov: number;
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
}

export interface CityModelSettings {
  sourceName: string;
  sourceUrl?: string;
  modelUrl: string;
  targetRadius: number;
  transform: {
    position: Vec3;
    rotation: Vec3;
  };
}

export interface CityMapConfig {
  id: string;
  name: string;
  model: CityModelSettings;
  camera: CityCameraSettings;
}

export interface CityPolicyAnnotation {
  id: string;
  topic: string;
  title: string;
  markerLabel: string;
  highlightedBuilding: string;
  mapPoint: NormalizedMapPoint;
  text: string;
  citations: {
    title: string;
    url: string;
  }[];
  nodeNames?: string[];
}

export interface CityScenario {
  city: CityMapConfig;
  annotations: CityPolicyAnnotation[];
}

export interface ModelBounds {
  min: Vec3;
  max: Vec3;
}
