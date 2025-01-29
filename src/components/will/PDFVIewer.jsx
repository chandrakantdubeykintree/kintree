import { useState, Suspense } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  RotateCw,
} from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import toast from "react-hot-toast";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export default function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error) {
    console.error("PDF Load Error:", error);
    setError("Failed to load PDF. Please try again later.");
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(url.replace("https://api.kintree.com", ""), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  if (!url) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-lg">
        <p className="text-gray-500">No PDF document available</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center bg-gray-100 rounded-lg p-6 shadow-md ${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
      }`}
    >
      {error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-4 flex-wrap justify-center">
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pageNumber} of {numPages || "--"}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, numPages))
                }
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-20 text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={scale >= 2.0}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Additional Tools */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRotate}
                className="rounded-full"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="rounded-full"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                className="rounded-full"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className={`relative ${
              isFullscreen
                ? "flex-1 w-full flex items-center justify-center"
                : ""
            }`}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[600px] w-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <Document
                file={{
                  url: url.replace("https://api.kintree.com", ""),
                  httpHeaders: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  withCredentials: true,
                }}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-[600px] w-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                  scale={scale}
                  rotate={rotation}
                  width={isFullscreen ? null : 400}
                />
              </Document>
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}
