import { useWill } from "../hooks/useWill";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

export default function Will() {
  const { willData, isWillLoading } = useWill();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCreateWillAcknowledge = () => {
    try {
      if (!willData?.data?.id) {
        navigate(`/will/acknowledgement`);
      } else {
        setShowConfirmDialog(true);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", error);
    }
  };

  const handleConfirmNewWill = async () => {
    try {
      setShowConfirmDialog(false);
      navigate(`/will/acknowledgement`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete existing will. Please try again.");
    }
  };

  const handleEditWill = () => {
    try {
      const will = willData.data;

      console.log(will);

      if (will.is_notarized) {
        toast.error("You already have a notarized will.");
        return;
      }

      if (will.completed_status === 100) {
        toast.info(
          "Your will is complete. You can view it or create a new one."
        );
        return;
      }
      switch (will.completed_status) {
        case 1:
          navigate(`/will/create/${will.id}/personal-info`);
          break;
        case 2:
          navigate(`/will/create/${will.id}/beneficiaries`);
          break;
        case 3:
          navigate(`/will/create/${will.id}/allocation`);
          break;
        case 4:
          navigate(`/will/create/${will.id}/executor`);
          break;
        case 5:
          navigate(`/will/create/${will.id}/selfie`);
          break;
        case 6:
          navigate(`/will/create/${will.id}/notarize`);
          break;
        default:
          navigate(`/will/create/${will.id}/personal-info`);
          break;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Handle existing will navigation
  const handleViewWill = () => {
    if (willData?.data?.will_url) {
      if (willData?.data?.completed_status >= 4) {
        window.open(willData?.data?.will_url, "_blank");
      } else {
        toast.error("Your will is not complete yet.");
      }
    }
  };

  if (isWillLoading) {
    return <WillSkeleton />;
  }

  return (
    <Card className="bg-background rounded-2xl">
      <div className="p-6">
        <div className="bg-brandSecondary rounded-lg shadow-md p-4 mb-4">
          <h1 className="text-2xl font-bold mb-4">Get Started</h1>
          <p className="text-gray-600 mb-2">
            Ensure your loved ones are taken care of, even when you&apos;re
            gone. Make your last Will with Kintree.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-violet-100 dark:bg-violet-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <PlusCircle className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-semibold">Create New Will</h2>
              </div>
              <p className="text-gray-600 mb-4 dark:text-background">
                Start creating your will to ensure your assets are distributed
                according to your wishes.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateWillAcknowledge}
                  className="rounded-full"
                >
                  Create Will
                </Button>
                <Button
                  onClick={handleEditWill}
                  disabled={!willData?.data?.id}
                  variant="outline"
                  className="rounded-full"
                >
                  Edit Will
                </Button>
              </div>
            </div>

            <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-semibold">View Existing Will</h2>
              </div>
              <p className="text-gray-600 mb-4 dark:text-background">
                Review and manage your existing will document and beneficiaries.
              </p>
              <Button
                variant={willData?.data ? "default" : "secondary"}
                disabled={
                  !willData?.data || willData?.data?.completed_status < 4
                }
                onClick={handleViewWill}
                className="rounded-full"
              >
                View Will
              </Button>
            </div>
          </div>
        </div>

        {willData?.data && (
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-4">My Will</h2>
            <div className="grid gap-4">
              <div className="flex justify-between items-center bg-gray-300 p-4 rounded-lg">
                <span className="text-gray-600">Completion Status:</span>
                <span className="font-medium dark:text-background">
                  {Math.floor((willData?.data?.completed_status / 5) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-300 p-4 rounded-lg">
                <span className="text-gray-600">Notarized:</span>
                <span className="font-medium dark:text-background">
                  {willData?.data?.is_notarized ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-300 p-4 rounded-lg">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium dark:text-background">
                  {willData?.data?.updated_at
                    ? new Date(willData?.data?.updated_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">What&apos;s in it for you?</h2>
          <div className="grid gap-4">
            <div className="flex justify-start items-center gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <CheckCircle className="w-8 h-8 text-primary" />
              <span className="text-gray-600">Completely Free</span>
            </div>
            <div className="flex justify-start items-center gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <CheckCircle className="w-8 h-8 text-primary" />
              <span className="text-gray-600">100% Secure and hassle-free</span>
            </div>
            <div className="flex justify-start items-center gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <CheckCircle className="w-8 h-8 text-primary" />
              <span className="text-gray-600">
                From the comfort of your home
              </span>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Will</DialogTitle>
            <DialogDescription>
              You already have an existing will. Creating a new will would
              delete your current will. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmNewWill}>
              Create New
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

const WillSkeleton = () => (
  <div className="p-6">
    <Skeleton className="h-8 w-48 mb-6" />
    <div className="grid md:grid-cols-2 gap-6">
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
    </div>
  </div>
);
