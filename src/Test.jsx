import { CustomInput } from "./components/custom-ui/custom_input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, User, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "./components/custom-ui/custom_button";
import { CustomText } from "./components/custom-ui/custom_text";
import { CustomHeading } from "./components/custom-ui/custom_heading";
import { CustomOTPInput } from "./components/custom-ui/custom_otp_input";

export default function Test() {
  return (
    <div>
      <SignupForm />
      <div className="space-y-8 p-6">
        {/* Headings */}
        <div className="space-y-4">
          <CustomHeading level="h1" translationKey="headings.main">
            Main Heading
          </CustomHeading>

          <CustomHeading
            level="h2"
            variant="primary"
            align="center"
            translationKey="headings.secondary"
          >
            Secondary Heading
          </CustomHeading>

          <CustomHeading
            level="h3"
            weight="medium"
            variant="muted"
            translationKey="headings.tertiary"
          >
            Tertiary Heading
          </CustomHeading>
        </div>

        {/* Text examples */}
        <div className="space-y-4">
          <CustomText size="lg" translationKey="text.description">
            This is a large paragraph of text that demonstrates the default
            styling.
          </CustomText>

          <CustomText
            variant="muted"
            size="sm"
            weight="light"
            translationKey="text.description"
          >
            This is smaller muted text with light weight.
          </CustomText>

          <CustomText
            variant="primary"
            weight="semibold"
            translationKey="text.description"
          >
            This is primary colored text with semibold weight.
          </CustomText>

          <CustomText
            truncate
            className="max-w-[200px]"
            translationKey="text.description"
          >
            This is a truncated text that will show ellipsis when it gets too
            long...
          </CustomText>

          <CustomText
            align="center"
            variant="destructive"
            weight="bold"
            translationKey="text.error"
          >
            Centered error message
          </CustomText>
        </div>
      </div>
    </div>
  );
}

export function SignupForm() {
  const { t } = useTranslation();

  const formSchema = z.object({
    username: z
      .string()
      .min(2, t("forms.username.minLength"))
      .nonempty(t("forms.username.required")),
    email: z
      .string()
      .nonempty(t("forms.email.required"))
      .email(t("forms.email.invalid")),
    password: z
      .string()
      .min(6, t("forms.password.minLength"))
      .nonempty(t("forms.password.required")),
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
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form submitted:", data);
      // Handle form submission
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md p-4"
    >
      <CustomInput
        label={t("forms.label.username")}
        placeholder={t("forms.username.placeholder")}
        icon={User}
        height="h-12"
        {...register("username")}
        error={errors.username}
      />

      <CustomInput
        label={t("forms.label.email")}
        placeholder={t("forms.email.placeholder")}
        icon={Mail}
        height="h-12"
        type="email"
        {...register("email")}
        error={errors.email}
      />

      <CustomInput
        label={t("forms.label.password")}
        placeholder={t("forms.password.placeholder")}
        icon={Lock}
        height="h-12"
        type="password"
        {...register("password")}
        error={errors.password}
      />

      <CustomOTPInput
        length={4}
        onlyNumbers={true}
        {...register("otp")}
        error={errors.otp}
      />

      <CustomButton type="submit" className="w-full" isLoading={isSubmitting}>
        {t("forms.buttons.submit")}
      </CustomButton>
    </form>
  );
}
