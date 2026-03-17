import { describe, expect, it } from "vitest";
import { generateChart } from "@/src/lib/astrology";
import { sendThreadMessage } from "@/src/lib/chat-store";
import { getMatchesForUser } from "@/src/lib/matching";
import { composeReading } from "@/src/lib/reading";

describe("demo behavior", () => {
  it("returns deterministic chart JSON for repeated input", async () => {
    const payload = {
      birthDate: "1996-08-17",
      birthTime: "23:58",
      city: "Jakarta",
    };

    expect(generateChart(payload)).toEqual(generateChart(payload));
  });

  it("rejects unsupported city names with machine-readable code", async () => {
    expect(() =>
      generateChart({
        birthDate: "1998-01-12",
        birthTime: "08:30",
        city: "Batam",
      }),
    ).toThrowError("CITY_UNSUPPORTED");
  });

  it("blocks dangerous reading prompts", async () => {
    const payload = composeReading({
      prompt: "Apakah saya akan mati muda?",
      chart: {
        sun: "Leo",
        moon: "Scorpio",
        ascendant: "Pisces",
      },
    });
    expect(payload.blocked).toBe(true);
  });

  it("returns seeded matches for a valid demo user", async () => {
    const payload = getMatchesForUser("u_demo_1");

    expect(payload?.length).toBeGreaterThan(0);
    expect(payload?.[0].source).toBe("seeded-demo");
  });

  it("rejects empty chat messages", async () => {
    expect(() => sendThreadMessage("u_demo_1", "u_demo_2", "")).toThrowError("MESSAGE_EMPTY");
  });
});
