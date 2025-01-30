import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";

import { AlertCircle, CheckCircle2, User } from "lucide-react";

import ComponentLoading from "../component-loading";
import { Checkbox } from "../ui/checkbox";

export default function Allocation({ setStep, willId }) {
  const navigate = useNavigate();

  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const {
    getBeneficiariesQuery,
    saveBeneficiaryAllocations,
    isSavingAllocations,
  } = useWill();
  const { data: beneficiariesData, isLoading } = getBeneficiariesQuery(willId);

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

  if (isLoading) {
    return <ComponentLoading />;
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
                </div>
              </div>
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

      <div className="flex items-center gap-2">
        <Checkbox
          id="consent"
          checked={isConsentChecked}
          onCheckedChange={setIsConsentChecked}
        />
        <label
          htmlFor="consent"
          className="text-sm text-gray-600 cursor-pointer select-none"
        >
          I confirm the allocation of assets to beneficiaries listed above.
        </label>
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
            isSavingAllocations ||
            !isConsentChecked
          }
        >
          {isSavingAllocations ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
