import { getLinkPreview } from "link-preview-js";

export async function fetchLinkPreview(url) {
  try {
    const metadata = await getLinkPreview(url, {
      timeout: 5000,
      followRedirects: "follow",
      headers: {
        "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    return {
      title: metadata.title || "No title available",
      description: metadata.description || "",
      image: metadata.images?.[0] || "",
      url: url,
      siteName: metadata.siteName || new URL(url).hostname,
    };
  } catch (error) {
    throw new Error(`Failed to fetch link preview: ${error.message}`);
  }
}
