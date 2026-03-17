"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { DEMO_OTP, SAMPLE_PROFILE_ID, defaultReadingPrompt, indonesianCities, sampleProfiles } from "@/src/data/demo";
import {
  exportDemoEvents,
  readDemoSession,
  resetDemoStorage,
  storeDemoSession,
  trackDemoEvent,
} from "@/src/lib/demo-storage";
import {
  getChart,
  getChatThread,
  getMatches,
  getReading,
  reportChatThread,
  sendChatMessage,
} from "@/src/lib/demo-services";
import type { BirthInput, ChartResult, MatchResult, ReadingResult } from "@/src/types/demo";

type DemoStep = "login" | "otp" | "choice" | "manual" | "dashboard";

type DemoState = {
  chart: ChartResult | null;
  matches: MatchResult[];
  reading: ReadingResult | null;
  reported: boolean;
  selectedMatch: MatchResult | null;
  threadMessages: Array<{
    from: string;
    id: string;
    sentAt: string;
    text: string;
    to: string;
  }>;
  viewerId: string;
};

const initialBirthInput: BirthInput = {
  birthDate: "1998-08-17",
  birthTime: "23:58",
  city: "Jakarta",
};

function statusLabel(error: string) {
  if (error === "CITY_UNSUPPORTED") {
    return "Kota ini belum ada di demo. Pilih salah satu kota yang tersedia dulu.";
  }

  if (error === "BIRTH_TIME_REQUIRED") {
    return "Jam lahir wajib diisi untuk demo chart.";
  }

  if (error === "MESSAGE_EMPTY") {
    return "Pesan kosong belum bisa dikirim.";
  }

  return "Ada langkah demo yang belum lengkap. Coba ulang sekali lagi.";
}

