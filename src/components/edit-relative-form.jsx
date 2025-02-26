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

// Zod schema for form validation

export default function EditRelativeForm({
  id,
  first_name,
  middle_name,
  last_name,
  email,
  phone_no,
  is_alive,
  age_range_id,
  onCancel,
  onSuccess,
}) {
  const { mutateAsync: updateMember, isLoading: isSubmitting } =
    useUpdateFamilyMember();
  const { t } = useTranslation();
  const { data: ageRanges } = useAgeRanges();
  const editRelativeSchema = (t) =>
    z.object({
      first_name: z
        .string()
        .min(1, t("first_name_required"))
        .max(20, t("first_name_max_length")),
      middle_name: z.string().max(20, t("middle_name_max_length")).optional(),
      last_name: z
        .string()
        .min(1, t("last_name_required"))
        .max(20, t("last_name_max_length")),
      email: z.string().email(t("invalid_email_address")).or(z.literal("")),
      phone_no: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, t("invalid_phone_number"))
        .or(z.literal("")),
      is_alive: z.number().min(0).max(1),
      age_range: z
        .number()
        .min(1, t("age_range_required"))
        .max(12, t("invalid_age_range")),
    });

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
    },
  });

  const onSubmit = async (values) => {
    try {
      await updateMember({
        id,
        ...values,
        is_alive: values.is_alive ? 1 : 0,
      });
      toast.success(t("member_updated_successfully"));
    } catch (error) {
      toast.error(t("failed_to_update_member"));
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mt-16 p-2 md:p-4 lg:p-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-primary">
            {t("edit_member_details")}
          </h2>
          <p className="text-sm text-gray-500">
            {t("update_member_information_below")}
          </p>
        </div>

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
            </>
          )}

          <FormField
            control={form.control}
            name="age_range"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 rounded-full text-foreground bg-background">
                      <SelectValue placeholder={t("select_age_range")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
        </div>

        {/* Contact Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="is_alive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
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
      </form>
    </Form>
  );
}
