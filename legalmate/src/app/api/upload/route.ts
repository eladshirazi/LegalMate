/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import extract from "pdf-text-extract";
import tmp from "tmp";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // צור קובץ זמני
    const tempFile = tmp.fileSync({ postfix: ".pdf" });
    await writeFile(tempFile.name, buffer);

    const text = await new Promise<string>((resolve, reject) => {
      extract(tempFile.name, (err: Error | null, pages: string[]) => {
        if (err) return reject(err);
        resolve(pages.join("\n"));
      });
    });

    tempFile.removeCallback(); // נקה את הקובץ אחרי

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("❌ PDF parsing error:", err?.message || err);
    return new Response(JSON.stringify({ error: err?.message || "Failed to parse PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
