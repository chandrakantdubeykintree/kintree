import RegisterStepForm from "@/components/register-step-form";
import { Progress } from "@/components/ui/progress";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuthentication } from "@/hooks/useAuthentication";
import { toast } from "react-hot-toast";

export default function RegisterStep() {
  const { theme } = useThemeLanguage();
  const navigate = useNavigate();
  const { step } = useParams();
  const { registerStep, registrationState } = useAuthentication();

  // Redirect to correct step based on registration state
  useEffect(() => {
    if (registrationState?.nextStep) {
      const currentStep = parseInt(step);
      if (currentStep !== registrationState.nextStep) {
        navigate(`/register/step/${registrationState.nextStep}`, {
          replace: true,
        });
      }
    }
  }, [step, registrationState?.nextStep, navigate]);

  const handleStepSubmit = async (data) => {
    try {
      const result = await registerStep(data);

      if (result.success) {
        if (result.isCompleted) {
          navigate("/foreroom", { replace: true });
        }
        // No need to navigate here as the registration state update will trigger the useEffect
      }
    } catch (error) {
      toast.error("Failed to save registration data");
    }
  };

  if (!registrationState) {
    return null; // or loading state
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/illustrations/illustration_9.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-[#F4ECF2] dark:bg-[#202020]">
        <div className="flex justify-center gap-2 md:justify-end">
          <img
            src={
              theme === "light" ? "/kintreeLogo.svg" : "/kintreeLogoLight.svg"
            }
            className="w-[60px] h-auto"
            alt="Kintree logo"
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterStepForm
              currentStep={registrationState.nextStep}
              onStepSubmit={handleStepSubmit}
            />
          </div>
        </div>
        <div className="flex items-center justify-center mb-12">
          <Progress
            value={Math.ceil((registrationState.nextStep / 6) * 100)}
            className="max-w-[250px] bg-[#F1B8A6] h-[9px]"
          />
        </div>
      </div>
    </div>
  );
}
