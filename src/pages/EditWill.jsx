import { Card } from "@/components/ui/card";
import Allocation from "@/components/will/Allocation";
import Beneficiaries from "@/components/will/Beneficiaries";
import Executor from "@/components/will/Executor";
import Notarize from "@/components/will/Notarize";
import PersonalInfo from "@/components/will/PersonalInfo";
import Review from "@/components/will/Review";
import Selfie from "@/components/will/Selfie";
import { Steps } from "@/components/will/Steps";
import UnsavedChangesDialog from "@/components/will/UnsavedChangesDialog";
import { useWill } from "@/hooks/useWill";
import { useState } from "react";

export default function EditWill() {
  const [step, setStep] = useState("personal-info");
  const { willData } = useWill();
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const steps = [
    { id: "personal-info", title: "Personal Details" },
    { id: "beneficiaries", title: "Beneficiaries" },
    { id: "allocation", title: "Allocation" },
    { id: "executor", title: "Executor" },
    { id: "review", title: "Review" },
    { id: "selfie", title: "Self Authentication" },
    { id: "notarize", title: "Notarization" },
  ];
  function willCreationStep() {
    switch (step) {
      case "personal-info":
        return <PersonalInfo setStep={setStep} willId={willData?.data?.id} />;
      case "beneficiaries":
        return <Beneficiaries setStep={setStep} willId={willData?.data?.id} />;
      case "allocation":
        return <Allocation setStep={setStep} willId={willData?.data?.id} />;
      case "executor":
        return <Executor setStep={setStep} willId={willData?.data?.id} />;
      case "review":
        return <Review setStep={setStep} willId={willData?.data?.id} />;
      case "selfie":
        return <Selfie setStep={setStep} willId={willData?.data?.id} />;
      case "notarize":
        return <Notarize setStep={setStep} willId={willData?.data?.id} />;
    }
  }
  return (
    <Card className="mx-auto p-2 py-4 md:p-4 lg:p-6 bg-background rounded-2xl overflow-y-scroll no_scrollbar h-full">
      {step !== "acknowledge" && (
        <div className="mb-8 flex justify-between items-center overflow-x-scroll no_scrollbar w-full">
          <Steps
            steps={steps}
            currentStep={step}
            willId={willData?.data?.id}
            completedSteps={[]}
            onStepClick={() => {}}
          />
        </div>
      )}
      <div className="bg-brandSecondary p-2 md:p-4 lg:p-6 rounded-lg h-full overflow-y-scroll no_scrollbar">
        {willCreationStep()}
      </div>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onClose={() => setShowUnsavedDialog(false)}
        onConfirm={() => {}}
      />
    </Card>
  );
}
