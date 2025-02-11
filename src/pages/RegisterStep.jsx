import RegisterStepForm from "@/components/register-step-form";
import { Progress } from "@/components/ui/progress";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useAuthentication } from "@/hooks/useAuthentication";
import { toast } from "react-hot-toast";
import { tokenService } from "@/services/tokenService";

export default function RegisterStep() {
  const { theme } = useThemeLanguage();
  const navigate = useNavigate();
  const { step } = useParams();
  const { registerStep, registrationState } = useAuthentication();

  // Redirect to correct step based on registration state
  useEffect(() => {
    const handleNavigation = async () => {
      // Check if we have a registration token
      const hasRegistrationToken = tokenService.getRegistrationToken();
      if (hasRegistrationToken && !registrationState?.isRegistrationComplete) {
        tokenService.removeLoginToken();
      }
      // Check if we have an auth token (logged in)
      const hasAuthToken = tokenService.getLoginToken();

      // If user is already logged in and registration is complete
      if (hasAuthToken && registrationState?.isRegistrationComplete) {
        navigate("/foreroom", { replace: true });
        return;
      }

      // If no registration token and not logged in
      if (!hasRegistrationToken && !hasAuthToken) {
        toast.error(
          "Session expired use your email/phone to start registration."
        );
        navigate("/register", { replace: true });
        return;
      }
    };

    handleNavigation();
  }, [step, registrationState, navigate]);

  const handleStepSubmit = async (data) => {
    try {
      await registerStep(data);
    } catch (error) {
      toast.error("Failed to save registration data");
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
              gender={registrationState?.gender || null}
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
