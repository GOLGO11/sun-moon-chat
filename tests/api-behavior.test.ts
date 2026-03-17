import { describe, expect, it } from "vitest";
import { GET as getMatches } from "@/app/api/matches/route";
import { POST as sendChat } from "@/app/api/chat/send/route";
import { POST as chartPost } from "@/app/api/chart/route";
import { POST as readingPost } from "@/app/api/reading/route";

describe("demo api behavior", () => {
  it("returns deterministic chart JSON for repeated input", async () => {
    const request = new Request("http://localhost/api/chart", {
      method: "POST",
      body: JSON.stringify({
        birthDate: "1996-08-17",
        birthTime: "23:58",
        city: "Jakarta",
      }),
    });

    const first = await chartPost(request);
    const second = await chartPost(
      new Request("http://localhost/api/chart", {
        method: "POST",
        body: JSON.stringify({
          birthDate: "1996-08-17",
          birthTime: "23:58",
          city: "Jakarta",
        }),
      }),
    );

    expect(await first.json()).toEqual(await second.json());
  });

  it("rejects unsupported city names with machine-readable code", async () => {
    const response = await chartPost(
      new Request("http://localhost/api/chart", {
        method: "POST",
        body: JSON.stringify({
          birthDate: "1998-01-12",
          birthTime: "08:30",
          city: "Batam",
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ errorCode: "CITY_UNSUPPORTED" });
  });

  it("blocks dangerous reading prompts", async () => {
    const response = await readingPost(
      new Request("http://localhost/api/reading", {
        method: "POST",
        body: JSON.stringify({
          prompt: "Apakah saya akan mati muda?",
          chart: {
            sun: "Leo",
            moon: "Scorpio",
            ascendant: "Pisces",
          },
        }),
      }),
    );

    const payload = await response.json();
    expect(payload.blocked).toBe(true);
  });

  it("returns seeded matches for a valid demo user", async () => {
    const response = await getMatches(new Request("http://localhost/api/matches?userId=u_demo_1"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.length).toBeGreaterThan(0);
    expect(payload[0].source).toBe("seeded-demo");
  });

  it("rejects empty chat messages", async () => {
    const response = await sendChat(
      new Request("http://localhost/api/chat/send", {
        method: "POST",
        body: JSON.stringify({
          from: "u_demo_1",
          to: "u_demo_2",
          text: "",
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ errorCode: "MESSAGE_EMPTY" });
  });
});
