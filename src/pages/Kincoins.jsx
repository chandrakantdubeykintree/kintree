import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import KincoinsEntryBanner from "@/components/kincoins-entry-banner";
import ReactConfetti from "react-confetti";
import RedeemKincoins from "./RedeemKincoins";
import EarnKincoins from "./EarnKincoins";
import KincoinsTransactions from "./KincoinsTransactions";
import { useTranslation } from "react-i18next";
import { useKincoinsBalance } from "@/hooks/useKincoins";

export default function Kincoins() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("redeem");
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const { data: balanceData } = useKincoinsBalance();
  const kincoinsBalnce = parseInt(balanceData?.coin_balance) || 0;

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
    }, 2500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    const bannerTimer = setTimeout(() => {
      setShowBanner(false);
      setShowConfetti(true); // Start confetti after banner is hidden
    }, 2500); // Duration of the banner

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(bannerTimer);
    };
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false); // Stop confetti after 3 seconds
      }, 3000); // Duration of the confetti

      return () => clearTimeout(confettiTimer);
    }
  }, [showConfetti]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "redeem":
        return <RedeemKincoins kincoinsBalnce={kincoinsBalnce} />;
      case "earn":
        return <EarnKincoins />;
      case "transactions":
        return <KincoinsTransactions />;
      default:
        return null;
    }
  };

  return (
    <>
      {showBanner && (
        <div className="fixed inset-0 bg-black z-40 flex items-center justify-center animate-[fadeIn_0.3s_ease-in]">
          <div className="container max-w-4xl mx-auto px-4">
            <KincoinsEntryBanner />
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={100}
              recycle={true}
              gravity={0.5}
            />
          </div>
        </div>
      )}
      <Card className="bg-background rounded-2xl h-full overflow-y-scroll no_scrollbar">
        <div className="w-full flex items-center justify-between relative h-[227px] bg-[url('/kincoins/kincoins_banner.png')] bg-no-repeat bg-cover rounded-t-2xl">
          {/* <div className="absolute left-[5%]">
            <img
              src="/kincoins/kintree_coin.svg"
              className="h-full object-cover max-w-[250px] w-[125px]"
              style={{ zIndex: 1 }}
            />
          </div> */}
          <div className="flex-1 flex gap-1 flex-col items-center justify-center z-10">
            {/* <div className="font-medium text-primary rounded-md px-2 py-1 bg-white flex items-center">
              {t("rewards")}
            </div> */}
            <div className="flex items-center justify-center">
              <img
                src="/kincoins/kintree_coin.svg"
                className="h-full object-cover max-w-[125px] w-[75px]"
                style={{ zIndex: 1 }}
              />
            </div>
            <div className="text-black font-bold text-[20px]">
              {t("your_kincoins_balance")}
            </div>
            <div className="text-black font-bold text-[36px]">
              {kincoinsBalnce?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
            </div>
          </div>
          {showConfetti && (
            <ReactConfetti
              height={227}
              numberOfPieces={300}
              recycle={true}
              gravity={0.2}
              style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
            />
          )}
        </div>
        <div className="grid gap-4 grid-cols-1 mt-4 mb-4 px-4">
          <div className="flex justify-start h-[54px] gap-2 border-b relative">
            <div
              className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-4 font-semibold ${
                activeTab === "redeem"
                  ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                  : ""
              }`}
              onClick={() => setActiveTab("redeem")}
            >
              {t("redeem")}
            </div>
            <div
              className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-4 font-semibold ${
                activeTab === "earn"
                  ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                  : ""
              }`}
              onClick={() => setActiveTab("earn")}
            >
              {t("earn")}
            </div>
            <div
              className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-4 font-semibold ${
                activeTab === "transactions"
                  ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                  : ""
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              {t("transactions")}
            </div>
          </div>
          {renderTabContent()}
        </div>
      </Card>
    </>
  );
}