function signBadge(label: string, value: string) {
  return (
    <div className="rounded-[28px] border border-white/12 bg-white/5 px-4 py-3 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/60">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<DemoStep>("login");
  const [phone, setPhone] = useState("+628123456789");
  const [otp, setOtp] = useState("");
  const [manualInput, setManualInput] = useState<BirthInput>(initialBirthInput);
  const [aiPrompt, setAiPrompt] = useState(defaultReadingPrompt);
  const [messageDraft, setMessageDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [exportPreview, setExportPreview] = useState("");
  const [demoState, setDemoState] = useState<DemoState>({
    chart: null,
    matches: [],
    reading: null,
    reported: false,
    selectedMatch: null,
    threadMessages: [],
    viewerId: "u_demo_manual",
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const stored = readDemoSession();

    if (!stored) {
      return;
    }

    setPhone(stored.phone);

    if (stored.mode === "sample" && stored.profileId) {
      const profileId = stored.profileId;
      const storedPhone = stored.phone;
      startTransition(() => {
        void bootstrapSampleFlow(profileId, storedPhone);
      });
      return;
    }

    if (stored.mode === "manual" && stored.birthInput) {
      const birthInput = stored.birthInput;
      const storedPhone = stored.phone;
      setManualInput(birthInput);
      startTransition(() => {
        void bootstrapManualFlow(birthInput, storedPhone);
      });
      return;
    }

    setStep("choice");
  },
  // The demo restores one persisted session on first mount only.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  async function bootstrapSampleFlow(profileId: string, storedPhone: string) {
    const profile = sampleProfiles.find((item) => item.id === profileId);

    if (!profile) {
      setStep("choice");
      return;
    }

    const birthInput = {
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      city: profile.city,
    };

    await hydrateDemo({
      birthInput,
      phoneValue: storedPhone,
      mode: "sample",
      profileId,
      viewerId: profile.id,
    });
  }

  async function bootstrapManualFlow(birthInput: BirthInput, storedPhone: string) {
    await hydrateDemo({
      birthInput,
      phoneValue: storedPhone,
      mode: "manual",
      viewerId: "u_demo_manual",
    });
  }

  async function hydrateDemo({
    birthInput,
    mode,
    phoneValue,
    profileId,
    viewerId,
  }: {
    birthInput: BirthInput;
    mode: "manual" | "sample";
    phoneValue: string;
    profileId?: string;
    viewerId: string;
  }) {
    try {
      setErrorMessage("");
      setStep("dashboard");
      storeDemoSession({
        phone: phoneValue,
        mode,
        profileId,
        birthInput,
      });

      const chart = await getChart(birthInput);

      trackDemoEvent("birth_submitted", { mode });
      trackDemoEvent("chart_rendered", { timezone: chart.timezone });

      const reading = await getReading({
        prompt: defaultReadingPrompt,
        chart,
      });

      const matches = await getMatches(
        mode === "sample"
          ? { userId: viewerId }
          : {
              birthInput,
            },
      );
      const selectedMatch = matches[0] ?? null;
      const thread = selectedMatch
        ? await getChatThread(viewerId, selectedMatch.id)
        : { messages: [], reported: false };

      if (selectedMatch) {
        trackDemoEvent("match_opened", { matchId: selectedMatch.id, source: selectedMatch.source });
      }

      setDemoState({
        chart,
        matches,
        reading,
        reported: thread.reported,
        selectedMatch,
        threadMessages: thread.messages,
        viewerId,
      });
    } catch (error) {
      setErrorMessage(statusLabel(error instanceof Error ? error.message : "REQUEST_FAILED"));
      setStep(mode === "manual" ? "manual" : "choice");
    }
  }

  function handleRequestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!phone.startsWith("+62")) {
      setErrorMessage("Nomor demo harus dimulai dari +62.");
      return;
    }

    trackDemoEvent("demo_started", { entry: "otp" });
    setStep("otp");
  }

  function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (otp !== DEMO_OTP) {
      setErrorMessage("Kode demo salah. Gunakan 123456.");
      return;
    }

    storeDemoSession({ phone });
    setStep("choice");
  }

  function handleUseSampleProfile() {
    startTransition(() => {
      void bootstrapSampleFlow(SAMPLE_PROFILE_ID, phone);
    });
  }

  function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      void bootstrapManualFlow(manualInput, phone);
    });
  }

  async function handleAskAi() {
    if (!demoState.chart) {
      return;
    }

    try {
      setErrorMessage("");
      const reading = await getReading({
        prompt: aiPrompt,
        chart: demoState.chart,
      });

      trackDemoEvent("ai_prompt_sent", { blocked: reading.blocked });
      setDemoState((current) => ({
        ...current,
        reading,
      }));
    } catch (error) {
      setErrorMessage(statusLabel(error instanceof Error ? error.message : "REQUEST_FAILED"));
    }
  }

  async function openMatch(match: MatchResult) {
    try {
      setErrorMessage("");
      const thread = await getChatThread(demoState.viewerId, match.id);

      trackDemoEvent("match_opened", { matchId: match.id, source: match.source });
      setDemoState((current) => ({
        ...current,
        selectedMatch: match,
        threadMessages: thread.messages,
        reported: thread.reported,
      }));
    } catch (error) {
      setErrorMessage(statusLabel(error instanceof Error ? error.message : "REQUEST_FAILED"));
    }
  }

  async function sendMessage() {
    if (!demoState.selectedMatch) {
      return;
    }

    try {
      setErrorMessage("");
      const response = await sendChatMessage(
        demoState.viewerId,
        demoState.selectedMatch.id,
        messageDraft,
      );

      trackDemoEvent("chat_sent", { matchId: demoState.selectedMatch.id });
      setDemoState((current) => ({
        ...current,
        threadMessages: [...current.threadMessages, response.message],
      }));
      setMessageDraft("");
    } catch (error) {
      setErrorMessage(statusLabel(error instanceof Error ? error.message : "REQUEST_FAILED"));
    }
  }

  async function reportCurrentThread() {
    if (!demoState.selectedMatch) {
      return;
    }

    try {
      await reportChatThread(demoState.viewerId, demoState.selectedMatch.id);

      trackDemoEvent("chat_reported", { matchId: demoState.selectedMatch.id });
      setDemoState((current) => ({
        ...current,
        reported: true,
      }));
    } catch (error) {
      setErrorMessage(statusLabel(error instanceof Error ? error.message : "REQUEST_FAILED"));
    }
  }

  function handleExportEvents() {
    setExportPreview(JSON.stringify(exportDemoEvents(), null, 2));
  }

  function handleReset() {
    resetDemoStorage();
    setDemoState({
      chart: null,
      matches: [],
      reading: null,
      reported: false,
      selectedMatch: null,
      threadMessages: [],
      viewerId: "u_demo_manual",
    });
    setPhone("+628123456789");
    setOtp("");
    setAiPrompt(defaultReadingPrompt);
    setMessageDraft("");
    setErrorMessage("");
    setExportPreview("");
    setStep("login");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,201,255,0.24),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(255,165,120,0.18),_transparent_28%),linear-gradient(180deg,_#06131f_0%,_#091c2c_38%,_#05111a_100%)] px-4 pb-16 pt-20 text-white">
      <div className="mx-auto w-full max-w-md space-y-5">
        <section className="overflow-hidden rounded-[32px] border border-white/12 bg-slate-950/55 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.36em] text-cyan-100/60">Sun Moon Chat MVP</p>
          <h1 className="mt-3 font-[var(--font-display)] text-4xl leading-tight text-white">
            Validasi loop inti dalam satu demo mobile.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-200/78">
            Fokusnya hanya satu: login demo, isi data lahir, lihat chart interpretif, buka match, lalu kirim chat
            pertama. Tanpa pembayaran, tanpa layanan eksternal.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-left text-xs text-slate-200/75">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/55">1</p>
              <p className="mt-2">OTP demo +62</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/55">2</p>
              <p className="mt-2">Chart dan AI reading aman</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/55">3</p>
              <p className="mt-2">Match seeded + basic chat</p>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {errorMessage}
          </div>
        ) : null}

        {step === "login" ? (
          <section className="rounded-[28px] border border-white/12 bg-slate-950/55 p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-200/80">Masuk dengan OTP simulasi. Kode demo tetap: `123456`.</p>
            <form className="mt-4 space-y-4" onSubmit={handleRequestOtp}>
              <label className="block text-sm text-slate-100">
                Nomor WhatsApp
                <input
                  className="mt-2 w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-base outline-none transition focus:border-cyan-300/70"
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>
              <button
                className="w-full rounded-2xl bg-[linear-gradient(135deg,_#7dd3fc,_#fb923c)] px-4 py-3 font-semibold text-slate-950"
                type="submit"
              >
                Minta kode demo
              </button>
            </form>
          </section>
        ) : null}

        {step === "otp" ? (
          <section className="rounded-[28px] border border-white/12 bg-slate-950/55 p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-200/80">
              Kami tidak mengirim SMS sungguhan. Masukkan kode demo <span className="font-semibold">123456</span>.
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleVerifyOtp}>
              <label className="block text-sm text-slate-100">
                Kode OTP
                <input
                  className="mt-2 w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none transition focus:border-cyan-300/70"
                  inputMode="numeric"
                  maxLength={6}
                  name="otp"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
              </label>
              <button
                className="w-full rounded-2xl bg-[linear-gradient(135deg,_#7dd3fc,_#fb923c)] px-4 py-3 font-semibold text-slate-950"
                type="submit"
              >
                Verifikasi
              </button>
            </form>
          </section>
        ) : null}

        {step === "choice" ? (
          <section className="rounded-[28px] border border-white/12 bg-slate-950/55 p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/60">Onboarding</p>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl text-white">Pilih jalur demo tercepat.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200/78">
              Data lahir hanya dipakai untuk chart demo dan analytics lokal. Tidak ada SMS provider, database, atau
              pembayaran.
            </p>
            <div className="mt-5 space-y-3">
              <button
                aria-label="Gunakan profil contoh"
                className="w-full rounded-[26px] border border-cyan-300/30 bg-cyan-300/10 p-4 text-left"
                type="button"
                onClick={handleUseSampleProfile}
              >
                <p className="font-semibold text-white">Gunakan profil contoh</p>
                <p className="mt-1 text-sm text-slate-200/78">
                  Jalan tercepat untuk reviewer. Profil default: Alya, Jakarta, siap sampai tahap chat.
                </p>
              </button>
              <button
                aria-label="Masukkan data lahir sendiri"
                className="w-full rounded-[26px] border border-white/12 bg-white/5 p-4 text-left"
                type="button"
                onClick={() => setStep("manual")}
              >
                <p className="font-semibold text-white">Masukkan data lahir sendiri</p>
                <p className="mt-1 text-sm text-slate-200/78">
                  Isi tanggal, jam, dan kota untuk melihat chart demo yang deterministik.
                </p>
              </button>
            </div>
          </section>
        ) : null}

        {step === "manual" ? (
          <section className="rounded-[28px] border border-white/12 bg-slate-950/55 p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/60">Birth Info</p>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl text-white">Lengkapi data lahirmu.</h2>
            <form className="mt-5 space-y-4" onSubmit={handleManualSubmit}>
              <label className="block text-sm text-slate-100">
                Tanggal lahir
                <input
                  className="mt-2 w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 outline-none transition focus:border-cyan-300/70"
                  type="date"
                  value={manualInput.birthDate}
                  onChange={(event) =>
                    setManualInput((current) => ({
                      ...current,
                      birthDate: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="block text-sm text-slate-100">
                Jam lahir
                <input
                  className="mt-2 w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 outline-none transition focus:border-cyan-300/70"
                  type="time"
                  value={manualInput.birthTime}
                  onChange={(event) =>
                    setManualInput((current) => ({
                      ...current,
                      birthTime: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="block text-sm text-slate-100">
                Kota lahir
                <select
                  className="mt-2 w-full rounded-2xl border border-white/12 bg-[#0f2233] px-4 py-3 outline-none transition focus:border-cyan-300/70"
                  value={manualInput.city}
                  onChange={(event) =>
                    setManualInput((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                >
                  {indonesianCities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name} ({city.timezoneLabel})
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="w-full rounded-2xl bg-[linear-gradient(135deg,_#7dd3fc,_#fb923c)] px-4 py-3 font-semibold text-slate-950"
                type="submit"
              >
                Generate chart demo
              </button>
            </form>
          </section>
        ) : null}

        {step === "dashboard" ? (
          <section className="space-y-5">
            <div className="rounded-[28px] border border-white/12 bg-slate-950/55 p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/60">Chart & Reading</p>
                  <h2 className="mt-2 font-[var(--font-display)] text-3xl text-white">Peta kosmikmu</h2>
                </div>
                <button
                  className="rounded-full border border-white/12 px-3 py-1 text-xs text-slate-200/75"
                  type="button"
                  onClick={handleReset}
                >
                  Reset demo
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                {demoState.chart ? (
                  <>
                    {signBadge("Matahari", demoState.chart.sun)}
                    {signBadge("Bulan", demoState.chart.moon)}
                    {signBadge("Ascendant", demoState.chart.ascendant)}
                  </>
                ) : null}
              </div>

              {demoState.chart ? (
                <div className="mt-4 rounded-[26px] border border-cyan-200/14 bg-cyan-300/8 p-4 text-sm leading-6 text-slate-100/88">
                  <p className="font-semibold text-white">Timezone: {demoState.chart.timezone}</p>
                  <p className="mt-2">{demoState.chart.explanationSeed}</p>
                  <p className="mt-3 text-xs text-slate-300/70">
                    Konten astrologi di demo ini bersifat interpretif dan bukan klaim ilmiah.
                  </p>
                </div>
              ) : null}

              <div className="mt-5 rounded-[28px] border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Tanya Rasi Bintang</p>
                <textarea
                  className="mt-3 min-h-28 w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/70"
                  value={aiPrompt}
                  onChange={(event) => setAiPrompt(event.target.value)}
                />
                <button
                  className="mt-3 w-full rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 font-semibold text-cyan-50"
                  type="button"
                  onClick={handleAskAi}
                >
                  Kirim prompt AI
                </button>
                {demoState.reading ? (
                  <div
                    className={`mt-3 rounded-2xl px-4 py-3 text-sm leading-6 ${
                      demoState.reading.blocked
                        ? "border border-amber-300/30 bg-amber-400/10 text-amber-100"
                        : "border border-white/10 bg-white/5 text-slate-100/88"
                    }`}
                  >
                    {demoState.reading.answer}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-slate-950/55 p-5 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/60">Matches</p>
              <h2 className="mt-2 font-[var(--font-display)] text-3xl text-white">Rekomendasi Hari Ini</h2>
              <div className="mt-4 space-y-3">
                {demoState.matches.map((match) => (
                  <button
                    key={match.id}
                    className={`w-full rounded-[26px] border p-4 text-left transition ${
                      demoState.selectedMatch?.id === match.id
                        ? "border-cyan-300/40 bg-cyan-300/10"
                        : "border-white/10 bg-white/5"
                    }`}
                    type="button"
                    onClick={() => void openMatch(match)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {match.name}, {match.age}
                        </p>
                        <p className="mt-1 text-sm text-slate-200/72">
                          {match.city} • {match.sun}
                        </p>
                      </div>
                      <div className="rounded-full bg-amber-300/16 px-3 py-1 text-sm font-semibold text-amber-100">
                        {match.compatibilityScore}%
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-100/86">{match.compatibilityReason}</p>
                    <p className="mt-3 text-xs text-slate-300/68">{match.source}</p>
                  </button>
                ))}
              </div>
            </div>

            {demoState.selectedMatch ? (
              <div className="rounded-[28px] border border-white/12 bg-slate-950/55 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/60">Basic Chat</p>
                    <h2 className="mt-2 font-[var(--font-display)] text-3xl text-white">{demoState.selectedMatch.name}</h2>
                  </div>
                  <button
                    className="rounded-full border border-white/12 px-3 py-1 text-xs text-slate-200/75"
                    type="button"
                    onClick={() => void reportCurrentThread()}
                  >
                    Report
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-200/78">{demoState.selectedMatch.bio}</p>
                <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-4 text-sm leading-6 text-cyan-50">
                  Pembuka yang direkomendasikan: {demoState.selectedMatch.opener}
                </div>
                <div className="mt-4 space-y-3">
                  {demoState.threadMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.from === demoState.viewerId
                          ? "ml-auto bg-[linear-gradient(135deg,_#7dd3fc,_#fb923c)] text-slate-950"
                          : "bg-white/7 text-slate-100"
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
                {demoState.reported ? (
                  <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                    Thread ini sudah ditandai. Composer dinonaktifkan di mode demo.
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2">
                    <input
                      className="flex-1 rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/70"
                      placeholder="Kirim pesan pertama..."
                      value={messageDraft}
                      onChange={(event) => setMessageDraft(event.target.value)}
                    />
                    <button
                      className="rounded-2xl bg-[linear-gradient(135deg,_#7dd3fc,_#fb923c)] px-4 py-3 font-semibold text-slate-950"
                      type="button"
                      onClick={() => void sendMessage()}
                    >
                      Kirim
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            <div className="rounded-[28px] border border-white/12 bg-slate-950/55 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/60">Demo Analytics</p>
                  <h2 className="mt-2 font-[var(--font-display)] text-3xl text-white">Funnel events lokal</h2>
                </div>
                <button
                  className="rounded-full border border-white/12 px-3 py-1 text-xs text-slate-200/75"
                  type="button"
                  onClick={handleExportEvents}
                >
                  Export demo events
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200/78">
                Event yang disimpan hanya nama event, timestamp, dan metadata aman untuk demo.
              </p>
              {exportPreview ? (
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-slate-200/86">
                  {exportPreview}
                </pre>
              ) : null}
            </div>
          </section>
        ) : null}

        {isPending ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200/78">
            Menyiapkan demo flow...
          </div>
        ) : null}
      </div>
    </main>
  );
}
