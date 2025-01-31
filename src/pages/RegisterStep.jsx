import RegisterStepForm from "@/components/register-step-form";
import { Progress } from "@/components/ui/progress";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useAuthentication } from "@/hooks/useAuthentication";
import { toast } from "react-hot-toast";

export default function RegisterStep() {
  const { theme } = useThemeLanguage();
  const navigate = useNavigate();
  const { step } = useParams();
  const { registerStep, registrationState, login } = useAuthentication();

  // Redirect to correct step based on registration state
  useEffect(() => {
    if (!registrationState) return;

    // If registration is complete, redirect to foreroom
    if (registrationState.isRegistrationComplete) {
      navigate("/foreroom", { replace: true });
      return;
    }

    // Otherwise handle step navigation
    if (registrationState?.nextStep) {
      const currentStep = parseInt(step);
      if (currentStep !== registrationState.nextStep) {
        navigate(`/register/step/${registrationState.nextStep}`, {
          replace: true,
        });
      }
    }
  }, [step, registrationState, navigate]);

  const handleStepSubmit = async (data) => {
    try {
      const result = await registerStep(data);

      if (result?.success) {
        // Check if this is the final step response
        if (result.data?.is_registration_complete === 1) {
          // Set the login token if provided
          if (result.data?.login_token) {
            // Update auth state with the new token
            await login(result.data.login_token);
          }
          // Redirect to foreroom
          navigate("/foreroom", { replace: true });
          return;
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to save registration data"
      );
    }
  };

  if (!registrationState) {
    return null; // or loading state
  }

  if (registrationState.isRegistrationComplete) {
    return <Navigate to="/foreroom" replace={true} />;
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
