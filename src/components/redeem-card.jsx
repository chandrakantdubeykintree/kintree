import { useState, useEffect } from "react";
import { IndianRupee, Copy, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useRedeemKincoins } from "@/hooks/useKincoins";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function RedeemCard({ data }) {
  const [showDialog, setShowDialog] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { mutate: redeemKincoins } = useRedeemKincoins();
  const { user: userData } = useAuth(); // Get user's kincoin balance

  const handleRedeem = () => {
    const balance = userData?.kincoin_balance || 0;
    const requiredCoins = data.price * 100; // Convert price to coins (1 rupee = 100 coins)

    if (balance < 1000) {
      return toast.error("Minimum balance of 1000 kincoins required to redeem");
    }

    if (requiredCoins > 100000) {
      return toast.error("Maximum 100000 kincoins can be redeemed at once");
    }

    if (balance < requiredCoins) {
      return toast.error("Insufficient kincoin balance");
    }

    redeemKincoins(
      {
        coins: requiredCoins,
        amount: data.price,
      },
      {
        onSuccess: (response) => {
          setCouponCode(response.data.coupon_code);
          setShowDialog(true);
          startTimer();
        },
      }
    );
  };

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
    navigate("/dna");
  };

  // Format time left
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Reset timer when dialog closes
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

          {/* Content section with fixed spacing */}
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
              <Button className="rounded-full" onClick={handleRedeem}>
                Redeem
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-sm text-center rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary text-center">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground text-center">
              You can redeem the coupon for the product!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Ticket shaped container */}
            <div className="relative">
              {/* Left notch */}
              <div className="absolute -left-2 top-1/2 h-4 w-4 -mt-2 rounded-full bg-background" />
              {/* Right notch */}
              <div className="absolute -right-2 top-1/2 h-4 w-4 -mt-2 rounded-full bg-background" />
              {/* Dashed border container */}
              <div className="border-2 border-dashed border-primary/50 rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-center gap-3">
                  <code className="text-xl font-mono font-semibold text-primary line-clamp-1 max-w-52 overflow-ellipsis">
                    {couponCode}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full rounded-full max-w-[200px] h-[48px] text-md gap-2"
              onClick={handleRedeemNow}
            >
              <img src="/kincoins/redeem.svg" className="h-6 w-6 mr-2" />
              <span>Redeem Now</span>
            </Button>
            <p className="text-sm text-muted-foreground">
              Time remaining: {formatTime(timeLeft)}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
