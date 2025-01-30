import express from "express";
import { getLinkPreview } from "link-preview-js";
import cors from "cors";

const router = express.Router();

// Configure CORS
const corsOptions = {
  origin: import.meta.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};

router.get("/link-preview", cors(corsOptions), async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const metadata = await getLinkPreview(url, {
      timeout: 3000,
      followRedirects: "follow",
      headers: {
        "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
      },
    });

    return res.json({
      title: metadata.title,
      description: metadata.description || "",
      image: metadata.images?.[0] || "",
      url: url,
      siteName: metadata.siteName || new URL(url).hostname,
    });
  } catch (error) {
    console.error("Link preview error:", error);
    return res.status(500).json({ error: "Failed to fetch link preview" });
  }
});

export default router;
