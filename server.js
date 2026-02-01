import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/enhance", upload.single("image"), async (req, res) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-x4-upscaler",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: req.file.buffer,
      }
    );

    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: "Enhancement failed" });
  }
});

app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: req.file.buffer,
      }
    );

    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: "BG remove failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

