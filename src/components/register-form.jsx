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
import { registerSchemas } from "@/schemas/registerSchemas";
import toast from "react-hot-toast";
import { ICON_EDIT2 } from "@/constants/iconUrls";
import { Mail, Phone } from "lucide-react";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";

export function RegisterForm({ setOpenTerms }) {
  const [registerType, setRegisterType] = useState("email");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [resendOTPIn, setResendOTPIn] = useState(30);
  const [otpLength, setOtpLength] = useState(6);
  const { sendOTPLoginRegister, verifyOTPLoginRegister } = useAuthentication();
  const { theme } = useThemeLanguage();

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
    resolver: zodResolver(registerSchemas[registerType]),
    mode: "onChange",
  });

  const watchedValues = watch();

  const onSubmit = async (data) => {
    if (registerType === "phone_no" || registerType === "email") {
      try {
        const response = await sendOTPLoginRegister({
          [registerType]: data[registerType],
        });
        if (response.status) {
          setIsOtpSent(true);
          setResendOtp(false);
          setResendOTPIn(30);
          setRegisterType("otp");
          if (registerType === "phone_no") {
            const currentPhoneNo = data.phone_no || "";
            setOtpLength(currentPhoneNo.startsWith("+91") ? 4 : 6);
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to send OTP");
      }
    } else if (registerType === "otp") {
      try {
        await verifyOTPLoginRegister({
          otp: data.otp,
          [watchedValues.phone_no ? "phone_no" : "email"]:
            watchedValues[watchedValues.phone_no ? "phone_no" : "email"],
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "OTP verification failed"
        );
      }
    }
  };

  function renderForm() {
    switch (registerType) {
      case "email":
      case "phone_no":
        return (
          <div className="flex flex-col gap-2 mb-2">
            {registerType === "phone_no" ? (
              <>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  onChange={(value) => setValue("phone_no", value)}
                  value={watchedValues.phone_no}
                  limitMaxLength
                  className="border rounded-r-full rounded-l-full md:h-10 px-4 bg-background"
                />
                {errors.phone_no && (
                  <div className="text-red-500 text-sm">
                    {errors.phone_no.message}
                  </div>
                )}
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
            <div className="mb-4 flex flex-col gap-4 items-center justify-center">
              <InputOTP
                maxLength={otpLength}
                onChange={(value) => setValue("otp", value)}
                value={watchedValues.otp}
                className="rounded-full"
              >
                <InputOTPGroup className="gap-2 rounded-full w-full">
                  {[...Array(otpLength)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="border rounded-full h-8 w-8 lg:h-10 lg:w-10 border-brandPrimary"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {errors.otp && (
                <div className="text-red-500 text-sm">{errors.otp.message}</div>
              )}
            </div>
          )
        );
      default:
        return null;
    }
  }

  const handleregisterTypeChange = (type) => {
    setRegisterType(type);
    reset();
    setIsOtpSent(false);
    setResendOtp(false);
    setResendOTPIn(30);
  };

  const editPhoneEmail = (type) => {
    setRegisterType(type);
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
          <div className="text-center text-[16px] mb-8 font-normal flex items-center gap-4 justify-center">
            <span>{watchedValues.email || watchedValues.phone_no}</span>
            <img
              src={ICON_EDIT2}
              className="h-5 w-5 cursor-pointer"
              onClick={() => {
                editPhoneEmail(watchedValues.phone_no ? "phone_no" : "email");
              }}
            />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderForm()}
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              Object.keys(errors).length > 0 ||
              (registerType === "otp" && !isValidOtp(watchedValues.otp))
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
            {registerType !== "email" && (
              <Button
                className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2 hover:bg-brandPrimary hover:text-blue-50"
                variant="outline"
                onClick={() => handleregisterTypeChange("email")}
              >
                {/* <img src={ICON_EMAIL} className="h-5 w-5" /> */}
                <Mail className="h-5 w-5" />
                <span className="text-[16px]">Register with Email</span>
              </Button>
            )}

            {registerType !== "phone_no" && (
              <Button
                className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2 hover:bg-brandPrimary hover:text-blue-50"
                variant="outline"
                onClick={() => handleregisterTypeChange("phone_no")}
              >
                <Phone className="h-5 w-5" />
                <span className="text-[16px]">Register with Phone</span>
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
