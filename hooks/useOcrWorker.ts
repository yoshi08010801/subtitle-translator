// src/hooks/useOcrWorker.ts
import { useRef, useEffect } from "react";
import { createWorker, Worker } from "tesseract.js";

export function useOcrWorker(lang: string, langPath: string) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // v2.x API: createWorker で .load(), .loadLanguage(), .initialize() が使える
      const worker = createWorker({ langPath });
      await worker.load();              // core wasm を読み込み
      await worker.loadLanguage(lang);  // 言語データを読み込み
      await worker.initialize(lang);    // 初期化

      if (!mounted) {
        await worker.terminate();
        return;
      }

      workerRef.current = worker;
    })();

    return () => {
      mounted = false;
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [lang, langPath]);

  return workerRef;
}
