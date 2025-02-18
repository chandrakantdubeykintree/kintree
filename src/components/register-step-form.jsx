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
import { useTranslation } from "react-i18next";

export default function RegisterStepForm({
  currentStep,
  onStepSubmit,
  gender,
}) {
  const { t } = useTranslation();
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
              {t("register_step_1_heading")}
            </h1>
            <p>({t("register_step_1_desc")})</p>
          </>
        );
      case 2:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              {t("register_step_2_heading")}
            </h1>
            <p>({t("register_step_2_desc")})</p>
          </>
        );
      case 3:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              {t("register_step_3_heading")}
            </h1>
            <p>({t("register_step_3_desc")})</p>
          </>
        );
      case 4:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              {t("register_step_4_heading")}
            </h1>
            <p>({t("register_step_4_desc")})</p>
          </>
        );
      case 5:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              {t("register_step_5_heading")}
            </h1>
            <p>({t("register_step_5_desc")})</p>
          </>
        );
      case 6:
        return (
          <>
            <h1 className="font-semibold text-2xl">
              {t("register_step_6_heading")}
            </h1>
            <p>({t("register_step_6_desc")})</p>
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
                {t("text.processing")}...
              </div>
            ) : currentStep === 6 ? (
              t("text.complete_registration")
            ) : (
              t("text.continue")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
