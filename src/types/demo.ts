export type SupportedTimezone =
  | "Asia/Jakarta"
  | "Asia/Makassar"
  | "Asia/Jayapura";

export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type BirthInput = {
  birthDate: string;
  birthTime: string;
  city: string;
};

export type ChartResult = {
  sun: ZodiacSign;
  moon: ZodiacSign;
  ascendant: ZodiacSign;
  timezone: SupportedTimezone;
  explanationSeed: string;
  element: "fire" | "earth" | "air" | "water";
};

export type DemoProfile = {
  id: string;
  name: string;
  age: number;
  city: string;
  birthDate: string;
  birthTime: string;
  bio: string;
  intent: string;
};

export type MatchResult = {
  id: string;
  name: string;
  age: number;
  city: string;
  sun: ZodiacSign;
  compatibilityScore: number;
  compatibilityReason: string;
  opener: string;
  bio: string;
  source: "seeded-demo";
};

export type ChatMessage = {
  id: string;
  from: string;
  to: string;
  text: string;
  sentAt: string;
};

export type ReadingRequest = {
  prompt: string;
  chart: Pick<ChartResult, "sun" | "moon" | "ascendant">;
};

export type ReadingResult = {
  blocked: boolean;
  answer: string;
  reason?: string;
};

export type AnalyticsEventName =
  | "demo_started"
  | "birth_submitted"
  | "chart_rendered"
  | "ai_prompt_sent"
  | "match_opened"
  | "chat_sent"
  | "chat_reported";

export type DemoEvent = {
  name: AnalyticsEventName;
  timestamp: string;
  metadata?: Record<string, boolean | number | string>;
};

export type DemoSession = {
  phone: string;
  mode?: "manual" | "sample";
  profileId?: string;
  birthInput?: BirthInput;
};

export type IndonesianCity = {
  id: string;
  name: string;
  timezone: SupportedTimezone;
  timezoneLabel: "WIB" | "WITA" | "WIT";
};
