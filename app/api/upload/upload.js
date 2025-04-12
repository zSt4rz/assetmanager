// /app/api/upload/route.js
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = uuid() + path.extname(file.name);
  const filepath = path.join(process.cwd(), "public/uploads", filename);

  await writeFile(filepath, buffer);
  const imageUrl = `/uploads/${filename}`;

  return Response.json({ url: imageUrl });
}
