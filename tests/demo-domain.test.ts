import { describe, expect, it } from "vitest";
import { indonesianCities, sampleProfiles } from "@/src/data/demo";
import { featureFlags } from "@/src/lib/features";

describe("demo domain", () => {
  it("covers all three Indonesian timezone groups", () => {
    expect(new Set(indonesianCities.map((city) => city.timezone))).toEqual(
      new Set(["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"]),
    );
  });

  it("ships at least six sample profiles", () => {
    expect(sampleProfiles.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps non-MVP monetization and growth features disabled", () => {
    expect(featureFlags).toEqual({
      payments: false,
      coins: false,
      gifts: false,
      subscriptions: false,
      portraitPaywall: false,
      visitorUnlock: false,
      advancedMatching: false,
    });
  });
});
