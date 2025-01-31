import { getLinkPreview } from "link-preview-js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  try {
    const url = req.query.url;

    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    const metadata = await getLinkPreview(url, {
      timeout: 5000,
      followRedirects: "follow",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    res.json({
      title: metadata.title || "No title available",
      description: metadata.description || "",
      image: metadata.images?.[0] || "",
      url: url,
      siteName: metadata.siteName || new URL(url).hostname,
    });
  } catch (error) {
    console.error("Link preview error:", error);
    res.status(500).json({
      error: "Failed to fetch link preview",
      message: error.message,
    });
  }
}
