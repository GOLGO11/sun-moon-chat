import type { ChatMessage, DemoProfile, IndonesianCity } from "@/src/types/demo";

export const DEMO_OTP = "123456";
export const SAMPLE_PROFILE_ID = "u_demo_1";
export const defaultReadingPrompt = "Apa energi hubungan saya minggu ini?";

export const indonesianCities: IndonesianCity[] = [
  { id: "jakarta", name: "Jakarta", timezone: "Asia/Jakarta", timezoneLabel: "WIB" },
  { id: "surabaya", name: "Surabaya", timezone: "Asia/Jakarta", timezoneLabel: "WIB" },
  { id: "denpasar", name: "Denpasar", timezone: "Asia/Makassar", timezoneLabel: "WITA" },
  { id: "makassar", name: "Makassar", timezone: "Asia/Makassar", timezoneLabel: "WITA" },
  { id: "jayapura", name: "Jayapura", timezone: "Asia/Jayapura", timezoneLabel: "WIT" },
];

export const sampleProfiles: DemoProfile[] = [
  {
    id: "u_demo_1",
    name: "Alya",
    age: 26,
    city: "Jakarta",
    birthDate: "1998-08-17",
    birthTime: "23:58",
    bio: "Suka ngobrol soal musik, journaling, dan jalan malam setelah hujan.",
    intent: "Cari koneksi yang terasa hangat dan tidak canggung.",
  },
  {
    id: "u_demo_2",
    name: "Raka",
    age: 27,
    city: "Makassar",
    birthDate: "1997-03-24",
    birthTime: "06:30",
    bio: "Product designer yang suka laut, kopi pahit, dan obrolan yang jujur.",
    intent: "Mencari partner ngobrol yang spontan tapi tetap lembut.",
  },
  {
    id: "u_demo_3",
    name: "Nadya",
    age: 24,
    city: "Surabaya",
    birthDate: "2000-10-05",
    birthTime: "12:18",
    bio: "Leo moon energy, suka pamer playlist dan ngajak orang coba restoran baru.",
    intent: "Mau cari teman yang gampang nyambung buat chat harian.",
  },
  {
    id: "u_demo_4",
    name: "Bimo",
    age: 29,
    city: "Denpasar",
    birthDate: "1995-12-29",
    birthTime: "17:44",
    bio: "Tenang di awal, cerewet kalau sudah nyaman. Suka yoga dan fotografi.",
    intent: "Prefer koneksi yang tumbuh pelan tapi konsisten.",
  },
  {
    id: "u_demo_5",
    name: "Keisha",
    age: 25,
    city: "Jayapura",
    birthDate: "1999-06-14",
    birthTime: "08:02",
    bio: "Enerjik, suka video call random, dan punya banyak cerita lucu soal keluarga.",
    intent: "Cari orang yang bisa jadi teman curhat sekaligus teman seru.",
  },
  {
    id: "u_demo_6",
    name: "Arif",
    age: 28,
    city: "Jakarta",
    birthDate: "1996-02-11",
    birthTime: "21:05",
    bio: "Pendengar yang baik, suka nonton sci-fi, dan penasaran sama dinamika zodiac.",
    intent: "Mau mulai dari obrolan ringan lalu lihat chemistry-nya.",
  },
];

export const seededChatMessages: Record<string, ChatMessage[]> = {
  "u_demo_1__u_demo_2": [
    {
      id: "m_seed_1",
      from: "u_demo_2",
      to: "u_demo_1",
      text: "Halo Alya, aku lihat kita sama-sama suka ngobrol yang jujur. Biasanya kamu recharge dengan cara apa?",
      sentAt: "2026-03-17T09:01:00.000Z",
    },
  ],
  "u_demo_1__u_demo_3": [
    {
      id: "m_seed_2",
      from: "u_demo_3",
      to: "u_demo_1",
      text: "Kalau first date versi kamu itu ngobrol santai atau langsung cari aktivitas seru?",
      sentAt: "2026-03-17T08:44:00.000Z",
    },
  ],
};
