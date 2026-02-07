import { MathUtils } from "three";
import type { CityPolicyAnnotation, ModelBounds, NormalizedMapPoint, Vec3 } from "./types";

export const FALLBACK_MODEL_BOUNDS: ModelBounds = {
  min: [-4, 0, -4],
  max: [4, 2.4, 4],
};

export function mapPointToModelPosition(
  mapPoint: NormalizedMapPoint,
  bounds: ModelBounds,
  yLift = 0,
): Vec3 {
  const [nx, nz] = mapPoint;
  const x = MathUtils.lerp(bounds.min[0], bounds.max[0], (nx + 1) / 2);
  const z = MathUtils.lerp(bounds.min[2], bounds.max[2], (nz + 1) / 2);
  const y = bounds.min[1] + yLift;
  return [x, y, z];
}

export function filterAnnotationsByTopics(
  annotations: CityPolicyAnnotation[],
  activeTopics: string[],
): CityPolicyAnnotation[] {
  if (activeTopics.length === 0) {
    return [];
  }

  const topicSet = new Set(activeTopics);
  return annotations.filter((annotation) => topicSet.has(annotation.topic));
}
