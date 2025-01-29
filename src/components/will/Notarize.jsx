import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

const NOTARIZATION_STEPS = [
  {
    title: "Generate Will Document",
    description: "Create the final version of your will document",
    icon: FileText,
  },
  {
    title: "Download & Review",
    description: "Download and carefully review your will document",
    icon: Download,
  },
  {
    title: "Notarize Will",
    description: "Legally authenticate your will document",
    icon: CheckCircle2,
  },
];

export default function Notarize({ setStep, willId }) {
  const navigate = useNavigate();
  const {
    generateWill,
    isGeneratingWill,
    notarizeWill,
    isNotarizingWill,
    willData,
  } = useWill();

  const [currentStep, setCurrentStep] = useState(0);
  const [willUrl, setWillUrl] = useState(willData?.data?.will_url || null);

  const handleGenerateWill = async () => {
    try {
      const result = await generateWill(willId);
      if (result?.data?.will_url) {
        setWillUrl(result.data.will_url);
        setCurrentStep(1);
        toast.success("Will document generated successfully");
      }
    } catch (error) {
      console.error("Error generating will:", error);
      toast.error("Failed to generate will document");
    }
  };

  const handleNotarize = async () => {
    try {
      await notarizeWill(willId);
      toast.success("Will notarized successfully");
      navigate("/will");
    } catch (error) {
      console.error("Error notarizing will:", error);
      toast.error("Failed to notarize will");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Notarize Your Will</h2>
        <p className="text-gray-600 mb-6">
          Complete these final steps to make your will legally valid.
        </p>

        <div className="space-y-4">
          {NOTARIZATION_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <Card
                key={step.title}
                className={`p-4 ${
                  isCurrent ? "border-primary" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {isCurrent && (
                    <div className="ml-auto">
                      {index === 0 && (
                        <Button
                          onClick={handleGenerateWill}
                          disabled={isGeneratingWill}
                          className="rounded-full h-10 md:h-12 px-4 md:px-6"
                        >
                          {isGeneratingWill ? "Generating..." : "Generate"}
                        </Button>
                      )}
                      {index === 1 && willUrl && (
                        <Button
                          onClick={() => {
                            window.open(willUrl, "_blank");
                            setCurrentStep(2);
                          }}
                          className="rounded-full h-10 md:h-12 px-4 md:px-6"
                        >
                          Download
                        </Button>
                      )}
                      {index === 2 && (
                        <Button
                          onClick={handleNotarize}
                          disabled={isNotarizingWill}
                          className="rounded-full h-10 md:h-12 px-4 md:px-6"
                        >
                          {isNotarizingWill ? "Processing..." : "Notarize"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          className="rounded-full h-10 md:h-12 px-4 md:px-6"
          onClick={() => navigate(`/will`)}
        >
          Go to Will
        </Button>
      </div>
    </div>
  );
}
