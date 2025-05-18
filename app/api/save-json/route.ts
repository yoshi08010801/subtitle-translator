// app/api/save-json/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const filePath = path.join(process.cwd(), "public", "subtitle_regions.json");

  try {
    await writeFile(filePath, JSON.stringify(json, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("保存失敗:", error);
    return new NextResponse("保存に失敗しました", { status: 500 });
  }
}
