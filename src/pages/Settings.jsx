import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LANGUAGES } from "@/constants/languages";
import { LockKeyhole } from "lucide-react";
import AsyncComponent from "@/components/async-component";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { capitalizeName, getInitials } from "@/utils/stringFormat";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { CustomPasswordInput } from "@/components/custom-ui/custom_pasword_input";

export default function Settings() {
  const { t } = useTranslation();
  const PasswordSchema = z
    .object({
      current_password: z
        .string()
        .min(1, "Current password is required")
        .max(20, "Current password must be less than 20 characters"),
      password: z
        .string()
        .min(5, "Password must be at least 5 characters")
        .max(20, "Password must be less than 20 characters")
        .refine((val, ctx) => val !== ctx.data.current_password, {
          message: "New password must be different from current password",
        }),
      password_confirmation: z
        .string()
        .min(5, "Password confirmation must be at least 5 characters")
        .max(20, "Password confirmation must be less than 20 characters"),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Passwords must match",
      path: ["password_confirmation"],
    });

  const LanguageSchema = z.object({
    theme: z.enum(["light", "dark"]),
    language: z.string().min(1, "Language is required"),
  });

  const PhonePrivacySchema = z.object({
    phone_no: z.boolean(),
  });

  const EmailPrivacySchema = z.object({
    email: z.boolean(),
  });

  const AccountSchema = z.object({
    type: z.enum(["deactivate", "deletion"]),
    comment: z
      .string()
      .min(10, "Comment must be at least 10 characters")
      .max(200, "Comment must be less than 200 characters"),
  });

  const [activeForm, setActiveForm] = useState(null);
  const { setTheme, setLanguage } = useThemeLanguage();
  const { handleLogout } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [accountAction, setAccountAction] = useState(null);
  const { profile, updateProfile } = useProfile("user/configurations");
  const { profile: user, isProfileLoading } = useProfile("/user/profile");

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const {
    register: languageRegister,
    handleSubmit: handleLanguageSubmit,
    setValue: setLanguageValue,
    watch: watchLanguage,
    formState: { errors: languageErrors },
  } = useForm({
    resolver: zodResolver(LanguageSchema),
    defaultValues: {
      theme: profile?.theme || "light",
      language: profile?.language || "en",
    },
  });

  const {
    register: phonePrivacyRegister,
    handleSubmit: handlePhonePrivacySubmit,
    setValue: setPhonePrivacyValue,
    watch: watchPhonePrivacy,
    formState: { errors: phonePrivacyErrors },
  } = useForm({
    resolver: zodResolver(PhonePrivacySchema),
    defaultValues: {
      phone_no: user?.phone_no_is_public || false,
    },
  });

  const {
    register: emailPrivacyRegister,
    handleSubmit: handleEmailPrivacySubmit,
    setValue: setEmailPrivacyValue,
    watch: watchEmailPrivacy,
    formState: { errors: emailPrivacyErrors },
  } = useForm({
    resolver: zodResolver(EmailPrivacySchema),
    defaultValues: {
      email: user?.email_is_public || false,
    },
  });

  const {
    register: accountRegister,
    handleSubmit: handleAccountSubmit,
    setValue: setAccountValue,
    watch: watchAccount,
    formState: { errors: accountErrors },
  } = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      type: "deactivate",
      comment: "",
    },
  });

  const handleSubmitPhonePrivacy = async (values) => {
    const dataToSend = {
      type: "phone_no",
      is_public: values.phone_no,
    };

    try {
      await updateProfile({
        url: "/user/change-contact-privacy",
        data: dataToSend,
        method: "PATCH",
      });
      toast.success("Phone privacy updated successfully");
    } catch (error) {
      toast.error("Failed to update phone privacy");
    }
  };

  const handleSubmitEmailPrivacy = async (values) => {
    const dataToSend = {
      type: "email",
      is_public: values.email,
    };

    try {
      await updateProfile({
        url: "/user/change-contact-privacy",
        data: dataToSend,
        method: "PATCH",
      });
      toast.success("Email privacy updated successfully");
      setActiveForm(null);
    } catch (error) {
      toast.error("Failed to update email privacy");
    }
  };

  const handleSubmit = (values, formType) => {
    const endpoints = {
      password: "/user/change-password",
      language: "/user/configurations",
      account: "/user/settings/deactivate-or-deletion",
    };

    if (formType === "account") {
      setAccountAction(values);
      setShowConfirmDialog(true);
      return;
    }

    updateProfile({
      url: endpoints[formType],
      data: values,
    });

    if (formType === "language") {
      setTheme(values.theme);
      setLanguage(values.language);
    }

    setActiveForm(null);
  };

  const handleAccountAction = () => {
    if (accountAction) {
      updateProfile({
        url: "/user/settings/deactivate-or-deletion",
        data: accountAction,
        method: "POST",
      });
      setShowConfirmDialog(false);
      setAccountAction(null);
      setActiveForm(null);
      toast.success(
        `Account ${
          accountAction.type === "deactivate" ? "deactivated" : "deleted"
        } successfully`
      );
      handleLogout();
    }
  };

  return (
    <AsyncComponent isLoading={isProfileLoading}>
      <Card className="w-full shadow-sm border-0 rounded-2xl h-full overflow-y-scroll no_scrollbar">
        <div
          className="relative w-full h-[120px] md:h-[150px] lg:h-[200px] bg-cover bg-center rounded-t-2xl"
          style={{
            backgroundImage: `url(${
              user?.profile_cover_pic_url ||
              "/illustrations/illustration_bg.png"
            })`,
          }}
        >
          {/* Profile Image */}
          <Avatar className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 border-4 border-white">
            <AvatarImage src={user?.profile_pic_url} alt="Profile" />
            <AvatarFallback className="text-2xl">
              {getInitials(user?.basic_info?.first_name) +
                " " +
                getInitials(user?.basic_info?.last_name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mt-16">
          {/* Password Card */}
          <Card className="">
            <CardHeader>
              <CardTitle>{t("change_password")}</CardTitle>
              <CardDescription>{t("update_account_password")}</CardDescription>
            </CardHeader>
            <CardContent>
              {activeForm === "password" ? (
                <form
                  onSubmit={handlePasswordSubmit((values) =>
                    handleSubmit(values, "password")
                  )}
                  className="space-y-4"
                >
                  <CustomPasswordInput
                    icon={LockKeyhole}
                    placeholder={t("current_password")}
                    error={passwordErrors.current_password}
                    {...passwordRegister("current_password")}
                  />
                  <CustomPasswordInput
                    icon={LockKeyhole}
                    {...passwordRegister("password")}
                    placeholder={t("new_password")}
                    error={passwordErrors.password}
                  />
                  <CustomPasswordInput
                    icon={LockKeyhole}
                    {...passwordRegister("password_confirmation")}
                    placeholder={t("confirm_password")}
                    error={passwordErrors.password_confirmation}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm(null)}
                      className="rounded-full"
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit" className="rounded-full">
                      {t("save_password")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-md text-gray-600 dark:text-gray-200">
                      {t("username")}:{" "}
                      <span className="font-semibold">{user?.username}</span>
                    </p>
                    <p className="text-md text-gray-600 dark:text-gray-200">
                      {t("email")}:{" "}
                      <span className="font-semibold">{user?.email}</span>
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveForm("password")}
                    className="rounded-full"
                  >
                    {t("change_password")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Settings Card */}
          <Card className="">
            <CardHeader>
              <CardTitle>{t("language_&_theme")}</CardTitle>
              <CardDescription>{t("customize_app_experience")}</CardDescription>
            </CardHeader>
            <CardContent>
              {activeForm === "language" ? (
                <form
                  onSubmit={handleLanguageSubmit((values) =>
                    handleSubmit(values, "language")
                  )}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Select
                      onValueChange={(value) =>
                        setLanguageValue("theme", value)
                      }
                      defaultValue={watchLanguage("theme")}
                      className="bg-background text-foreground"
                    >
                      <SelectTrigger className="bg-background text-foreground rounded-full h-10 lg:h-12">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t("light")}</SelectItem>
                        <SelectItem value="dark">{t("dark")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {languageErrors.theme && (
                      <p className="text-sm text-red-500">
                        {languageErrors.theme.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Select
                      onValueChange={(value) =>
                        setLanguageValue("language", value)
                      }
                      defaultValue={watchLanguage("language")}
                      className="bg-background text-foreground"
                    >
                      <SelectTrigger className="bg-background text-foreground rounded-full h-10 lg:h-12">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LANGUAGES)?.map(([code, name]) => (
                          <SelectItem value={code} key={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {languageErrors.language && (
                      <p className="text-sm text-red-500">
                        {languageErrors.language.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm(null)}
                      className="rounded-full"
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit" className="rounded-full">
                      {t("save_changes")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-200">
                      {t("current_theme")}:{" "}
                      <span className="font-semibold">
                        {capitalizeName(profile?.theme)}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-200">
                      {t("current_language")}:{" "}
                      <span className="font-semibold">
                        {
                          Object.entries(LANGUAGES)?.find(
                            ([code]) => code === profile?.language
                          )?.[1]
                        }
                      </span>
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveForm("language")}
                    className="rounded-full"
                  >
                    {t("edit_configuration")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Privacy Card */}
          <Card className="">
            <CardHeader>
              <CardTitle>{t("contact_privacy")}</CardTitle>
              <CardDescription>
                {t("manage_your_contact_privacy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeForm === "contact" ? (
                <div className="space-y-6">
                  {/* Phone Privacy Form */}
                  <form
                    onSubmit={handlePhonePrivacySubmit(
                      handleSubmitPhonePrivacy
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="phone_no">{t("phone_number")}</Label>
                        <Switch
                          className="border border-primary"
                          id="phone_no"
                          checked={watchPhonePrivacy("phone_no")}
                          onCheckedChange={(checked) =>
                            setPhonePrivacyValue("phone_no", checked)
                          }
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-200">
                          {watchPhonePrivacy("phone_no")
                            ? t("public")
                            : t("private")}
                        </p>
                      </div>
                      {phonePrivacyErrors.phone_no && (
                        <p className="text-sm text-red-500">
                          {phonePrivacyErrors.phone_no.message}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="rounded-full">
                        {t("save_phone_privacy")}
                      </Button>
                    </div>
                  </form>

                  {/* Email Privacy Form */}
                  <form
                    onSubmit={handleEmailPrivacySubmit(
                      handleSubmitEmailPrivacy
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Switch
                          className="border border-primary"
                          id="email"
                          checked={watchEmailPrivacy("email")}
                          onCheckedChange={(checked) =>
                            setEmailPrivacyValue("email", checked)
                          }
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-200">
                          {watchEmailPrivacy("email")
                            ? t("public")
                            : t("private")}
                        </p>
                      </div>
                      {emailPrivacyErrors.email && (
                        <p className="text-sm text-red-500">
                          {emailPrivacyErrors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="rounded-full">
                        {t("save_email_privacy")}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <Button
                  onClick={() => setActiveForm("contact")}
                  className="rounded-full"
                >
                  Edit Contact Privacy
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Account Management Card */}
          <Card className="">
            <CardHeader>
              <CardTitle>{t("account_management")}</CardTitle>
              <CardDescription>
                {t("manage_your_account_status")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeForm === "account" ? (
                <form
                  onSubmit={handleAccountSubmit((values) =>
                    handleSubmit(values, "account")
                  )}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Select
                      onValueChange={(value) => setAccountValue("type", value)}
                      defaultValue={watchAccount("type")}
                      className="bg-background text-foreground"
                    >
                      <SelectTrigger className="bg-background text-foreground rounded-full h-10 lg:h-12">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deactivate">
                          {t("deactivate_account")}
                        </SelectItem>
                        <SelectItem value="deletion">
                          {t("delete_account")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {accountErrors.type && (
                      <p className="text-sm text-red-500">
                        {accountErrors.type.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      {...accountRegister("comment")}
                      placeholder={t("please_tell_us_why")}
                      className="bg-background text-foreground max-h-40 h-24"
                      maxLength={200}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-200 flex justify-end">
                      {watchAccount("comment")?.length || 0} / 200
                    </p>
                    {accountErrors.comment && (
                      <p className="text-sm text-red-500">
                        {accountErrors.comment.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm(null)}
                      className="rounded-full"
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      className="rounded-full"
                    >
                      {t("continue")}
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => setActiveForm("account")}
                  className="rounded-full"
                >
                  {t("manage_account")}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="max-w-[500px] rounded-2xl w-[90%]">
              <DialogHeader>
                <DialogTitle>
                  {accountAction?.type === "deactivate"
                    ? t("confirm_account_deactivation")
                    : t("confirm_account_deletion")}
                </DialogTitle>
                <DialogDescription>
                  {accountAction?.type === "deactivate" ? (
                    <>{t("deactivate_account_warning")}</>
                  ) : (
                    <>{t("delete_account_warning")}</>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start gap-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleAccountAction}
                  className="rounded-full"
                >
                  {accountAction?.type === "deactivate"
                    ? t("deactivate_account")
                    : t("delete_account")}
                </Button>
                <Button
                  className="rounded-full"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setAccountAction(null);
                    setActiveForm(null);
                  }}
                >
                  {t("keep_account")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </AsyncComponent>
  );
}
