import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { kintreeApi } from "@/services/kintreeApi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import toast from "react-hot-toast";
import { Mail, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useTranslation } from "react-i18next";

export default function VerifyUserForm({ setIsVerified }) {
  const [verifyType, setVerifyType] = useState("email");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [resendOTPIn, setResendOTPIn] = useState(30);
  const [otpLength, setOtpLength] = useState(6);
  const { t } = useTranslation();

  const verifyUserSchema = z.object({
    email: z.string().email(t("invalid_email_address")).optional(),
    phone_no: z.string().min(10, t("invalid_phone_number")).optional(),
    otp: z.object({
      otp: z
        .string()
        .refine(
          (val) => val.length === 4 || val.length === 6,
          t("otp_must_be_4_or_6_digits")
        )
        .refine((val) => /^\d+$/.test(val), t("otp_must_contain_only_numbers")),
    }),
  });

  const form = useForm({
    resolver: zodResolver(verifyUserSchema),
    mode: "onChange",
  });

  const watchedOtp = form.watch("otp");
  const isOtpComplete = watchedOtp?.length === otpLength;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  const handleVerifyTypeChange = (type) => {
    setVerifyType(type);
    form.reset();
    setIsOtpSent(false);
    setResendOtp(false);
    setResendOTPIn(30);
  };

  const handleResendOTP = async () => {
    if (resendOTPIn > 0) return;

    try {
      const res = await kintreeApi.post("/send-otp/verify-user", {
        [verifyType]: form.getValues(verifyType),
      });
      if (res.data.status) {
        toast.success(res.data.message);
        setResendOtp(false);
        setResendOTPIn(30);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(t("failed_to_resend_otp_please_try_again"));
    }
  };

  const onSubmit = async (values) => {
    try {
      if (!values[verifyType]) {
        toast.error(
          t("please_enter_a_valid") +
            " " +
            (verifyType === "email" ? t("email") : t("phone_number"))
        );
        return;
      }

      if (!isOtpSent) {
        const res = await kintreeApi.post("/send-otp/verify-user", {
          [verifyType]: values[verifyType],
        });
        if (res.data.status) {
          toast.success(res.data.message);
          if (verifyType === "phone_no") {
            const currentPhoneNo = values.phone_no || "";
            setOtpLength(currentPhoneNo.startsWith("+91") ? 4 : 6);
          }
          setIsOtpSent(true);
          setResendOtp(false);
          setResendOTPIn(30);
        } else {
          toast.error(t("failed_to_send_otp"));
        }
      } else {
        if (!values.otp || values.otp.length !== otpLength) {
          toast.error(t("please_enter_a_valid_otp", { otpLength }));
          return;
        }

        const res = await kintreeApi.post("/verify-otp/verify-user", {
          [verifyType]: values[verifyType],
          otp: values.otp,
        });
        if (res.data.success) {
          toast.success(res.data.message);
          handleVerifyTypeChange(verifyType);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    let timer;
    if (isOtpSent && resendOTPIn > 0) {
      timer = setInterval(() => {
        setResendOTPIn((prev) => prev - 1);
      }, 1000);
    } else if (resendOTPIn <= 0) {
      setResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, resendOTPIn]);

  return (
    <Card className="p-4 w-[320px]">
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-[24px] font-semibold text-center">
          {isOtpSent ? t("otp_incoming!") : t("verify_user")}
        </CardTitle>
        <CardDescription>
          {isOtpSent && verifyType === "otp" && (
            <div className="text-[16px] text-gray-500 text-center">
              {t("enter_the_otp_sent_to", { otpLength })}{" "}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isOtpSent ? (
              <FormField
                control={form.control}
                name={verifyType}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {verifyType === "phone_no" ? (
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          defaultCountry="IN"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            setOtpLength(value?.startsWith("+91") ? 4 : 6);
                          }}
                          maxLength={15}
                          limitMaxLength
                          className="border rounded-r-full rounded-l-full md:h-10 px-4 bg-background"
                        />
                      ) : (
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4" />
                          <Input
                            {...field}
                            placeholder={t("email")}
                            type="email"
                            className="md:h-10 rounded-r-full rounded-l-full pl-10"
                          />
                        </div>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4 flex flex-col gap-4 items-center justify-center">
                      <InputOTP
                        maxLength={otpLength}
                        value={field.value}
                        onChange={field.onChange}
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
                    </div>
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                hasErrors ||
                (isOtpSent && !isOtpComplete)
              }
              className="w-full md:h-10 rounded-l-full rounded-r-full mt-2"
            >
              {isOtpSent ? t("verify_otp") : t("send_otp")}
            </Button>

            {isOtpSent && (
              <div className="flex flex-col justify-center items-center mt-4">
                <div className="flex flex-col justify-center items-center gap-2 text-gray-500">
                  <p>{t("didnt_receive_otp")}</p>{" "}
                  <Button
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={!resendOtp}
                    className="font-semibold text-[16px] cursor-pointer hover:underline text-brandPrimary hover:text-brandPrimary"
                  >
                    {resendOtp
                      ? t("resend_code")
                      : t("resend_code_in", { resendOTPIn })}
                  </Button>
                </div>
              </div>
            )}

            {!isOtpSent && (
              <div className="flex flex-col gap-4 mt-4">
                {verifyType === "email" ? (
                  <Button
                    type="button"
                    className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2"
                    variant="outline"
                    onClick={() => handleVerifyTypeChange("phone_no")}
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-[16px]">
                      {t("verify_with_phone")}
                    </span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full md:h-10 rounded-l-full rounded-r-full flex items-center justify-center gap-2"
                    variant="outline"
                    onClick={() => handleVerifyTypeChange("email")}
                  >
                    <Mail className="h-5 w-5" />
                    <span className="text-[16px]">
                      {t("verify_with_email")}
                    </span>
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
