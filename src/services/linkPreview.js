import axios from "axios";

export async function fetchLinkPreview(url) {
  try {
    const response = await axios.get(
      `/api/link-preview?url=${encodeURIComponent(url)}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      title: response.data.title || "No title available",
      description: response.data.description || "",
      image: response.data.image || "",
      url: url,
      siteName: response.data.siteName || new URL(url).hostname,
    };
  } catch (error) {
    return createFallbackPreview(url);
  }
}

function createFallbackPreview(url) {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return {
      title: domain,
      description: "",
      image: "",
      url: url,
      siteName: domain,
      isError: true,
    };
  } catch (e) {
    return {
      title: "Link Preview",
      description: "",
      image: "",
      url: url,
      siteName: "Unknown",
      isError: true,
    };
  }
}
