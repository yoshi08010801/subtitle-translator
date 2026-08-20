export interface Subtitle {
  index: number;
  start: string;
  end: string;
  text: string;
  translated?: string;
}

export const OCR_LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "jpn", name: "Japanese" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
];

export const TRANSLATE_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
];

export function formatTime(sec: number) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  const ms = String(Math.floor((sec % 1) * 1000)).padStart(3, "0");
  return `${h}:${m}:${s},${ms}`;
}

export function makeSRT(subs: Subtitle[]) {
  return subs
    .map((s) => `${s.index}\n${s.start} --> ${s.end}\n${s.text}`)
    .join("\n\n");
}

export function makeTranslatedSRT(subs: Subtitle[]) {
  return subs
    .map((s) => `${s.index}\n${s.start} --> ${s.end}\n${s.translated || ""}`)
    .join("\n\n");
}
