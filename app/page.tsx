"use client";

import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  DragEvent,
} from "react";
import { useOcrWorker } from "@/hooks/useOcrWorker";
import SubtitlePreview from "./components/SubtitlePreview";
import {
  OCR_LANGUAGES,
  TRANSLATE_LANGUAGES,
  formatTime,
  makeSRT,
  makeTranslatedSRT,
  type Subtitle,
} from "@/lib/subtitle";
import type * as Tesseract from "tesseract.js";


type Region = { x: number; y: number; width: number; height: number };

const REGION_MARGIN = 5;

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [region, setRegion] = useState<Region | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  // デフォルトを English に変更
  const [ocrLang, setOcrLang] = useState("eng");
  const [translateTarget, setTranslateTarget] = useState("en");
  const [exportFmt, setExportFmt] = useState<"srt" | "txt">("srt");
  const [apiKey, setApiKey] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [frameStep, setFrameStep] = useState(0.5);
  const [previewMode, setPreviewMode] = useState<"original" | "translated">("original");
  const [showHelp, setShowHelp] = useState(false);

  const workerRef = useOcrWorker(ocrLang, "/tessdata");

  const ctrlBox: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: 4,
    cursor: "pointer",
  };

  // video と canvas のサイズ同期
  useEffect(() => {
    const sync = () => {
      const v = videoRef.current;
      const c = canvasRef.current;
      if (!v || !c) return;
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.style.width = `${v.clientWidth}px`;
      c.style.height = `${v.clientHeight}px`;
    };
    window.addEventListener("resize", sync);
    videoRef.current?.addEventListener("loadedmetadata", sync);
    sync();
    return () => {
      window.removeEventListener("resize", sync);
      videoRef.current?.removeEventListener("loadedmetadata", sync);
    };
  }, [videoURL]);

  // drawMode が ON のときだけ赤枠を描画
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    if (drawMode && region) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(region.x, region.y, region.width, region.height);
    }
  }, [region, drawMode]);

  // ファイル選択／ドロップ
  const handleFile = (f: File) => {
    setVideoURL(URL.createObjectURL(f));
    setFileName(f.name);
    setRegion(null);
    setSubtitles([]);
  };
  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      handleFile(f);
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(f);
        fileInputRef.current.files = dt.files;
      }
    }
  };

  // 領域選択ツール
  const getMousePos = (e: MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * c.width) / rect.width,
      y: ((e.clientY - rect.top) * c.height) / rect.height,
    };
  };
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawMode) return;
    setStartPos(getMousePos(e));
    setRegion(null);
    setSubtitles([]);
  };
  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawMode || !startPos) return;
    const p = getMousePos(e);
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(startPos.x, startPos.y, p.x - startPos.x, p.y - startPos.y);
  };
  const onMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawMode || !startPos) {
      setStartPos(null);
      return;
    }
    const end = getMousePos(e);
    const x0 = Math.min(startPos.x, end.x);
    const y0 = Math.min(startPos.y, end.y);
    const w0 = Math.abs(end.x - startPos.x);
    const h0 = Math.abs(end.y - startPos.y);
    setRegion({
      x: Math.max(0, x0 - REGION_MARGIN),
      y: Math.max(0, y0 - REGION_MARGIN),
      width: w0 + REGION_MARGIN * 2,
      height: h0 + REGION_MARGIN * 2,
    });
    setStartPos(null);
  };

  // OCR抽出（領域未指定時は動画全体）
  const autoExtract = async () => {
    if (!videoRef.current) return;
    setIsExtracting(true);
    const v = videoRef.current;
    const fullRegion = { x: 0, y: 0, width: v.videoWidth, height: v.videoHeight };
    const useRegion = region || fullRegion;
    const marginY = useRegion.height * 0.1;
    const roi = {
      x: useRegion.x,
      y: useRegion.y + marginY,
      width: useRegion.width,
      height: useRegion.height - marginY * 2,
    };
    const sw = Math.floor(roi.width),
      sh = Math.floor(roi.height),
      frameCount = Math.floor(v.duration);
    const worker = workerRef.current!;
    const out: Subtitle[] = [];
    const off = document.createElement("canvas");
    off.width = sw;
    off.height = sh;
    const ctxOff = off.getContext("2d")!;

    for (let t = 0; t < frameCount; t += frameStep) {
      v.currentTime = t;
      await new Promise<void>((res) => {
        const hnd = () => { v.removeEventListener("seeked", hnd); res(); };
        v.addEventListener("seeked", hnd);
      });
      ctxOff.clearRect(0, 0, sw, sh);
      ctxOff.drawImage(v, roi.x, roi.y, roi.width, roi.height, 0, 0, sw, sh);
      ctxOff.filter = "blur(1px)";
      ctxOff.drawImage(off, 0, 0);
      ctxOff.filter = "contrast(200%) brightness(120%)";
      ctxOff.drawImage(off, 0, 0);
      ctxOff.filter = "none";
      const img = ctxOff.getImageData(0, 0, sw, sh);
      for (let i = 0; i < img.data.length; i += 4) {
        const g =
          0.299 * img.data[i] +
          0.587 * img.data[i + 1] +
          0.114 * img.data[i + 2];
        const gg = 255 * Math.pow(g / 255, 0.5);
        img.data[i] = img.data[i + 1] = img.data[i + 2] = gg;
      }
      ctxOff.putImageData(img, 0, 0);

      await worker.setParameters({
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:.,",
        tessedit_pageseg_mode: "6" as Tesseract.PSM,
      });
      const {
        data: { text },
      } = await worker.recognize(off);
      const txt = text.trim();
      if (txt) {
        out.push({
          index: out.length + 1,
          start: formatTime(t),
          end: formatTime(t + frameStep),
          text: txt,
        });
      }
    }

    setSubtitles(out);
    setIsExtracting(false);
  };

  // 翻訳（OpenAI）
  const translateAll = async () => {
    if (!apiKey) {
      alert("Please enter API Key");
      return;
    }
    setIsTranslating(true);
    const updated = await Promise.all(
      subtitles.map(async (s) => {
        const res = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ 
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: `Translate the following into ${TRANSLATE_LANGUAGES.find(
                    (l) => l.code === translateTarget
                  )?.name}.`,
                },
                { role: "user", content: s.text },
              ],
            }),
          }
        );
        const j = await res.json();
        return {
          ...s,
          translated: j.choices?.[0]?.message?.content.trim(),
        };
      })
    );
    setSubtitles(updated);
    setPreviewMode("translated");
    setIsTranslating(false);
  };

  // ダウンロード
  const download = (translated = false) => {
    const text =
      exportFmt === "srt"
        ? translated
          ? makeTranslatedSRT(subtitles)
          : makeSRT(subtitles)
        : subtitles
            .map((s) => (translated ? s.translated : s.text))
            .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subtitles${
      translated ? "_translated" : ""
    }.${exportFmt}`;
    a.click();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 900 }}>
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>
          Subtitle Extract & Translate
        </h2>

        {fileName && (
          <p
            style={{
              textAlign: "center",
              margin: 0,
              marginBottom: 12,
              color: "#555",
            }}
          >
            Selected file: <strong>{fileName}</strong>
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
            marginBottom: 4,
          }}
        >
          <label style={ctrlBox}>
            ① Select File
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={onUpload}
              style={{ display: "none" }}
            />
          </label>
          <label style={ctrlBox}>
            ② Interval: {frameStep.toFixed(1)}s
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={frameStep}
              onChange={(e) => setFrameStep(Number(e.target.value))}
            />
          </label>
          <label style={ctrlBox}>
            ③ OCR Lang
            <select
              value={ocrLang}
              onChange={(e) => setOcrLang(e.target.value)}
            >
              {OCR_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label style={ctrlBox}>
            ④ Translate To
            <select
              value={translateTarget}
              onChange={(e) => setTranslateTarget(e.target.value)}
            >
              {TRANSLATE_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label style={ctrlBox}>
            ⑤ Output Format
            <select
              value={exportFmt}
              onChange={(e) => setExportFmt(e.target.value as "srt" | "txt")}
            >
              <option value="srt">.srt</option>
              <option value="txt">.txt</option>
            </select>
          </label>
          <button
            onClick={() => setDrawMode((f) => !f)}
            style={ctrlBox}
          >
            {drawMode ? "⑥ Region ON" : "⑥ Region OFF"}
          </button>
          <button onClick={() => setShowHelp((f) => !f)}>❓ Help</button>
        </div>

        {showHelp && (
          <div
            style={{
              background: "#eef",
              border: "1px solid #ccd",
              borderRadius: 4,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <p>
              <strong>① Select File:</strong> Load video
            </p>
            <p>
              <strong>② Interval:</strong> Frame sampling interval
            </p>
            <p>
              <strong>③ OCR Lang:</strong> Choose OCR language
            </p>
            <p>
              <strong>④ Translate To:</strong> Choose target language
            </p>
            <p>
              <strong>⑤ Output Format:</strong> .srt or .txt
            </p>
            <p>
              <strong>⑥ Region Mode:</strong> Enable/disable region selection
            </p>
            <hr style={{ margin: "8px 0" }} />
            <p>
              <strong>⑦ ▶ Extract OCR</strong>
            </p>
            <p>
              <strong>⑧ Preview Toggle:</strong> Original / Translated
            </p>
            <p>
              <strong>⑨ Download Original</strong>
            </p>
            <p>
              <strong>⑩ API Key</strong>
            </p>
            <p>
              <strong>⑪ ▶ Translate</strong>
            </p>
            <p>
              <strong>⑫ Download Translated</strong>
            </p>
          </div>
        )}

        {videoURL ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            style={{
              position: "relative",
              aspectRatio: "16/9",
              border: "2px solid #ccc",
              borderRadius: 6,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <video
              ref={videoRef}
              src={videoURL}
              controls
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: drawMode ? "crosshair" : "default",
                pointerEvents: drawMode ? "auto" : "none",
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
            />
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            style={{
              aspectRatio: "16/9",
              border: "2px dashed #aaa",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              marginBottom: 12,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48 }}>🎬</div>
              <div>Drop or select a video</div>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <button onClick={autoExtract} disabled={isExtracting}>
            {isExtracting ? "Extracting…" : "⑦ ▶ Extract OCR"}
          </button>
        </div>

        <SubtitlePreview
          subtitles={subtitles}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          apiKey={apiKey}
          setApiKey={setApiKey}
          isTranslating={isTranslating}
          translateAll={translateAll}
          download={download}
          ctrlBox={ctrlBox}
        />
      </div>
    </div>
  );
}
