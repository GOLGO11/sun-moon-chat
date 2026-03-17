import { normalizeCity } from "@/src/lib/cities";
import type { BirthInput, ChartResult, ZodiacSign } from "@/src/types/demo";

const zodiacSigns: ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const signElements: Record<ZodiacSign, ChartResult["element"]> = {
  Aries: "fire",
  Taurus: "earth",
  Gemini: "air",
  Cancer: "water",
  Leo: "fire",
  Virgo: "earth",
  Libra: "air",
  Scorpio: "water",
  Sagittarius: "fire",
  Capricorn: "earth",
  Aquarius: "air",
  Pisces: "water",
};

function parseDateParts(birthDate: string) {
  const [year, month, day] = birthDate.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error("BIRTH_DATE_INVALID");
  }

  return { year, month, day };
}

function parseTimeParts(birthTime: string) {
  const [hour, minute] = birthTime.split(":").map(Number);

  if (hour === undefined || minute === undefined || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error("BIRTH_TIME_INVALID");
  }

  return { hour, minute };
}

export function getSunSign(birthDate: string): ZodiacSign {
  const { month, day } = parseDateParts(birthDate);
  const current = month * 100 + day;

  if (current <= 119 || current >= 1222) {
    return "Capricorn";
  }

  if (current <= 218) {
    return "Aquarius";
  }

  if (current <= 320) {
    return "Pisces";
  }

  if (current <= 419) {
    return "Aries";
  }

  if (current <= 520) {
    return "Taurus";
  }

  if (current <= 620) {
    return "Gemini";
  }

  if (current <= 722) {
    return "Cancer";
  }

  if (current <= 822) {
    return "Leo";
  }

  if (current <= 922) {
    return "Virgo";
  }

  if (current <= 1022) {
    return "Libra";
  }

  if (current <= 1121) {
    return "Scorpio";
  }

  return "Sagittarius";
}

export function getElement(sign: ZodiacSign): ChartResult["element"] {
  return signElements[sign];
}

export function generateChart(input: BirthInput): ChartResult {
  const city = normalizeCity(input.city);

  if (!city) {
    throw new Error("CITY_UNSUPPORTED");
  }

  if (!input.birthTime) {
    throw new Error("BIRTH_TIME_REQUIRED");
  }

  const { year, month, day } = parseDateParts(input.birthDate);
  const { hour, minute } = parseTimeParts(input.birthTime);
  const cityWeight = city.id.length;
  const sun = getSunSign(input.birthDate);
  const moonIndex = (year + month + day + cityWeight) % zodiacSigns.length;
  const ascendantIndex = (hour * 2 + Math.floor(minute / 10) + cityWeight) % zodiacSigns.length;
  const moon = zodiacSigns[moonIndex];
  const ascendant = zodiacSigns[ascendantIndex];

  return {
    sun,
    moon,
    ascendant,
    timezone: city.timezone,
    element: getElement(sun),
    explanationSeed: `${sun} membawa cara tampilmu, ${moon} mengatur kebutuhan emosimu, dan ${ascendant} membentuk kesan pertama yang orang rasakan.`,
  };
}
