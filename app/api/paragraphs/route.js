import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  const { fileName, paragraphs } = await request.json();

  const filePath = path.join(process.cwd(), "public", "paragraphs", `${fileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(paragraphs));

  return NextResponse.json({ message: "Saved successfully!" });
}

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "public", "paragraphs");
    const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".json"));
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.error();
  }
}
