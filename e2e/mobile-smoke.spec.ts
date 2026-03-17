import { expect, test } from "@playwright/test";

test.describe("Mobile MVP smoke", () => {
  test("reviewer can finish the core demo loop", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Sun Moon Chat MVP Demo/);
    await expect(page.locator(".demo-badge")).toBeVisible();

    await page.getByLabel("Nomor WhatsApp").fill("+628123456789");
    await page.getByRole("button", { name: "Minta kode demo" }).click();

    await page.getByLabel("Kode OTP").fill("123456");
    await page.getByRole("button", { name: "Verifikasi" }).click();
    await page.getByRole("button", { name: "Gunakan profil contoh" }).click();

    await expect(page.getByText("Peta kosmikmu")).toBeVisible();

    await page.getByRole("button", { name: "Kirim prompt AI" }).click();
    await expect(page.getByText(/interpretif|aman/i)).toBeVisible();

    await page.getByPlaceholder("Kirim pesan pertama...").fill("Halo! Aku juga penasaran soal ritual recharge-mu.");
    await page.getByRole("button", { name: "Kirim" }).click();
    await expect(page.getByText("Halo! Aku juga penasaran soal ritual recharge-mu.")).toBeVisible();

    await page.getByRole("button", { name: "Export demo events" }).click();

    const events = await page.evaluate(() => window.localStorage.getItem("sun-moon-demo-events"));
    expect(events).toContain("birth_submitted");
    expect(events).toContain("chart_rendered");
    expect(events).toContain("match_opened");
    expect(events).toContain("chat_sent");
  });
});
