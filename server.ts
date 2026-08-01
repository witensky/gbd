import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || '127.0.0.1';

  app.use(express.json({ limit: "10mb" }));

  // File to persist recipient answers
  const dataDir = path.join(process.cwd(), "data");
  const answersFilePath = path.join(dataDir, "answers.json");

  // Ensure data folder exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // GET answers
  app.get("/api/answers", (req, res) => {
    try {
      if (fs.existsSync(answersFilePath)) {
        const fileData = fs.readFileSync(answersFilePath, "utf-8");
        const answers = JSON.parse(fileData);
        return res.json({ success: true, answers });
      }
      return res.json({ success: true, answers: [] });
    } catch (err) {
      console.error("Error reading answers:", err);
      return res.status(500).json({ success: false, error: "Failed to read answers" });
    }
  });

  // POST new answer
  app.post("/api/answers", (req, res) => {
    try {
      const { answerText, recipientName, senderName } = req.body;
      if (!answerText || typeof answerText !== "string") {
        return res.status(400).json({ success: false, error: "Invalid answer text" });
      }

      let existingAnswers: any[] = [];
      if (fs.existsSync(answersFilePath)) {
        try {
          const fileData = fs.readFileSync(answersFilePath, "utf-8");
          existingAnswers = JSON.parse(fileData);
        } catch {
          existingAnswers = [];
        }
      }

      const newAnswer = {
        id: "ans-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        answerText: answerText.trim(),
        recipientName: recipientName || "Mon Amour",
        senderName: senderName || "Ton Âme Sœur",
        submittedAt: new Date().toISOString()
      };

      existingAnswers.unshift(newAnswer);
      fs.writeFileSync(answersFilePath, JSON.stringify(existingAnswers, null, 2), "utf-8");

      console.log("New love response saved:", newAnswer);
      return res.json({ success: true, answer: newAnswer });
    } catch (err) {
      console.error("Error saving answer:", err);
      return res.status(500).json({ success: false, error: "Failed to save answer" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`❤️ Romantic Love Website Server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
