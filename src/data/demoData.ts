import type { MemorizationStatus, Student, Surah, SurahProgress } from "../types";

export const surahs: Surah[] = [
  { number: 1, name: "Al-Fatihah", arabicName: "الفاتحة", meaning: "Pembukaan", verses: 7 },
  { number: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", meaning: "Keikhlasan", verses: 4 },
  { number: 113, name: "Al-Falaq", arabicName: "الفلق", meaning: "Waktu Subuh", verses: 5 },
  { number: 114, name: "An-Nas", arabicName: "الناس", meaning: "Manusia", verses: 6 },
  { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", meaning: "Nikmat yang Melimpah", verses: 3 },
  { number: 103, name: "Al-Asr", arabicName: "العصر", meaning: "Masa", verses: 3 },
  { number: 107, name: "Al-Ma'un", arabicName: "الماعون", meaning: "Bantuan Kecil", verses: 7 },
  { number: 106, name: "Quraysh", arabicName: "قريش", meaning: "Kaum Quraisy", verses: 4 },
  { number: 105, name: "Al-Fil", arabicName: "الفيل", meaning: "Gajah", verses: 5 },
  { number: 97, name: "Al-Qadr", arabicName: "القدر", meaning: "Kemuliaan", verses: 5 },
];

const sampleLearners = [
  { id: "student-01", name: "Aisyah Hanim", className: "Tahun 2", lastActivity: "Hari ini" },
  { id: "student-02", name: "Adam Firdaus", className: "Tahun 1", lastActivity: "Hari ini" },
  { id: "student-03", name: "Nur Iman", className: "Tahun 3", lastActivity: "Semalam" },
  { id: "student-04", name: "Harith Danish", className: "Tahun 2", lastActivity: "Semalam" },
  { id: "student-05", name: "Sofea Maisarah", className: "Tahun 1", lastActivity: "2 hari lalu" },
  { id: "student-06", name: "Muhammad Rayyan", className: "Tahun 3", lastActivity: "2 hari lalu" },
  { id: "student-07", name: "Dania Humaira", className: "Tahun 2", lastActivity: "3 hari lalu" },
  { id: "student-08", name: "Irfan Hakimi", className: "Tahun 1", lastActivity: "3 hari lalu" },
  { id: "student-09", name: "Hana Sofiya", className: "Tahun 3", lastActivity: "Minggu lalu" },
  { id: "student-10", name: "Ziyad Arif", className: "Tahun 2", lastActivity: "Minggu lalu" },
];

const statusForSurah = (studentIndex: number, surahIndex: number): MemorizationStatus => {
  if (surahIndex < 2 + (studentIndex % 4)) return "memorized";
  if (surahIndex === 2 + (studentIndex % 4)) return "in-progress";
  return "not-started";
};

const makeProgress = (studentIndex: number): SurahProgress[] =>
  surahs.map((surah, surahIndex) => {
    const status = statusForSurah(studentIndex, surahIndex);
    const completed = status === "memorized";
    const day = String(Math.max(1, 15 - studentIndex - surahIndex)).padStart(2, "0");

    return {
      surahNumber: surah.number,
      status,
      mastery: completed ? 3 + ((studentIndex + surahIndex) % 3) : status === "in-progress" ? 2 : 0,
      memorizedOn: completed ? `2026-10-${day}` : null,
      verified: completed && (studentIndex + surahIndex) % 3 !== 0,
      note: status === "in-progress" ? "Sedang mengulang ayat sebelum semakan seterusnya." : "",
    };
  });

export const demoStudents: Student[] = sampleLearners.map((learner, index) => ({
  ...learner,
  progress: makeProgress(index),
}));

export const completionCount = (progress: SurahProgress[]) =>
  progress.filter((item) => item.status === "memorized").length;

export const verificationCount = (progress: SurahProgress[]) =>
  progress.filter((item) => item.status === "memorized" && !item.verified).length;

export const progressPercent = (progress: SurahProgress[]) =>
  Math.round((completionCount(progress) / surahs.length) * 100);

export const formatMemorizationStatus = (status: MemorizationStatus) => {
  switch (status) {
    case "not-started":
      return "Belum bermula";
    case "in-progress":
      return "Sedang dihafaz";
    case "memorized":
      return "Telah dihafaz";
  }
};
