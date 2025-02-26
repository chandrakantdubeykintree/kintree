import { useState, useEffect, useRef } from "react";
import { IndianRupee, Copy, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  useIsRedeeming,
  useKincoinsBalance,
  useRedeemKincoins,
} from "@/hooks/useKincoins";
import { toast } from "react-hot-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";

export default function RedeemCard({ data }) {
  const [showDialog, setShowDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { mutate: redeemKincoins } = useRedeemKincoins();
  const isRedeeming = useIsRedeeming();
  const { data: balanceData } = useKincoinsBalance();
  // const timerRef = useRef(null);
  const queryClient = useQueryClient();

  const handleRedeem = () => {
    const balance = parseInt(balanceData?.coin_balance) || 0;

    if (balance < 1000) {
      return toast.error(
        "Minimum balance of 1,000 kincoins required to redeem"
      );
    }

    const coinsToUse = Math.floor(Math.min(balance, 100000) / 100) * 100;
    const rupeesWorth = coinsToUse / 100;

    if (balance > 100000) {
      toast.success(`Only 1,00,000 kincoins will be used in this redemption`);
    }

    redeemKincoins(
      {
        coins: coinsToUse,
        amount: rupeesWorth,
      },
      {
        onSuccess: (response) => {
          setCouponCode(response.data.code);
          setShowDialog(true);
          startTimer();
          queryClient.invalidateQueries({
            queryKey: ["kincoins-balance"],
          });
        },
      }
    );
  };

  // const startTimer = () => {
  //   // Clear any existing timer
  //   if (timerRef.current) {
  //     clearInterval(timerRef.current);
  //   }

  //   timerRef.current = setInterval(() => {
  //     setTimeLeft((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timerRef.current);
  //         setShowDialog(false);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  // };
  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowDialog(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const handleRedeemNow = () => {
    handleCopy();
    window.open("https://kintree.com/dna/", "_blank");
  };

  // Format time left
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Reset timer when dialog closes
  // useEffect(() => {
  //   if (!showDialog) {
  //     setTimeLeft(300);
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //     }
  //   }

  //   // Cleanup on unmount
  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //     }
  //   };
  // }, [showDialog]);
  useEffect(() => {
    if (!showDialog) {
      setTimeLeft(300);
    }
  }, [showDialog]);

  return (
    <>
      <Card className="bg-[#F8FAFC] dark:bg-[#1F2937] w-full rounded-2xl h-full hover:shadow-md transition-shadow border-0">
        <CardContent className="p-4 rounded-2xl flex flex-col h-full">
          <div className="w-full pb-[90%] relative">
            <img
              src={data.url}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              alt={data.name}
            />
          </div>
          <div className="flex flex-col h-[120px] mt-4">
            <div className="text-[#5E5F60] dark:text-[#9CA3AF] text-xs font-bold uppercase tracking-wide mb-2">
              {data.tag}
            </div>
            <div className="text-lg font-semibold line-clamp-2 mb-auto text-foreground">
              {data.name}
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="text-primary font-medium text-[20px] flex items-center gap-0.5">
                <IndianRupee className="text-primary h-[20px] p-0" />
                {data.price?.toLocaleString()}
              </div>
              <Button
                className="rounded-full"
                onClick={handleRedeem}
                disabled={isRedeeming}
              >
                {isRedeeming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redeeming...
                  </>
                ) : (
                  "Redeem"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog} modal={true}>
        <DialogContent className="w-[300px] text-center max-w-[95%] sm:rounded-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary text-center">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground text-center">
              You can redeem coupon for product!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="mx-auto overflow-hidden relative w-[250px]">
              <div className="border-primary border text-white p-6 bg-[#FAF2F8]">
                <div className="flex items-center justify-between space-x-2">
                  <code className="text-xl font-mono font-semibold text-primary line-clamp-1 max-w-52 overflow-ellipsis">
                    {couponCode}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-transparent active:bg-transparent focus:bg-transparent"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </div>
                <div className="w-6 h-6 bg-white z-1 rounded-full absolute transform -top-3 left-0 -ml-2 border border-primary"></div>
                <div className="w-6 h-6 bg-white z-1 rounded-full absolute transform -top-3 right-0 -mr-2 border border-primary"></div>

                <div className="w-6 h-6 bg-white z-1 rounded-full absolute transform -bottom-3 right-0 -mr-2 border border-primary"></div>
                <div className="w-6 h-6 bg-white z-1 rounded-full absolute transform -bottom-3 left-0 -ml-2 border border-primary"></div>

                <div className="w-6 h-6 bg-white z-1 rounded-full absolute transform -top-3 right-20 -ml-2 border border-primary"></div>
                <div className="w-6 h-6 bg-white z-1 rounded-full absolute transform -bottom-3 right-20 -mr-2 border border-primary"></div>
              </div>
            </div>

            <Button
              className="w-full rounded-full max-w-[250px] h-[48px] text-md gap-2"
              onClick={handleRedeemNow}
            >
              <img src="/kincoinsImg/redeem.svg" className="h-6 w-6 mr-2" />
              <span>Redeem Now</span>
            </Button>
            <p className="text-sm text-muted-foreground">
              {formatTime(timeLeft)}
            </p>
            <span className="text-xs text-muted-foreground text-center">
              Coupon code is valid for 5 minutes only.
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
