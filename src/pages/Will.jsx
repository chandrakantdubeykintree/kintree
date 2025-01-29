import { useWill } from "../hooks/useWill";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import ConfirmCreateNewWillDialog from "@/components/will/ConfirmCreateNewWillDialog";

export default function Will() {
  const { willData, isWillLoading, deleteWill } = useWill();
  const [showCreateWillDialog, setShowCreateWillDialog] = useState(false);
  const navigate = useNavigate();
  if (isWillLoading) {
    return <WillSkeleton />;
  }

  const handleCreateWill = () => {
    if (willData?.data?.id) {
      setShowCreateWillDialog(true);
    } else {
      navigate(`/will/create-will`);
    }
  };

  const handleConfirmNewWill = async () => {
    await deleteWill(willData?.data?.id);
  };

  return (
    <Card className="bg-background rounded-2xl h-full p-6 overflow-y-scroll no_scrollbar">
      <div className="bg-brandSecondary rounded-lg shadow-md p-4 mb-4">
        <h1 className="text-2xl font-bold mb-4">Get Started</h1>
        <p className="text-gray-600 mb-2">
          Ensure your loved ones are taken care of, even when you&apos;re gone.
          Make your last Will with Kintree.
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
                onClick={handleCreateWill}
                className="rounded-full h-10 md:h-12 px-4 md:px-6"
              >
                Create Will
              </Button>
              <Button
                onClick={() => navigate(`/will/edit-will`)}
                disabled={!willData?.data?.id}
                variant="outline"
                className="rounded-full h-10 md:h-12 px-4 md:px-6"
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
              disabled={!willData?.data || willData?.data?.completed_status < 4}
              onClick={() => navigate(`/will/view-will`)}
              className="rounded-full h-10 md:h-12 px-4 md:px-6"
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
            <span className="text-gray-600">From the comfort of your home</span>
          </div>
        </div>
      </div>
      <ConfirmCreateNewWillDialog
        showConfirmDialog={showCreateWillDialog}
        setShowConfirmDialog={setShowCreateWillDialog}
        handleConfirmNewWill={handleConfirmNewWill}
      />
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
