"use client";

import { useRef, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

interface Region {
  id: number;
  start: number;
  end: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([
    {
      id: 1,
      start: 30,
      end: 90,
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(regions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitle_regions.json";
    a.click();
  };

  const exportFirstClip = async () => {
    if (!videoFile || regions.length === 0) return;
    setIsProcessing(true);

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    const first = regions[0];
    const start = first.start / 30; // フレーム → 秒（仮に30fps）
    const duration = (first.end - first.start) / 30;

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));

    await ffmpeg.run(
      "-i",
      "input.mp4",
      "-ss",
      `${start}`,
      "-t",
      `${duration}`,
      "-c:v",
      "copy",
      "clip.mp4"
    );

    const data = ffmpeg.FS("readFile", "clip.mp4");
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));

    const a = document.createElement("a");
    a.href = url;
    a.download = "clip.mp4";
    a.click();

    setIsProcessing(false);
  };

  return (
    <main className="flex flex-col items-center p-8 gap-4">
      <h1 className="text-2xl font-bold">🎬 動画アップロード + JSON保存 + 切り出し</h1>

      <input type="file" accept="video/*" onChange={handleUpload} className="border p-2" />
      {videoURL && <video src={videoURL} controls width={640} ref={videoRef} />}

      <button
        onClick={downloadJSON}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        💾 JSONとして保存
      </button>

      <button
        onClick={exportFirstClip}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isProcessing}
      >
        ✂️ 最初の範囲を動画で切り出して保存
      </button>
    </main>
  );
}
