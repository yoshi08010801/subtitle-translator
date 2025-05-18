// app/components/VideoUploader.tsx
"use client";

import { useState, ChangeEvent, useEffect } from "react";

type Props = {
  onUpload: (url: string) => void;
};

export default function VideoUploader({ onUpload }: Props) {
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  // 親コンポーネントにも URL を渡す
  useEffect(() => {
    if (localUrl) {
      onUpload(localUrl);
    }
  }, [localUrl, onUpload]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalUrl(url);
  };

  return (
    <div style={{ marginBottom: 20, textAlign: "center" }}>
      <label
        style={{
          display: "inline-block",
          padding: "8px 16px",
          background: "#0070f3",
          color: "white",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 8,
        }}
      >
        動画ファイルを選択
        <input
          type="file"
          accept="video/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </label>

      {localUrl && (
        <video
          src={localUrl}
          controls
          style={{
            display: "block",
            width: "100%",
            maxWidth:  "600px",
            margin:    "0 auto",
            border:    "1px solid #ddd",
            borderRadius: 4,
          }}
        />
      )}
    </div>
  );
}
