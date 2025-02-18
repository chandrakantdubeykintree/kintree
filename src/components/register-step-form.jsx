import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationStepSchemas } from "@/schemas/registrationSchemas";
import { StepOne } from "./registerationSteps/StepOne";
import { StepTwo } from "./registerationSteps/StepTwo";
import { StepThree } from "./registerationSteps/StepThree";
import { StepFour } from "./registerationSteps/StepFour";
import { StepFive } from "./registerationSteps/StepFive";
import { StepSix } from "./registerationSteps/StepSix";
import { useEffect } from "react";

export default function RegisterStepForm({
  currentStep,
  onStepSubmit,
  gender,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(registrationStepSchemas[currentStep]),
    mode: "onChange",
  });

  useEffect(() => {
    reset();
  }, [currentStep, reset]);

  const handleFormSubmit = async (data) => {
    if (isSubmitting) return;
    await onStepSubmit(data);
  };

  const renderStepContent = () => {
    const props = { register, errors, watch, setValue, gender };
    switch (currentStep) {
      case 1:
        return <StepOne {...props} />;
      case 2:
        return <StepTwo {...props} />;
      case 3:
        return <StepThree {...props} />;
      case 4:
        return <StepFour {...props} />;
      case 5:
        return <StepFive {...props} />;
      case 6:
        return <StepSix {...props} />;
      default:
        return null;
    }
  };

  function renderSignUpStepTitleDesc(step) {
    switch (step) {
      case 1:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              We'd love to know about yourself
            </h1>
            <p>(Let's start with your name)</p>
          </>
        );
      case 2:
        return (
          <>
            <h1 className="font-semibold text-2xl">When were you born?</h1>
            <p>(This helps us personalize your experience)</p>
          </>
        );
      case 3:
        return (
          <>
            <h1 className="font-semibold text-2xl">What's your gender?</h1>
            <p>(Help us understand you better)</p>
          </>
        );
      case 4:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              Choose your profile picture
            </h1>
            <p>(Let others recognize you easily)</p>
          </>
        );
      case 5:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              Can you share your Father's Name?
            </h1>
            <p>(Let's honor the first branch in your family tree)</p>
          </>
        );
      case 6:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              Can you share your Mother's Name?
            </h1>
            <p>(We can't wait to celebrate her impact on your life)</p>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <Card className="flex flex-col lg:gap-2 p-0 rounded-3xl">
      <CardHeader className="text-center">
        {renderSignUpStepTitleDesc(currentStep)}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {renderStepContent()}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:h-[56px] rounded-full mt-6"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </div>
            ) : currentStep === 6 ? (
              "Complete Registration"
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
