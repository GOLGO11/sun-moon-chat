import type { ReadingRequest, ReadingResult } from "@/src/types/demo";

const blockedPatterns = [
  /(mati|meninggal|death|die)/i,
  /(sakit|kanker|penyakit|stroke)/i,
  /(bencana|kecelakaan|disaster)/i,
  /(pasti kaya|pasti untung|jamin profit|cepat kaya)/i,
];

export function composeReading(request: ReadingRequest): ReadingResult {
  if (!request.chart.sun || !request.chart.moon || !request.chart.ascendant) {
    throw new Error("CHART_REQUIRED");
  }

  const blocked = blockedPatterns.some((pattern) => pattern.test(request.prompt));

  if (blocked) {
    return {
      blocked: true,
      reason: "SAFETY_REDIRECT",
      answer:
        "Aku tidak bisa memberi prediksi fatalistik soal kesehatan, kematian, bencana, atau kepastian finansial. Kalau kamu mau, aku bisa bantu membaca pola emosi, komunikasi, dan relasi yang lebih aman dari chart-mu.",
    };
  }

  return {
    blocked: false,
    answer: `Dengan Matahari ${request.chart.sun}, Bulan ${request.chart.moon}, dan Ascendant ${request.chart.ascendant}, energi utamamu minggu ini terasa hangat tapi selektif. Kamu cenderung lebih mudah nyambung saat obrolan dimulai dari rasa aman dulu, lalu berkembang ke topik yang personal. Gunakan rasa penasaranmu sebagai pembuka, bukan tekanan untuk cepat cocok. Ini bersifat interpretif, bukan sains.`,
  };
}
