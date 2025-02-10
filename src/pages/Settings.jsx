import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import AsyncComponent from "@/components/async-component";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { capitalizeName, getInitials } from "@/utils/stringFormat";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { CustomPasswordInput } from "@/components/custom-ui/custom_pasword_input";

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

export default function Settings() {
  const { t } = useTranslation();
  const [activeForm, setActiveForm] = useState(null);
  const { setTheme, setLanguage } = useThemeLanguage();
  const { handleLogout } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [accountAction, setAccountAction] = useState(null);
  const { profile, updateProfile } = useProfile("user/configurations");
  const { profile: user, isProfileLoading } = useProfile("/user/profile");

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  });

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

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

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
              <CardTitle>{t("text.change_password")}</CardTitle>
              <CardDescription>
                {t("text.update_account_password")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeForm === "password" ? (
                <form
                  onSubmit={handlePasswordSubmit((values) =>
                    handleSubmit(values, "password")
                  )}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Input
                        id="current_password"
                        {...passwordRegister("current_password")}
                        type={
                          showPassword.current_password ? "text" : "password"
                        }
                        className="bg-background text-foreground h-10 lg:h-12 pl-10 rounded-full"
                      />
                      {/* <CustomPasswordInput
                        {...passwordRegister("current_password")}
                      /> */}
                      {showPassword.current_password ? (
                        <EyeIcon
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("current_password")
                          }
                        />
                      ) : (
                        <EyeOffIcon
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("current_password")
                          }
                        />
                      )}
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-sm text-red-500">
                        {passwordErrors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Input
                        id="password"
                        {...passwordRegister("password")}
                        type={showPassword.password ? "text" : "password"}
                        className="bg-background text-foreground h-10 lg:h-12 pl-10 rounded-full"
                      />
                      {showPassword.password ? (
                        <EyeIcon
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                          onClick={() => togglePasswordVisibility("password")}
                        />
                      ) : (
                        <EyeOffIcon
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                          onClick={() => togglePasswordVisibility("password")}
                        />
                      )}
                    </div>
                    {passwordErrors.password && (
                      <p className="text-sm text-red-500">
                        {passwordErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Input
                        id="password_confirmation"
                        {...passwordRegister("password_confirmation")}
                        type={
                          showPassword.password_confirmation
                            ? "text"
                            : "password"
                        }
                        className="bg-background text-foreground h-10 lg:h-12 pl-10 rounded-full"
                      />
                      {showPassword.password_confirmation ? (
                        <EyeIcon
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("password_confirmation")
                          }
                        />
                      ) : (
                        <EyeOffIcon
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("password_confirmation")
                          }
                        />
                      )}
                    </div>
                    {passwordErrors.password_confirmation && (
                      <p className="text-sm text-red-500">
                        {passwordErrors.password_confirmation.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="rounded-full">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm(null)}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-md text-gray-600 dark:text-gray-200">
                      Username:{" "}
                      <span className="font-semibold">{user?.username}</span>
                    </p>
                    <p className="text-md text-gray-600 dark:text-gray-200">
                      Email:{" "}
                      <span className="font-semibold">{user?.email}</span>
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveForm("password")}
                    className="rounded-full"
                  >
                    Change Password
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Settings Card */}
          <Card className="">
            <CardHeader>
              <CardTitle>Language & Theme</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
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
                    <Label>Theme</Label>
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
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                    {languageErrors.theme && (
                      <p className="text-sm text-red-500">
                        {languageErrors.theme.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
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

                  <div className="flex gap-2">
                    <Button type="submit" className="rounded-full">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm(null)}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-200">
                      Current Theme:{" "}
                      <span className="font-semibold">
                        {capitalizeName(profile?.theme)}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-200">
                      Current Language:{" "}
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
                    Edit Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Privacy Card */}
          <Card className="">
            <CardHeader>
              <CardTitle>Contact Privacy</CardTitle>
              <CardDescription>Manage your contact privacy</CardDescription>
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
                        <Label htmlFor="phone_no">Phone Number</Label>
                        <Switch
                          className="border border-primary"
                          id="phone_no"
                          checked={watchPhonePrivacy("phone_no")}
                          onCheckedChange={(checked) =>
                            setPhonePrivacyValue("phone_no", checked)
                          }
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-200">
                          {watchPhonePrivacy("phone_no") ? "Public" : "Private"}
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
                        Save Phone Privacy
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
                        <Label htmlFor="email">Email</Label>
                        <Switch
                          className="border border-primary"
                          id="email"
                          checked={watchEmailPrivacy("email")}
                          onCheckedChange={(checked) =>
                            setEmailPrivacyValue("email", checked)
                          }
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-200">
                          {watchEmailPrivacy("email") ? "Public" : "Private"}
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
                        Save Email Privacy
                      </Button>
                    </div>
                  </form>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm(null)}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
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
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account status</CardDescription>
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
                    <Label>Action Type</Label>
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
                          Deactivate Account
                        </SelectItem>
                        <SelectItem value="deletion">Delete Account</SelectItem>
                      </SelectContent>
                    </Select>
                    {accountErrors.type && (
                      <p className="text-sm text-red-500">
                        {accountErrors.type.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Textarea
                      {...accountRegister("comment")}
                      placeholder="Please tell us why..."
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

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="destructive"
                      className="rounded-full"
                    >
                      Continue
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm(null)}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => setActiveForm("account")}
                  className="rounded-full"
                >
                  Manage Account
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {accountAction?.type === "deactivate"
                    ? "Confirm Account Deactivation"
                    : "Confirm Account Deletion"}
                </DialogTitle>
                <DialogDescription>
                  {accountAction?.type === "deactivate" ? (
                    <>
                      Your account will be deactivated after 90 days. You can
                      reactivate your account by logging in during this period.
                    </>
                  ) : (
                    <>
                      Your account and all associated data will be permanently
                      deleted in 30 days. This action cannot be undone.
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleAccountAction}
                  className="rounded-full"
                >
                  {accountAction?.type === "deactivate"
                    ? "Deactivate Account"
                    : "Delete Account"}
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
                  Keep Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </AsyncComponent>
  );
}
