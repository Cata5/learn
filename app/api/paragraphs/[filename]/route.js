import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), "public", "paragraphs", `${filename}`);
  
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } else {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
