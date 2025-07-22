// server.js
import express from "express";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const upload = multer({ dest: "uploads/" });
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.post("/compress", upload.single("video"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join("compressed", `${Date.now()}-output.mp4`);

  ffmpeg(inputPath)
    .outputOptions([
      "-vcodec libx264",
      "-crf 28",
      "-preset ultrafast",
      "-vf scale=640:-2",
    ])
    .save(outputPath)
    .on("end", () => {
      res.json({ url: `http://localhost:5000/${outputPath}` });
    });
});

app.use("/compressed", express.static(path.join(__dirname, "compressed")));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
