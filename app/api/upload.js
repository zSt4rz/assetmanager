import { IncomingForm } from "formidable";
import fs from "fs";
import { spawn } from "child_process";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  const form = new IncomingForm({ uploadDir: "./public/uploads", keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing file" });
    }

    const filePath = files.file.filepath;

    const python = spawn("python3", ["scripts/analyze.py", filePath]);

    let result = "";
    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    python.on("close", () => {
      res.status(200).json({ message: result.trim() });
    });
  });
}
