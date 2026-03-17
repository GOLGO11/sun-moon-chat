import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "@/app/page";
import { resetChatStore } from "@/src/lib/chat-store";

describe("Home demo flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetChatStore();
  });

  it("walks the reviewer through sample onboarding to first chat send", async () => {
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

    await waitFor(() => {
      expect(screen.getByText("Rekomendasi Hari Ini")).toBeTruthy();
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
