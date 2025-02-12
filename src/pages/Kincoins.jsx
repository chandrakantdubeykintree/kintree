import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import KincoinsEntryBanner from "@/components/kincoins-entry-banner";
import ReactConfetti from "react-confetti";

export default function Kincoins() {
  const [showBanner, setShowBanner] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 3000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {showBanner && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-[fadeIn_0.3s_ease-in]">
          <div className="container max-w-4xl mx-auto px-4">
            <KincoinsEntryBanner />
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={300}
              recycle={true}
              gravity={0.5}
            />
          </div>
        </div>
      )}
      <Card className="bg-background rounded-2xl h-full">
        <div className="w-full h-full flex items-center justify-center p-4">
          <img
            src="/illustrations/illustrations_cs.png"
            className="object-cover rounded-lg max-w-4xl w-full h-auto"
          />
        </div>
      </Card>
    </>
  );
}
