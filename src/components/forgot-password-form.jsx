import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, Phone } from "lucide-react";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { CustomPasswordInput } from "./custom-ui/custom_pasword_input";
import { CustomPhoneInput } from "./custom-ui/custom_phone_input";
import { countriesList } from "@/constants/countriesList";
import { CustomInput } from "./custom-ui/custom_input";
import { CustomOTPInput } from "./custom-ui/custom_otp_input";

export function ForgotPasswordForm({ setOpenTerms }) {
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState("email");
  const [countryCode, setCountryCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [resendOTPIn, setResendOTPIn] = useState(30);
  const [otpLength, setOtpLength] = useState(6);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useThemeLanguage();
  const navigate = useNavigate();
  const { resetPassword, sendOTPForgotPassword, verifyOTPForgotPassword } =
    useAuthentication();

  const resetPasswordSchemas = {
    reset_password: z
      .object({
        new_password: z.string().min(6, t("forms.password.minLength")),
        confirm_password: z.string().min(6, t("forms.password.minLength")),
      })
      .refine((data) => data.new_password === data.confirm_password, {
        message: t("forms.password.mismatch"),
        path: ["confirm_password"],
      }),

    email: z.object({
      email: z.string().email(t("forms.email.invalid")),
    }),

    phone_no: z.object({
      phone_no: z
        .string()
        .regex(/^\+[1-9]\d{1,14}$/, t("forms.phone_no.invalid")),
    }),

    otp: z.object({
      otp: z
        .string()
        .nonempty(t("forms.otp.errors.required"))
        .regex(/^\d+$/, t("forms.otp.errors.numbers"))
        .refine(
          (val) => val.length === 4 || val.length === 6,
          (val) => ({
            message:
              val.length < 4
                ? t("forms.otp.errors.tooShort")
                : val.length > 6
                ? t("forms.otp.errors.tooLong")
                : t("forms.otp.errors.invalidLength"),
          })
        ),
    }),
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchemas[loginType]),
    mode: "onChange",
  });

  const watchedValues = watch();

  const isValidOtp = (otp) => {
    return /^\d+$/.test(otp) && otp.length === otpLength;
  };

  const hasErrors = Object.keys(errors).length > 0;

  const onSubmit = async (data) => {
    if (loginType === "reset_password") {
      try {
        const response = await resetPassword({
          password: data.new_password,
          password_confirmation: data.confirm_password,
        });
        if (response.success) {
          toast.success("Password reset successfully");
          navigate("/login");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Reset Password Failed");
      }
    } else if (loginType === "phone_no" || loginType === "email") {
      try {
        const response = await sendOTPForgotPassword({
          [loginType]: countryCode + data[loginType],
        });
        if (response.status) {
          setIsOtpSent(true);
          setResendOtp(false);
          setResendOTPIn(30);
          setLoginType("otp");
          if (loginType === "phone_no") {
            const currentPhoneNo = data.phone_no || "";
            setOtpLength(currentPhoneNo.startsWith("+91") ? 4 : 6);
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to send OTP");
      }
    } else if (loginType === "otp") {
      try {
        const response = await verifyOTPForgotPassword({
          otp: data.otp,
          [watchedValues.phone_no ? "phone_no" : "email"]:
            watchedValues.phone_no
              ? `${countryCode}${watchedValues.phone_no}`
              : watchedValues.email,
        });
        if (response.success) {
          setLoginType("reset_password");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "OTP verification failed"
        );
      }
    }
  };

  function renderForm() {
    switch (loginType) {
      case "reset_password":
        return (
          <div className="flex flex-col gap-4 mb-4">
            <CustomPasswordInput
              icon={Lock}
              placeholder={t("forms.password.new_password")}
              translationKey="new_password"
              error={errors.new_password}
              {...register("new_password")}
            />
            <CustomPasswordInput
              icon={Lock}
              placeholder={t("forms.password.confirm_password")}
              translationKey="confirm_password"
              error={errors.confirm_password}
              {...register("confirm_password")}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
        );
      case "email":
      case "phone_no":
        return (
          <div className="flex flex-col gap-2 mb-2">
            {loginType === "phone_no" ? (
              <CustomPhoneInput
                translationKey="phone_no"
                placeholder={t("forms.phone_no.placeholder")}
                error={errors.phone_no}
                {...register("phone_no")}
                countries={countriesList}
                setCountryCode={setCountryCode}
              />
            ) : (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4" />
                <CustomInput
                  icon={Mail}
                  {...register("email")}
                  placeholder={t("forms.email.placeholder")}
                  type="email"
                  className="md:h-10 rounded-r-full rounded-l-full pl-10"
                  error={errors.email}
                />
              </div>
            )}
          </div>
        );
      case "otp":
        return (
          isOtpSent && (
            <CustomOTPInput
              onlyNumbers={true}
              length={otpLength}
              {...register("otp")}
              error={errors.otp}
            />
          )
        );
      default:
        return null;
    }
  }

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    reset();
    setIsOtpSent(false);
    setResendOtp(false);
    setResendOTPIn(30);
  };

  const getButtonText = () => {
    if (loginType === "reset_password") {
      return "Reset Password";
    }
    if (loginType === "otp") {
      return "Verify OTP";
    }
    return "Continue";
  };

  const editPhoneEmail = (type) => {
    setLoginType(type);
    setIsOtpSent(false);
    setResendOtp(false);
    setResendOTPIn(30);
  };

  function handleResendOtp() {
    if (resendOTPIn > 0) {
      return;
    }
    if (watchedValues.email) {
      sendOTPForgotPassword({
        email: watchedValues.email,
      });
    } else if (watchedValues.phone_no) {
      sendOTPForgotPassword({
        phone_no: watchedValues.phone_no,
      });
    }
    setResendOtp(false);
    setResendOTPIn(30);
  }
  useEffect(() => {
    let timer;

    if (isOtpSent && resendOTPIn > 0) {
      timer = setInterval(() => {
        setResendOTPIn((prev) => prev - 1);
      }, 1000);
    } else if (resendOTPIn <= 0) {
      setResendOtp(true);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isOtpSent, resendOTPIn]);

  return (
    <Card className="max-w-sm mx-8 sm:mx-0 rounded-2xl">
      <CardHeader className="flex items-center justify-center">
        <img
          src={theme === "light" ? "/kintreeLogo.svg" : "/kintreeLogoLight.svg"}
          alt="Kintree logo"
          width={80}
          height={60}
        />
        <CardTitle className="text-[24px] font-semibold">
          {loginType === "reset_password"
            ? t("text.reset_password")
            : isOtpSent
            ? t("text.enter_otp")
            : t("text.reset_password")}
        </CardTitle>
        <CardDescription>
          {isOtpSent && loginType === "otp" && (
            <div className="text-[16px] text-gray-500 text-center">
              {t("text.otp_sent_to")}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(watchedValues.email || watchedValues.phone_no) && isOtpSent && (
          <div className="text-center text-[16px] mb-8 font-normal flex items-center gap-4 justify-center">
            <span>
              {watchedValues.email || countryCode + watchedValues.phone_no}
            </span>

            <span
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                editPhoneEmail(watchedValues.phone_no ? "phone_no" : "email");
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_653_12821)">
                  <path
                    d="M8.57171 20.9826L0.857422 23.1426L3.01742 15.4284L17.1431 1.37125C17.3027 1.20798 17.4935 1.07824 17.7039 0.989668C17.9144 0.901094 18.1405 0.855469 18.3689 0.855469C18.5972 0.855469 18.8233 0.901094 19.0338 0.989668C19.2442 1.07824 19.435 1.20798 19.5946 1.37125L22.6289 4.42268C22.7895 4.58204 22.917 4.77166 23.0041 4.98054C23.0912 5.18945 23.1359 5.41352 23.1359 5.63982C23.1359 5.86613 23.0912 6.0902 23.0041 6.2991C22.917 6.50801 22.7895 6.69761 22.6289 6.85697L8.57171 20.9826Z"
                    stroke="#943f7f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_653_12821">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderForm()}
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              hasErrors ||
              (loginType === "otp" && !isValidOtp(watchedValues.otp))
            }
            className="w-full md:h-10 rounded-l-full rounded-r-full mt-2 text-[16px] bg-brandPrimary text-white hover:bg-brandPrimary hover:text-blue-50"
            variant="outline"
          >
            {getButtonText()}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center gap-8">
        {!isOtpSent && loginType !== "reset_password" && (
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-[1px] bg-border grow" />
            <div className="min-w-fit text-center whitespace-nowrap text-gray-600">
              {t("text.try_another_way")}
            </div>
            <div className="h-[1px] bg-border grow" />
          </div>
        )}
        {isOtpSent && loginType === "otp" && (
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2 text-gray-500">
              <p>{t("text.didnt_receive_otp")}</p>
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={!resendOtp}
                className="font-semibold text-[16px] cursor-pointer hover:underline text-brandPrimary hover:text-brandPrimary"
              >
                {resendOtp
                  ? t("text.resend_otp")
                  : `${t("text.resend_otp")} ${resendOTPIn}'s`}
              </Button>
            </div>
          </div>
        )}
        {loginType !== "reset_password" && !isOtpSent && (
          <div className="flex flex-col gap-6 w-full">
            {loginType !== "email" && (
              <Button
                className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2 hover:bg-brandPrimary hover:text-blue-50"
                variant="outline"
                onClick={() => handleLoginTypeChange("email")}
              >
                <Mail className="h-5 w-5" />
                <span className="text-[16px]">
                  {t("text.reset_with_email")}
                </span>
              </Button>
            )}

            {loginType !== "phone_no" && (
              <Button
                className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2 hover:bg-brandPrimary hover:text-blue-50"
                variant="outline"
                onClick={() => handleLoginTypeChange("phone_no")}
              >
                <Phone className="h-5 w-5" />
                <span className="text-[16px]">
                  {t("text.reset_with_phone")}
                </span>
              </Button>
            )}
          </div>
        )}

        <div className="text-balance text-center text-sm text-muted-foreground  hover:[&_a]:text-primary  ">
          {t("text.rember_password")}&nbsp;
          <NavLink
            className="text-brandPrimary cursor-pointer hover:underline"
            to="/login"
          >
            {t("text.login")}
          </NavLink>
        </div>

        <div className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          {t("text.agree_to_terms_privacy")}{" "}
          <span
            className="text-brandPrimary cursor-pointer hover:underline"
            onClick={() =>
              setOpenTerms({
                isOpen: true,
                type: "terms",
                url: "https://kintree.com/terms-and-condition/",
              })
            }
          >
            {t("text.terms")}
          </span>{" "}
          {t("text.and")}{" "}
          <span
            className="text-brandPrimary cursor-pointer hover:underline"
            onClick={() =>
              setOpenTerms({
                isOpen: true,
                type: "privacy",
                url: "https://kintree.com/privacy-policy/",
              })
            }
          >
            {t("text.privacy")}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
