import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
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
import { toast } from "react-hot-toast";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { format } from "date-fns";
import CustomDateMonthYearPicker from "../custom-ui/custom-dateMonthYearPicker";

const executorSchema = z.object({
  name: z.string().min(1, "Executor name is required"),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .refine((dateStr) => {
      const dob = new Date(dateStr);
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
  phone_no: z.string().min(10, "Phone number must be at least 10 digits"),
  phone_country_code: z.string().min(1, "Country code is required"),
  relation: z.string().optional(),
  // address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  // pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  gender: z.enum(["m", "f"], { required_error: "Please select a gender" }),
});

export default function Executor({ setStep, willId }) {
  const { addExecutorInfo, isAddingExecutorInfo, willData } = useWill();

  const form = useForm({
    resolver: zodResolver(executorSchema),
    defaultValues: {
      phone_country_code: "+91",
      ...(willData?.data?.["executor-info"] || {}),
      phone_no:
        willData?.data?.["executor-info"]?.phone_country_code +
          willData?.data?.["executor-info"]?.phone_no || "",
      date_of_birth: willData?.data?.["executor-info"]?.date_of_birth
        ? format(
            new Date(willData?.data?.["executor-info"]?.date_of_birth),
            "yyyy-MM-dd"
          )
        : null,
      gender: willData?.data?.["executor-info"]?.gender || "m",
    },
  });

  const onSubmit = async (data) => {
    const phoneNumber = parsePhoneNumber(data.phone_no);

    const countryCode = phoneNumber.countryCallingCode; // Get the country code
    const localPhoneNumber = phoneNumber.nationalNumber; // Get the national number

    try {
      await addExecutorInfo({
        willId,
        executorData: {
          ...data,
          phone_country_code: `+${countryCode}`,
          phone_no: localPhoneNumber,
          date_of_birth: format(data.date_of_birth, "yyyy-MM-dd"),
        },
      });
      toast.success("Executor information saved successfully");
      setStep("review");
    } catch (error) {
      console.error("Error saving executor info:", error);
      toast.error("Failed to save executor information");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="">
          <h2 className="text-xl font-semibold mb-6">Executor Information</h2>
          <p className="text-gray-600 mb-6">
            An executor is responsible for carrying out the instructions in your
            will. Choose someone you trust who is capable of handling this
            responsibility.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 md:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                      {...field}
                      placeholder="Enter executor's name"
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
                      {...field}
                      maxDate={new Date()}
                      className="rounded-full h-10 md:h-12"
                      placeholder="Select date of birth"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 md:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                      {...field}
                      placeholder="e.g., Brother, Sister, Friend"
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
                      className="h-10 md:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                      type="email"
                      {...field}
                      placeholder="Enter email address"
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
                      international
                      className="h-10 md:h-12 rounded-l-full rounded-r-full bg-background text-foreground pl-2"
                      countryCallingCodeEditable={false}
                      defaultCountry="IN"
                      maxLength={15}
                      value={field.value}
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

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 md:h-12 rounded-l-full rounded-r-full bg-background text-foreground"
                      {...field}
                      placeholder="Enter city"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={field.value === "m" ? "default" : "outline"}
                      className={`w-32 gap-2 ${
                        field.value === "m"
                          ? "bg-primary text-white [&>svg]:fill-white"
                          : "[&>svg]:fill-primary"
                      } h-10 md:h-12 rounded-r-full rounded-l-full`}
                      onClick={() => field.onChange("m")}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M19.5876 0.412117C19.5805 0.40611 19.571 0.401305 19.5662 0.395298C19.2453 0.0757413 18.8008 -0.0503998 18.3896 0.0180767L13.6332 0.0805466C12.8809 0.0913586 12.2795 0.714855 12.289 1.4753C12.2986 2.23335 12.8678 2.79918 13.6677 2.83282L15.2603 2.8124L12.9296 5.16823C11.5439 4.13508 9.87521 3.57645 8.1198 3.57645C5.94961 3.57645 3.90896 4.43061 2.37461 5.98154C-0.791538 9.18311 -0.791538 14.3933 2.37461 17.5949C3.90896 19.1458 5.94961 20 8.1198 20C10.2888 20 12.3306 19.1458 13.865 17.5949C16.6698 14.7573 16.9943 10.3448 14.8289 7.14804L17.276 4.68169V6.4825C17.276 7.24295 17.8869 7.85803 18.638 7.85803C19.3927 7.85803 20 7.24175 20 6.4825V1.38881C20 1.0236 19.8467 0.670406 19.5876 0.412117ZM11.9396 15.6487C9.90017 17.7102 6.343 17.7102 4.30117 15.6487C2.19515 13.5212 2.19515 10.0565 4.30117 7.92771C5.32208 6.89696 6.67816 6.32873 8.12099 6.32873C9.56501 6.32873 10.9187 6.89696 11.942 7.92771C14.0468 10.0553 14.0468 13.5212 11.9396 15.6487Z" />
                      </svg>
                      Male
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "f" ? "default" : "outline"}
                      className={`w-32 gap-2 ${
                        field.value === "f"
                          ? "bg-primary text-white [&>svg]:fill-white"
                          : "[&>svg]:fill-primary"
                      } h-10 md:h-12 rounded-r-full rounded-l-full`}
                      onClick={() => field.onChange("f")}
                    >
                      <svg
                        width="14"
                        height="20"
                        viewBox="0 0 14 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6.70801 0.440918C3.16903 0.440918 0.288086 3.31904 0.288086 6.85802C0.288086 9.99336 2.5551 12.6105 5.5224 13.1672V15.1066H3.84021C3.246 15.1066 2.76537 15.5891 2.76537 16.1824C2.76537 16.7756 3.246 17.2581 3.84021 17.2581H5.5224V18.4663C5.5224 19.0605 6.00491 19.542 6.59912 19.542C7.19333 19.542 7.67677 19.0586 7.67677 18.4663V17.2581H9.44345C10.0377 17.2581 10.5192 16.7737 10.5192 16.1824C10.5192 15.5863 10.0377 15.1066 9.44345 15.1066H7.67677V13.2019C10.7661 12.7325 13.1242 10.0666 13.1242 6.85802C13.1242 3.31904 10.247 0.440918 6.70801 0.440918ZM6.70801 11.1226C4.35463 11.1226 2.44151 9.20858 2.44151 6.85615C2.44151 4.50371 4.35463 2.58965 6.70801 2.58965C9.05951 2.58965 10.9736 4.50371 10.9736 6.85615C10.9736 9.20858 9.06045 11.1226 6.70801 11.1226Z" />
                      </svg>
                      Female
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("allocation")}
            className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isAddingExecutorInfo}
            className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          >
            {isAddingExecutorInfo ? "Saving..." : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
