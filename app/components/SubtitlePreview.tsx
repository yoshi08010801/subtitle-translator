import React from "react";
import {
  makeSRT,
  makeTranslatedSRT,
  type Subtitle,
} from "@/lib/subtitle";

type Props = {
  subtitles: Subtitle[];
  previewMode: "original" | "translated";
  setPreviewMode: (mode: "original" | "translated") => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  isTranslating: boolean;
  translateAll: () => void;
  download: (translated?: boolean) => void;
  ctrlBox: React.CSSProperties;
};

export default function SubtitlePreview({
  subtitles,
  previewMode,
  setPreviewMode,
  apiKey,
  setApiKey,
  isTranslating,
  translateAll,
  download,
  ctrlBox,
}: Props) {
  return (
    <div
      style={{
        background: "#f5f5f5",
        padding: 12,
        borderRadius: 6,
        maxHeight: "50vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Preview</h3>

          <button
            onClick={() => setPreviewMode("original")}
            disabled={previewMode === "original"}
          >
            ⑧ Original
          </button>

          <button
            onClick={() => setPreviewMode("translated")}
            disabled={
              previewMode === "translated" ||
              !subtitles.some((s) => s.translated)
            }
          >
            ⑧ Translated
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => download(false)}>
            ⑨ Download Original
          </button>

          <label style={ctrlBox}>
            ⑩ API Key
            <input
              type="password"
              placeholder="OpenAI API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ marginLeft: 6, width: 200 }}
            />
          </label>

          <button onClick={translateAll} disabled={isTranslating}>
            {isTranslating ? "Translating…" : "⑪ ▶ Translate"}
          </button>

          <button onClick={() => download(true)}>
            ⑫ Download Translated
          </button>
        </div>
      </div>

      {subtitles.length > 0 ? (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {previewMode === "original"
            ? makeSRT(subtitles)
            : makeTranslatedSRT(subtitles)}
        </pre>
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>
          No OCR results yet
        </p>
      )}
    </div>
  );
}
