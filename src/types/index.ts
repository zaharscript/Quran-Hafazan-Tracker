export type MemorizationStatus = "not-started" | "in-progress" | "memorized";

export type SurahProgress = {
  surahNumber: number;
  status: MemorizationStatus;
  mastery: number;
  memorizedOn: string | null;
  verified: boolean;
  note: string;
};

export type Student = {
  id: string;
  name: string;
  className: string;
  progress: SurahProgress[];
  lastActivity: string;
};

export type Surah = {
  number: number;
  name: string;
  arabicName: string;
  meaning: string;
  verses: number;
};
