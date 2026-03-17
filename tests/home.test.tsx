import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

const fetchMock = vi.fn();

describe("Home demo flow", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    window.localStorage.clear();
  });

  it("walks the reviewer through sample onboarding to first chat send", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sun: "Leo",
          moon: "Pisces",
          ascendant: "Cancer",
          timezone: "Asia/Jakarta",
          explanationSeed: "Interpretive chart seed.",
          element: "fire",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          blocked: false,
          answer: "Reading aman.",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "u_demo_2",
            name: "Raka",
            age: 27,
            city: "Makassar",
            sun: "Aries",
            compatibilityScore: 88,
            compatibilityReason: "Cocok untuk pembuka yang jujur.",
            opener: "Mulai dari cerita kecil dulu.",
            bio: "Bio seeded.",
            source: "seeded-demo",
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          key: "u_demo_1__u_demo_2",
          messages: [],
          reported: false,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          message: {
            id: "m_1",
            from: "u_demo_1",
            to: "u_demo_2",
            text: "Halo! Aku juga suka obrolan jujur.",
            sentAt: "2026-03-17T10:00:00.000Z",
          },
        }),
      });

    render(<Home />);

    fireEvent.change(screen.getByLabelText("Nomor WhatsApp"), {
      target: { value: "+628123456789" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Minta kode demo" }));

    fireEvent.change(screen.getByLabelText("Kode OTP"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Verifikasi" }));
    fireEvent.click(screen.getByRole("button", { name: "Gunakan profil contoh" }));

    await waitFor(() => {
      expect(screen.getByText("Peta kosmikmu")).toBeTruthy();
    });

    fireEvent.change(screen.getByPlaceholderText("Kirim pesan pertama..."), {
      target: { value: "Halo! Aku juga suka obrolan jujur." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Kirim" }));

    await waitFor(() => {
      expect(screen.getByText("Halo! Aku juga suka obrolan jujur.")).toBeTruthy();
    });
  });
});
