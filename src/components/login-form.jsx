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
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import {
  route_forgot_password,
  route_forgot_username,
} from "@/constants/routeEnpoints";
import { CustomInput } from "./custom-ui/custom_input";
import { useTranslation } from "react-i18next";
import { CustomPasswordInput } from "./custom-ui/custom_pasword_input";
import { CustomPhoneInput } from "./custom-ui/custom_phone_input";
import { countriesList } from "@/constants/countriesList";
import { CustomOTPInput } from "./custom-ui/custom_otp_input";

export function LoginForm({ setOpenTerms }) {
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState("email");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [resendOTPIn, setResendOTPIn] = useState(30);
  const [otpLength, setOtpLength] = useState(6);
  const [countryCode, setCountryCode] = useState("");
  const { theme } = useThemeLanguage();
  const navigate = useNavigate();
  const { loginPassword, sendOTPLoginRegister, verifyOTPLoginRegister } =
    useAuthentication();

  const loginSchemas = {
    username: z.object({
      username: z.string().min(3, t("forms.username.minLength")),
      password: z.string().min(5, t("forms.password.minLength")),
    }),

    email: z.object({
      email: z.string().email(t("forms.email.invalid")),
    }),

    phone_no: z.object({
      phone_no: z
        .string()
        .refine((val) => val.length >= 10, t("forms.phone_no.minLength")),
    }),

    otp: z.object({
      otp: z
        .string()
        .refine(
          (val) => val.length === 4 || val.length === 6,
          t("forms.otp.errors.length")
        )
        .refine((val) => /^\d+$/.test(val), t("forms.otp.errors.numbers")),
    }),
  };

  const isValidOtp = (otp) => {
    return /^\d+$/.test(otp) && otp.length === otpLength;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(loginSchemas[loginType]),
    mode: "onChange",
  });

  const watchedValues = watch();
  const hasErrors = Object.keys(errors).length > 0;

  const onSubmit = async (data) => {
    if (loginType === "username") {
      try {
        const response = await loginPassword(data);
        if (response.success) {
          navigate("/foreroom");
        } else {
          toast.error(t("forms.username.invalid"));
          if (response.error === "User not found") {
            handleLoginTypeChange("email");
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Login Failed");
      }
    } else if (loginType === "phone_no" || loginType === "email") {
      try {
        const response = await sendOTPLoginRegister({
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
        toast.error(
          t(
            loginType === "phone_no"
              ? "forms.phone_no.invalid"
              : "forms.email.invalid"
          )
        );
      }
    } else if (loginType === "otp") {
      try {
        await verifyOTPLoginRegister({
          otp: data.otp,
          [watchedValues.phone_no ? "phone_no" : "email"]:
            watchedValues[watchedValues.phone_no ? "phone_no" : "email"],
        });
      } catch (error) {
        toast.error(t("forms.otp.errors.verify"));
      }
    }
  };

  function renderForm() {
    switch (loginType) {
      case "username":
        return (
          <div className="flex flex-col gap-4 mb-4">
            <CustomInput
              placeholder={t("forms.username.placeholder")}
              icon={User}
              {...register("username")}
              error={errors.username}
            />
            <CustomPasswordInput
              // label={t("forms.password.placeholder")}
              icon={Lock}
              placeholder={t("forms.password.placeholder")}
              translationKey="password"
              error={errors.password}
              {...register("password")}
            />

            <div className="flex items-center justify-end text-sm">
              {t("text.forgot")}&nbsp;
              <Link
                to={route_forgot_password}
                className="underline-offset-4 hover:underline text-primary"
              >
                {t("text.password")}
              </Link>
              &nbsp;or&nbsp;
              <Link
                to={route_forgot_username}
                className="underline-offset-4 hover:underline text-primary"
              >
                {t("text.username")}
              </Link>
            </div>
          </div>
        );
      case "email":
      case "phone_no":
        return (
          <div className="flex flex-col gap-2 mb-2">
            {loginType === "phone_no" ? (
              <>
                <CustomPhoneInput
                  translationKey="phone_no"
                  placeholder={t("forms.phone_no.placeholder")}
                  error={errors.phone_no}
                  {...register("phone_no")}
                  countries={countriesList}
                  setCountryCode={setCountryCode}
                />
              </>
            ) : (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4" />
                  <Input
                    {...register("email")}
                    placeholder="Email"
                    type="email"
                    className="md:h-10 rounded-r-full rounded-l-full pl-10"
                  />
                </div>
                {errors.email && (
                  <div className="text-red-500 text-sm">
                    {errors.email.message}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "otp":
        return (
          isOtpSent && (
            <CustomOTPInput
              onlyNumbers={true}
              error={errors.otp}
              length={countryCode === "+91" ? 4 : 6}
              {...register("otp")}
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
      sendOTPLoginRegister({
        email: watchedValues.email,
      });
    } else if (watchedValues.phone_no) {
      sendOTPLoginRegister({
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
          {isOtpSent ? "OTP incoming!" : "Welcome to Kintree"}
        </CardTitle>
        <CardDescription>
          {isOtpSent && (
            <div className="text-[16px] text-gray-500 text-center">
              Enter the {watchedValues.phone_no ? "4" : "6"} digit OTP sent to{" "}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(watchedValues.email || watchedValues.phone_no) && isOtpSent && (
          <div className="text-center text-[16px] mb-8 font-normal flex items-center gap-2 justify-center">
            <span>{watchedValues.email || watchedValues.phone_no}</span>
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
            {isOtpSent ? "Verify OTP" : "Continue"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center gap-8">
        {!isOtpSent && (
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-[1px] bg-border grow" />
            <div className="min-w-fit text-center whitespace-nowrap text-gray-600">
              Try another way?
            </div>
            <div className="h-[1px] bg-border grow" />
          </div>
        )}
        {isOtpSent ? (
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2 text-gray-500">
              <p>Didn’t receive OTP?</p>
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={!resendOtp}
                className="font-semibold text-[16px] cursor-pointer hover:underline text-brandPrimary hover:text-brandPrimary"
              >
                {resendOtp ? "Resend Code" : `Resend Code in ${resendOTPIn}'s`}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {loginType !== "email" && (
              <Button
                className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2 hover:bg-brandPrimary hover:text-blue-50"
                variant="outline"
                onClick={() => handleLoginTypeChange("email")}
              >
                {/* <img src={ICON_EMAIL} className="h-5 w-5" /> */}
                <Mail className="h-5 w-5" />
                <span className="text-[16px]">Login with Email</span>
              </Button>
            )}
            {loginType !== "username" && (
              <Button
                className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2 hover:bg-brandPrimary hover:text-blue-50"
                variant="outline"
                onClick={() => handleLoginTypeChange("username")}
              >
                {/* <img src={ICON_USERNAME} className="h-5 w-5" /> */}
                <User className="h-5 w-5" />
                <span className="text-[16px]">Login with Username</span>
              </Button>
            )}
            {loginType !== "phone_no" && (
              <Button
                className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2 hover:bg-brandPrimary hover:text-blue-50"
                variant="outline"
                onClick={() => handleLoginTypeChange("phone_no")}
              >
                <Phone className="h-5 w-5" />
                <span className="text-[16px]">Login with Phone</span>
              </Button>
            )}
          </div>
        )}

        <div className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
          By using Kintree, you agree to the{" "}
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
            Terms
          </span>{" "}
          and{" "}
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
            Privacy Policy.
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
