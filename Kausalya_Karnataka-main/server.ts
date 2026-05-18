import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate Service Description or Suggestion
  app.post("/api/gemini/suggest-service", async (req, res) => {
    try {
      const { trade, task } = req.body;
      const prompt = `You are an expert ${trade} consultant in India. A worker wants to list a service: "${task}". 
      Write a professional, catchy description (max 20 words) and suggest a fair 'Starting price' in Rupees (INR). 
      Format: Description | Price`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ suggestion: response.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate suggestion" });
    }
  });

  // API Route: Community Insights
  app.get("/api/community/insights", async (req, res) => {
    try {
      // In a real app, this would aggregate Firestore data.
      // For this demo, we'll return some curated "insights" that feel professional.
      const insights = {
        totalPros: 142,
        activeThisWeek: 28,
        communityRating: 4.8,
        totalJobsFacilitated: 1250,
        localImpact: "Karnataka's small businesses saw a 15% increase in visibility this quarter."
      };
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
