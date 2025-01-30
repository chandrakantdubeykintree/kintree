import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function LinkPreview({ url }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch preview");
        }

        const data = await response.json();
        setPreview(data);
      } catch (err) {
        console.error("Link preview error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url]);

  if (loading) {
    return (
      <Card className="mt-2 overflow-hidden">
        <div className="flex gap-4 p-4">
          <Skeleton className="h-24 w-24" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </Card>
    );
  }

  if (error || !preview) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 no-underline hover:no-underline"
    >
      <Card className="overflow-hidden hover:bg-gray-50 transition-colors">
        <div className="flex gap-4 p-4">
          {preview.image && (
            <img
              src={preview.image}
              alt={preview.title}
              className="h-24 w-24 object-cover rounded-md"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2">
              {preview.title}
            </h3>
            {preview.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {preview.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1 truncate">
              {preview.siteName || new URL(url).hostname}
            </p>
          </div>
        </div>
      </Card>
    </a>
  );
}
