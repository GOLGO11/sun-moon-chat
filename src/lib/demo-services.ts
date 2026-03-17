import { generateChart } from "@/src/lib/astrology";
import { getThread, reportThread, sendThreadMessage } from "@/src/lib/chat-store";
import { getMatchesForBirthInput, getMatchesForUser } from "@/src/lib/matching";
import { composeReading } from "@/src/lib/reading";
import type { BirthInput, ChartResult, MatchResult, ReadingResult } from "@/src/types/demo";

export async function getChart(input: BirthInput): Promise<ChartResult> {
  return generateChart(input);
}

export async function getReading(input: {
  chart: Pick<ChartResult, "ascendant" | "moon" | "sun">;
  prompt: string;
}): Promise<ReadingResult> {
  return composeReading(input);
}

export async function getMatches(input: { birthInput?: BirthInput; userId?: string }): Promise<MatchResult[]> {
  if (input.userId) {
    const matches = getMatchesForUser(input.userId);

    if (!matches) {
      throw new Error("USER_NOT_FOUND");
    }

    return matches;
  }

  if (input.birthInput) {
    return getMatchesForBirthInput(input.birthInput);
  }

  throw new Error("MATCH_INPUT_REQUIRED");
}

export async function getChatThread(viewerId: string, matchId: string) {
  return getThread(viewerId, matchId);
}

export async function sendChatMessage(from: string, to: string, text: string) {
  return {
    ok: true,
    message: sendThreadMessage(from, to, text),
  };
}

export async function reportChatThread(viewerId: string, matchId: string) {
  return reportThread(viewerId, matchId);
}
