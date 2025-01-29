import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, CheckCircle2, User } from "lucide-react";
import { kintreeApi } from "@/services/kintreeApi";
import { useQueryClient } from "@tanstack/react-query";

export default function Allocation({ setStep, willId }) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState({
    open: false,
    benificary: null,
  });
  const {
    getBeneficiariesQuery,
    saveBeneficiaryAllocations,
    isSavingAllocations,
  } = useWill();
  const { data: beneficiariesData, isLoading } = getBeneficiariesQuery(willId);
  const queryClient = useQueryClient();

  const [allocations, setAllocations] = useState({});
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    if (beneficiariesData?.data) {
      const initialAllocations = {};
      let total = 0;
      beneficiariesData.data.forEach((beneficiary) => {
        initialAllocations[beneficiary.id] =
          Number(beneficiary.percentage) || 0;
        total += Number(beneficiary.percentage || 0);
      });
      setAllocations(initialAllocations);
      setTotalPercentage(total);
    }
  }, [beneficiariesData]);

  const handleAllocationChange = (beneficiaryId, value) => {
    const newValue = Math.min(Math.max(0, Number(value) || 0), 100);
    const newAllocations = { ...allocations, [beneficiaryId]: newValue };

    const newTotal = Object.values(newAllocations).reduce(
      (sum, val) => sum + Number(val),
      0
    );
    setTotalPercentage(newTotal);
    setAllocations(newAllocations);
  };

  const handleSubmit = async () => {
    if (totalPercentage !== 100) {
      toast.error("Total allocation must equal 100%");
      return;
    }

    try {
      await saveBeneficiaryAllocations({
        willId,
        beneficiaries: Object.entries(allocations).map(([id, percentage]) => ({
          id,
          percentage,
        })),
      });
      toast.success("Allocations saved successfully");
      setStep("executor");
    } catch (error) {
      console.error("Error saving allocations:", error);
      toast.error("Failed to save allocations");
    }
  };

  const handleDelete = async (beneficiaryId) => {
    try {
      await kintreeApi.delete(`/will/${willId}/beneficiaries/${beneficiaryId}`);
      queryClient.invalidateQueries(["beneficiaries", willId]);
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const beneficiaries = beneficiariesData?.data || [];

  if (beneficiaries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No beneficiaries added yet. Please add beneficiaries first.
        </p>
        <Button
          className="rounded-full mt-4"
          onClick={() => navigate(`/will/create/${willId}/beneficiaries`)}
        >
          Add Beneficiaries
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Asset Allocation</h2>
        <p className="text-gray-600 mb-6">
          Specify how your assets should be distributed among your
          beneficiaries. The total allocation must be equal to 100%.
        </p>

        <div className="space-y-4">
          {beneficiaries.map((beneficiary) => (
            <Card key={beneficiary.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{beneficiary.name}</h3>
                    <p className="text-sm text-gray-500">
                      {beneficiary.relation || "No relation specified"}
                    </p>
                  </div>
                </div>

                <div className="w-32 flex items-center gap-2">
                  <Input
                    type="number"
                    value={allocations[beneficiary.id] || 0}
                    onChange={(e) =>
                      handleAllocationChange(beneficiary.id, e.target.value)
                    }
                    min="0"
                    step="1"
                    max="100"
                    className="text-right text-md text-primary bg-background"
                    suffix="%"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      console.log(beneficiary);
                      setIsDeleteDialogOpen({
                        open: true,
                        benificary: beneficiary,
                      });
                    }}
                  >
                    <img
                      src="/icons/delete.svg"
                      className="w-5 h-5 text-primary"
                    />
                  </Button>
                </div>
              </div>
              {isDeleteDialogOpen?.open ? (
                <AlertDialog
                  open={isDeleteDialogOpen.open}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Beneficiary</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove{" "}
                        {isDeleteDialogOpen.benificary.name} from your will?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleDelete(isDeleteDialogOpen.benificary.id);
                          setIsDeleteDialogOpen({
                            open: false,
                            benificary: null,
                          });
                        }}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-md font-medium">Total Allocation</span>
            <span
              className={`font-medium ${
                totalPercentage.toFixed(2).toString() === "100.00"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {totalPercentage?.toFixed(2)}%
            </span>
          </div>
          <Progress value={totalPercentage} className="h-3 rounded-full" />
          {totalPercentage.toFixed(2).toString() !== "100.00" && (
            <p className="text-yellow-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Total allocation must equal 100%
            </p>
          )}
          {totalPercentage.toFixed(2).toString() === "100.00" && (
            <p className="text-green-600 text-md mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Allocation complete
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          variant="outline"
          onClick={() => setStep("beneficiaries")}
        >
          Back
        </Button>
        <Button
          className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          onClick={handleSubmit}
          disabled={
            totalPercentage.toFixed(2).toString() !== "100.00" ||
            isSavingAllocations
          }
        >
          {isSavingAllocations ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
