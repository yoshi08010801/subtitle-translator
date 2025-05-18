import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export async function POST(request: Request) {
  const { filename, data, region } = await request.json() as {
    filename: string;
    data: string;
    region: { x:number; y:number; width:number; height:number; };
  };

  const uploadDir = path.join(process.cwd(), "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });
  const uploadPath = path.join(uploadDir, filename);
  fs.writeFileSync(uploadPath, Buffer.from(data, "base64"));

  const script = path.join(process.cwd(), "ocr_pipeline.py");
  const args = [script, uploadPath, JSON.stringify(region)];
  const py = spawn("python3", args, {
    cwd: process.cwd(),
    stdio: ["ignore", "ignore", "pipe"],
  });

  let stderr = "";
  for await (const chunk of py.stderr) {
    stderr += chunk.toString();
  }
  const code = await new Promise<number>((r) => py.on("close", r));
  if (code !== 0) {
    return NextResponse.json({ error: stderr }, { status: 500 });
  }

  const srt = fs.readFileSync(path.join(process.cwd(), "output.srt"), "utf-8");
  return NextResponse.json({ srt });
}
