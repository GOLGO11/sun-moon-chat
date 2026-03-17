import { sampleProfiles } from "@/src/data/demo";
import { generateChart, getElement, getSunSign } from "@/src/lib/astrology";
import type { BirthInput, ChartResult, MatchResult, ZodiacSign } from "@/src/types/demo";

function reasonForCompatibility(userSun: ZodiacSign, matchSun: ZodiacSign) {
  const userElement = getElement(userSun);
  const matchElement = getElement(matchSun);

  if (userElement === matchElement) {
    return `Kalian berbagi elemen ${userElement}, jadi ritme ngobrolnya cenderung cepat nyambung.`;
  }

  if (
    (userElement === "fire" && matchElement === "air") ||
    (userElement === "air" && matchElement === "fire") ||
    (userElement === "earth" && matchElement === "water") ||
    (userElement === "water" && matchElement === "earth")
  ) {
    return `Elemen kalian saling menopang, cocok untuk chemistry yang terasa natural tapi tetap seimbang.`;
  }

  return `Perbedaannya justru bikin obrolan terasa segar, asal kalian mulai dari topik yang ringan dan jujur.`;
}

function compatibilityScore(userSun: ZodiacSign, matchSun: ZodiacSign, bonusSeed: number) {
  const userElement = getElement(userSun);
  const matchElement = getElement(matchSun);

  if (userElement === matchElement) {
    return 88 - bonusSeed;
  }

  if (
    (userElement === "fire" && matchElement === "air") ||
    (userElement === "air" && matchElement === "fire") ||
    (userElement === "earth" && matchElement === "water") ||
    (userElement === "water" && matchElement === "earth")
  ) {
    return 82 - bonusSeed;
  }

  return 74 - bonusSeed;
}

export function getMatchesForUser(userId: string): MatchResult[] | null {
  const user = sampleProfiles.find((profile) => profile.id === userId);

  if (!user) {
    return null;
  }

  return getMatchesForBirthInput({
    birthDate: user.birthDate,
    birthTime: user.birthTime,
    city: user.city,
  }).filter((match) => match.id !== user.id);
}

export function getMatchesForBirthInput(input: BirthInput): MatchResult[] {
  const chart = generateChart(input);

  return getMatchesForChart(chart);
}

export function getMatchesForChart(chart: ChartResult): MatchResult[] {
  return sampleProfiles
    .map((profile, index) => {
      const sun = getSunSign(profile.birthDate);

      return {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        city: profile.city,
        sun,
        compatibilityScore: compatibilityScore(chart.sun, sun, index),
        compatibilityReason: reasonForCompatibility(chart.sun, sun),
        opener: `Aku lihat kombinasi ${chart.sun} dan ${sun} biasanya seru kalau mulai dari cerita kecil yang jujur. Mau tukar ritual recharge versi kamu?`,
        bio: profile.bio,
        source: "seeded-demo" as const,
      };
    })
    .sort((left, right) => right.compatibilityScore - left.compatibilityScore)
    .slice(0, 5);
}
