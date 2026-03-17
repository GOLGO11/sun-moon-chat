import { indonesianCities } from "@/src/data/demo";

export function normalizeCity(input: string) {
  const normalized = input.trim().toLowerCase();

  return indonesianCities.find((city) => city.name.toLowerCase() === normalized) ?? null;
}
