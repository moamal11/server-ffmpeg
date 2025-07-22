import express from "express";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// إنشاء المجلدات إذا لم تكن موجودة
["uploads", "compressed"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const upload = multer({ dest: "uploads/" });

app.post("/compress", upload.single("video"), (req, res) => {
  const inputPath = req.file.path;
  const outputFile = `${Date.now()}-compressed.mp4`;
  const outputPath = path.join("compressed", outputFile);

  ffmpeg(inputPath)
    .outputOptions(["-vcodec libx264", "-crf 28", "-preset ultrafast", "-vf scale=640:-2"])
    .save(outputPath)
    .on("end", () => {
      res.json({ url: `/compressed/${outputFile}` });
    });
});

app.use("/compressed", express.static(path.join(__dirname, "compressed")));
app.listen(process.env.PORT || 3000, () => console.log("FFmpeg Server running"));
