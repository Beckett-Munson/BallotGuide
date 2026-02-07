import { PITTSBURGH_SCENARIO } from "./pittsburgh";

export const CITY_SCENARIOS = {
  pittsburgh: PITTSBURGH_SCENARIO,
} as const;

export type CityId = keyof typeof CITY_SCENARIOS;
