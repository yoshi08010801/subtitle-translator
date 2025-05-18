// src/hooks/useOcrWorker.ts
import { useEffect, useRef } from "react";
import * as Tesseract from "tesseract.js";
import type { Worker } from "tesseract.js";

export function useOcrWorker(
  lang: string,
  langPath = "/tessdata",            // public/tessdata に traineddata を置いておく
) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR 時はなにもしない
    let cancelled = false;

    (async () => {
      // v2 系の default import なら .load() が使えます
      const worker = Tesseract.createWorker({ langPath });
      await worker.load();
      await worker.loadLanguage(lang);
      await worker.initialize(lang);
      await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
        tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
        tessedit_char_whitelist:
          "あ-んア-ン一-龥A-Za-z0-9。、！？ー",
      });

      if (!cancelled) {
        workerRef.current = worker;
      } else {
        await worker.terminate();
      }
    })();

    return () => {
      cancelled = true;
      workerRef.current?.terminate();
    };
  }, [lang, langPath]);

  return workerRef;
}
