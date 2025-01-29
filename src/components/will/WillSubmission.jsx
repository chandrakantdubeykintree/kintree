import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, FileCheck, Stamp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";

export default function WillSubmission({ willId }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [submissionStep, setSubmissionStep] = useState(0);
  const {
    uploadSelfie,
    isUploadingSelfie,
    generateWill,
    isGeneratingWill,
    notarizeWill,
    isNotarizingWill,
  } = useWill();

  const steps = [
    {
      title: "Upload Selfie",
      description: "Take or upload a photo for identity verification",
      icon: Camera,
      action: handleSelfieUpload,
      isLoading: isUploadingSelfie,
    },
    {
      title: "Generate Will Document",
      description: "Create your official will document",
      icon: FileCheck,
      action: handleGenerateWill,
      isLoading: isGeneratingWill,
    },
    {
      title: "Notarize Will",
      description: "Legally authenticate your will",
      icon: Stamp,
      action: handleNotarizeWill,
      isLoading: isNotarizingWill,
    },
  ];

  async function handleSelfieUpload(file) {
    try {
      await uploadSelfie({ willId, selfieFile: file });
      setSubmissionStep(1);
      toast.success("Selfie uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload selfie");
      console.error("Error uploading selfie:", error);
    }
  }

  async function handleGenerateWill() {
    try {
      await generateWill(willId);
      setSubmissionStep(2);
      toast.success("Will document generated successfully");
    } catch (error) {
      toast.error("Failed to generate will document");
      console.error("Error generating will:", error);
    }
  }

  async function handleNotarizeWill() {
    try {
      await notarizeWill(willId);
      toast.success("Will notarized successfully");
      navigate("/will");
    } catch (error) {
      toast.error("Failed to notarize will");
      console.error("Error notarizing will:", error);
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <Progress value={(submissionStep / (steps.length - 1)) * 100} />
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCurrentStep = index === submissionStep;
          const isCompleted = index < submissionStep;

          return (
            <div
              key={step.title}
              className={`p-4 border rounded-lg ${
                isCurrentStep ? "border-primary" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isCurrentStep
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
                {isCurrentStep && (
                  <Button
                    className="ml-auto rounded-full"
                    onClick={() => {
                      if (index === 0) {
                        fileInputRef.current?.click();
                      } else {
                        step.action();
                      }
                    }}
                    disabled={step.isLoading}
                  >
                    {step.isLoading ? "Processing..." : "Continue"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleSelfieUpload(file);
          }
        }}
      />
    </Card>
  );
}
