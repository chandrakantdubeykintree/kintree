import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import CustomDateMonthYearPicker from "../custom-ui/custom-dateMonthYearPicker";

const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's name is required"),
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
        return age - 1 >= 18;
      }
      return age >= 18;
    }, "You must be at least 18 years old"),
  email: z.string().email("Invalid email address"),
  phone_no: z.string().refine((value) => {
    try {
      if (!value) return false;
      const phoneNumber = parsePhoneNumber(value);
      if (!phoneNumber) return false;

      // Get the national number (without country code)
      const nationalNumber = phoneNumber.nationalNumber;

      // Check if it's a valid number for the given country
      return phoneNumber.isValid() && nationalNumber.length <= 10;
    } catch (error) {
      return false;
    }
  }, "Please enter a valid phone number"),
  phone_country_code: z.string().min(1, "Country code is required"),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  occupation: z.enum([
    "salaried",
    "business",
    "professional",
    "retired",
    "other",
  ]),
  designation: z.string().min(1, "Designation is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
});

export default function PersonalInfo({ setStep, willId }) {
  const navigate = useNavigate();
  const { addPersonalInfo, isAddingPersonalInfo, willData } = useWill();

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      marital_status: "single",
      occupation: "salaried",
      phone_country_code: "+91",
      ...willData?.data?.["personal-info"],
      pincode: willData?.data?.["personal-info"]?.pincode?.toString() || "",
      phone_no:
        willData?.data?.["personal-info"]?.phone_country_code +
          willData?.data?.["personal-info"]?.phone_no || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Use parsePhoneNumber to get the country code and national number
      const phoneNumber = parsePhoneNumber(data.phone_no);
      if (phoneNumber) {
        const countryCode = phoneNumber.countryCallingCode; // Get the country code
        const localPhoneNumber = phoneNumber.nationalNumber; // Get the national number

        const response = await addPersonalInfo(
          {
            ...data,
            phone_country_code: `+${countryCode}`, // Format the country code
            phone_no: localPhoneNumber, // Send only the local phone number
          },
          willId
        );
        if (response.success) {
          toast.success(response.message || "Personal info saved successfully");
          setStep("beneficiaries");
        } else {
          toast.error(response.message || "Error saving personal info");
        }
      } else {
        toast.error("Invalid phone number");
      }
    } catch (error) {
      toast.error("Error saving personal info");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                    {...field}
                    placeholder="Enter your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                    {...field}
                    placeholder="Enter father's name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <CustomDateMonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Date of Birth"
                    className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                    type="email"
                    {...field}
                    placeholder="Enter your email"
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
                <FormControl className="border rounded-md pl-1">
                  <PhoneInput
                    className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground pl-2"
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="IN"
                    maxLength={15}
                    limitMaxLength
                    value={field.value}
                    onChange={(value) => {
                      try {
                        if (!value) {
                          field.onChange(value);
                          return;
                        }

                        const phoneNumber = parsePhoneNumber(value);
                        if (phoneNumber) {
                          const nationalNumber = phoneNumber.nationalNumber;

                          if (
                            phoneNumber.isValid() &&
                            nationalNumber.length <= 10
                          ) {
                            field.onChange(value);
                            const countryCode = `+${phoneNumber.countryCallingCode}`;
                            form.setValue("phone_country_code", countryCode);
                          }
                        }
                      } catch (error) {
                        console.error("Phone number parsing error:", error);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marital_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground">
                    <SelectValue placeholder="Select Martial Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Martial Status</SelectLabel>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground">
                    <SelectValue placeholder="Select Occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Occupation</SelectLabel>
                      <SelectItem value="salaried">Salaried</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                    {...field}
                    placeholder="Enter your designation"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                  {...field}
                  placeholder="Enter your address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                    {...field}
                    placeholder="Enter your city"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 lg:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                    {...field}
                    placeholder="Enter pincode"
                    maxLength={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // reset the form
              form.reset();
              navigate("/will");
            }}
            className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isAddingPersonalInfo}
            className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          >
            {isAddingPersonalInfo ? "Saving..." : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
