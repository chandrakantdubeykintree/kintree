import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import ComponentLoading from "../component-loading";

export default function Review({ setStep, willId }) {
  const { willData, isWillLoading, getBeneficiariesQuery } = useWill();
  const { data: beneficiariesData } = getBeneficiariesQuery(willId);

  if (isWillLoading) {
    return <ComponentLoading />;
  }

  const totalPercentage = beneficiariesData?.data?.reduce(
    (sum, b) => sum + Number(b.percentage || 0),
    0
  );

  const isAllocationComplete = totalPercentage === 100;

  return (
    <div className="space-y-6 h-full">
      <h2 className="text-xl font-semibold">Review Your Will</h2>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p>{willData?.data?.["personal-info"]?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Date of Birth</label>
            <p>{willData?.data?.["personal-info"]?.date_of_birth}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Address</label>
            <p>{willData?.data?.["personal-info"]?.address}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Pincode</label>
            <p>{willData?.data?.["personal-info"]?.pincode}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <p>
              {willData?.data?.["personal-info"]?.phone_country_code}-{" "}
              {willData?.data?.["personal-info"]?.phone_no}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p>{willData?.data?.["personal-info"]?.email}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Executor</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p>{willData?.data?.["executor-info"]?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Date of Birth</label>
            <p>{willData?.data?.["executor-info"]?.date_of_birth}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p>{willData?.data?.["executor-info"]?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <p>
              {willData?.data?.["executor-info"]?.phone_country_code}-{" "}
              {willData?.data?.["executor-info"]?.phone_no}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Gender</label>
            <p>
              {willData?.data?.["executor-info"]?.gender === "m"
                ? "Male"
                : "Female"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">City</label>
            <p>{willData?.data?.["executor-info"]?.city}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Beneficiaries</h3>
        <div className="space-y-4">
          {beneficiariesData?.data?.map((beneficiary) => (
            <div
              key={beneficiary.id}
              className="flex justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">{beneficiary.name}</p>
                <p className="text-sm text-gray-500">
                  {beneficiary.relation || "No relation specified"}
                </p>
              </div>
              <p className="font-medium">{beneficiary.percentage}%</p>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-4">
            {isAllocationComplete ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            )}
            <span className="text-sm">
              Total Allocation: {totalPercentage}%
              {!isAllocationComplete && " (Must equal 100%)"}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => setStep("executor")}
          className="rounded-full h-10 md:h-12 px-4 md:px-6"
        >
          Back
        </Button>
        <Button
          disabled={!isAllocationComplete}
          onClick={() => setStep("selfie")}
          className="rounded-full h-10 md:h-12 px-4 md:px-6"
        >
          Continue to Submit
        </Button>
      </div>
    </div>
  );
}
