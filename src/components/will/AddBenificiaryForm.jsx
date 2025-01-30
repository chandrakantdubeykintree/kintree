import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import CustomDateMonthYearPicker from "../custom-ui/custom-dateMonthYearPicker";

const beneficiarySchema = z.object({
  name: z.string().min(1, "Name is required"),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      // Adjust age if birthday hasn't occurred this year
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        return age - 1 >= 1;
      }
      return age >= 1;
    }, "You must be at least 1 years old"),
  email: z.string().email("Invalid email address").optional(),
  phone_no: z.string().min(10, "Phone number must be at least 10 digits"),
  phone_country_code: z.string().min(1, "Country code is required"),
  gender: z.enum(["m", "f", "o"]),
});

export default function AddBeneficiaryForm({ willId, onSuccess }) {
  const queryClient = useQueryClient();
  const { addBeneficiary, isAddingBeneficiary } = useWill();

  const form = useForm({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      gender: "m",
      phone_country_code: "+91",
    },
  });

  const onSubmit = async (data) => {
    try {
      const phoneNumber = parsePhoneNumber(data.phone_no);

      const countryCode = phoneNumber.countryCallingCode; // Get the country code
      const localPhoneNumber = phoneNumber.nationalNumber; // Get the national number

      await addBeneficiary({
        willId,
        beneficiaryData: {
          ...data,
          phone_country_code: `+${countryCode}`,
          phone_no: localPhoneNumber,
        },
      });
      queryClient.invalidateQueries(["beneficiaries", willId]);
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Error adding beneficiary:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter beneficiary's name"
                  className="rounded-full h-10 md:h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <CustomDateMonthYearPicker
                    {...field}
                    maxDate={new Date()}
                    className="rounded-full h-10 md:h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="rounded-full h-10 md:h-12"
                >
                  <SelectTrigger className="rounded-full h-10 md:h-12">
                    <SelectValue placeholder="Select Martial Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Male</SelectItem>
                    <SelectItem value="f">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  placeholder="Enter email address"
                  className="rounded-full h-10 md:h-12"
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl className="border rounded-full pl-2">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  value={field.value}
                  maxLength={15}
                  className="rounded-full h-10 md:h-12"
                  onChange={(value) => {
                    field.onChange(value);
                    form.setValue(
                      "phone_country_code",
                      value?.split(" ")[0] || "+91"
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
            className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isAddingBeneficiary}
            className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          >
            {isAddingBeneficiary ? "Adding..." : "Add Beneficiary"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
