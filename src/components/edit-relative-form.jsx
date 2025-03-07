import { useUpdateFamilyMember } from "@/hooks/useFamily";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import { useAgeRanges } from "@/hooks/useMasters";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AsyncComponent from "./async-component";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import ProfileImageUpload from "./profileImageUpload";
import { LocationSearchInput } from "./location-search-input";

const editRelativeSchema = z.object({
  first_name: z
    .string({
      required_error: "First Name is required",
    })
    .max(20, "Must be 20 characters or less"),

  middle_name: z.string().max(20, "Must be 20 characters or less").optional(),

  last_name: z
    .string({
      required_error: "Last Name is required",
    })
    .max(20, "Must be 20 characters or less"),

  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email must be less than 255 characters")
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),

  phone_no: z
    .string()
    .refine((val) => {
      if (!val) return true; // Optional
      return (
        /^\+?[1-9]\d{0,14}$/.test(val) && val.replace(/\D/g, "").length >= 10
      );
    }, "Phone number must be valid")
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),

  age_range: z
    .number({
      required_error: "Age Group is required",
    })
    .min(1, "Age Group is required"),
  native_place: z.string().optional(),

  profile_image: z.any().optional(),
  is_alive: z.number().min(0).max(1),
});

export default function EditRelativeForm({
  id,
  first_name,
  middle_name,
  last_name,
  email,
  phone_no,
  is_alive,
  age_range_id,
  profile_pic_url,
  onCancel,
  onSuccess,
}) {
  const { mutateAsync: updateMember, isLoading: isSubmitting } =
    useUpdateFamilyMember();
  const { t } = useTranslation();
  const { data: ageRanges } = useAgeRanges();

  const form = useForm({
    resolver: zodResolver(editRelativeSchema),
    defaultValues: {
      first_name: first_name || "",
      middle_name: middle_name || "",
      last_name: last_name || "",
      email: email || "",
      phone_no: phone_no || "",
      is_alive: is_alive ? 1 : 0,
      age_range: age_range_id || 1,
      native_place: "",
      // profile_image: null,
    },
  });

  console.log(profile_pic_url);

  const onSubmit = async (values) => {
    try {
      await updateMember({
        ...values,
        id: id,
        is_alive: values.is_alive ? 1 : 0,
      });
      toast.success(t("member_updated_successfully"));
      onSuccess?.();
    } catch (error) {
      console.log(t("failed_to_update_member"));
    }
  };
  const watchIsAlive = form.watch("is_alive");
  useEffect(() => {
    if (watchIsAlive === 0) {
      form.setValue("email", "");
      form.setValue("phone_no", "");
      form.setValue("age_range", 1);
    }
  }, [watchIsAlive, form]);
  return (
    <AsyncComponent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div
            className="relative w-full h-[150px] md:h-[200px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${"/illustrations/illustration_bg.png"})`,
            }}
          >
            <div className="absolute top-4 left-4 h-4 w-4 flex items-center justify-center cursor-pointer rounded-full p-3 bg-primary border border-primary-foreground">
              <Link onClick={onCancel}>
                <ArrowLeft className="w-5 h-5 text-primary-foreground" />
              </Link>
            </div>
            {/* <FormField
              control={form.control}
              name="profile_image"
              render={({ field }) => (
                <FormItem className="absolute md:top-36 top-24 left-1/2 transform -translate-x-1/2 flex m-auto">
                  <FormControl>
                    <ProfileImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      firstName={form.watch("first_name")}
                      lastName={form.watch("last_name")}
                      imgSrc={profile_pic_url}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          <div className="text-center pt-12">
            <h2 className="text-xl font-semibold">
              {t("edit_member_details")}
            </h2>{" "}
          </div>

          <div className="space-y-6 p-2 md:p-4 lg:p-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("first_name")}
                        className={`border bg-background border-gray-300 rounded-r-full rounded-l-full h-10 px-4`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("middle_name")}
                        className={`border bg-background border-gray-300 rounded-r-full rounded-l-full h-10 px-4`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("last_name")}
                        className={`border bg-background border-gray-300 rounded-r-full rounded-l-full h-10 px-4`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="native_place"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocationSearchInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        placeholder="Search for native place..."
                        error={form.formState.errors.native_place?.message}
                        className="rounded-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchIsAlive === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            placeholder={t("email")}
                            className={`border bg-background border-gray-300 rounded-r-full rounded-l-full h-10 px-4`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="IN"
                            value={field.value}
                            onChange={field.onChange}
                            limitMaxLength
                            maxLength={15}
                            placeholder={t("phone_number")}
                            className="border rounded-r-full rounded-l-full md:h-10 px-4 bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age_range"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 rounded-full text-foreground bg-background">
                              <SelectValue
                                placeholder={t("select_age_range")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[150px] overflow-y-auto no_scrollbar rounded-2xl">
                            {ageRanges?.map((ageRange) => (
                              <SelectItem
                                key={ageRange.id}
                                value={ageRange.id.toString()}
                              >
                                {ageRange.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="is_alive"
                render={({ field }) => (
                  <FormItem className="flex items-end gap-4">
                    <FormLabel>{t("living_status")}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === 1}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? 1 : 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Fields */}

            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-full"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("saving") : t("save_changes")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AsyncComponent>
  );
}
