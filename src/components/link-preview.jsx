import { useState, useEffect } from "react";
import { fetchLinkPreview } from "@/services/linkPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const LinkPreview = ({ url, className }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const getInitial = (siteName) => {
    return siteName?.charAt(0)?.toUpperCase() || "L";
  };
  const getRandomColor = (text) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-yellow-100 text-yellow-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
    ];
    const index = text?.length % colors.length || 0;
    return colors[index];
  };
  const getLinkPreview = async (targetUrl) => {
    try {
      setLoading(true);
      // For development
      if (import.meta.env.DEV) {
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(targetUrl)}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPreview(data);
        return;
      }

      // For production
      const data = await fetchLinkPreview(targetUrl);
      setPreview(data);
    } catch (error) {
      console.error("Error fetching link preview:", error);
      setError(error.message);
      // Fallback preview
      setPreview({
        title: new URL(targetUrl).hostname,
        description: "Preview not available",
        image: "",
        url: targetUrl,
        siteName: new URL(targetUrl).hostname,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      getLinkPreview(url);
    }
  }, [url]);

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center space-x-4 p-4 border rounded-lg bg-card",
          className
        )}
      >
        <Skeleton className="h-24 w-24 rounded-md" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 p-3 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg border bg-card hover:bg-accent/50",
          className
        )}
      >
        <ExternalLink className="h-4 w-4" />
        <span className="truncate">{url}</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex overflow-hidden rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300",
        className
      )}
    >
      {preview.image ? (
        <div className="relative aspect-square w-24 flex-shrink-0 overflow-hidden sm:w-32">
          <img
            src={preview.image}
            alt={preview.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.classList.add("fallback-active");
            }}
          />
          <div
            className={cn(
              "absolute inset-0 hidden items-center justify-center",
              getRandomColor(preview.siteName),
              "fallback"
            )}
          >
            <span className="text-3xl font-semibold">
              {getInitial(preview.siteName)}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex aspect-square w-24 flex-shrink-0 items-center justify-center sm:w-32",
            getRandomColor(preview.siteName)
          )}
        >
          <span className="text-3xl font-semibold">
            {getInitial(preview.siteName)}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-1">
          <h3 className="font-medium leading-tight text-foreground line-clamp-2">
            {preview.title}
          </h3>
          {preview.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {preview.description}
            </p>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {preview.siteName}
          </span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
