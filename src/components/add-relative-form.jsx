import { useAddFamilyMember } from "@/hooks/useFamily";
import { useAgeRanges } from "@/hooks/useMasters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "react-phone-number-input";
import { relationshipTypes } from "@/constants/dropDownConstants";
import toast from "react-hot-toast";
import { SelectLabel } from "@/components/ui/select";
import { LocationSearchInput } from "./location-search-input";
import AsyncComponent from "./async-component";
import { Map } from "./map";

const addRelativeSchema = z.object({
  relation: z.string({
    required_error: "Relation is required",
  }),

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

  is_alive: z.number().min(0).max(1).default(1),
});

export default function AddRelativeForm({
  id,
  fid,
  mid,
  pid,
  onCancel,
  onSuccess,
  gender,
}) {
  const { mutateAsync: addMember, isLoading: isSubmitting } =
    useAddFamilyMember();
  const { data: ageRanges } = useAgeRanges();

  const form = useForm({
    resolver: zodResolver(addRelativeSchema),
    defaultValues: {
      relation: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone_no: "",
      age_range: "",
      is_alive: 1,
      gender: "",
      native_place: "",
    },
  });

  const calculateRelationData = (relation) => {
    const data = {
      father_id: null,
      mother_id: null,
      partner_id: null,
      children_id: null,
      gender: null,
    };

    switch (relation) {
      case "father":
        data.children_id = id;
        data.gender = "m";
        break;
      case "mother":
        data.children_id = id;
        data.gender = "f";
        break;
      case "son":
        if (gender === "m") {
          data.father_id = id;
          data.mother_id = pid;
        } else {
          data.father_id = fid;
          data.mother_id = id;
        }
        data.gender = "m";
        break;
      case "daughter":
        if (gender === "m") {
          data.father_id = id;
          data.mother_id = pid;
        } else {
          data.father_id = fid;
          data.mother_id = id;
        }
        data.gender = "f";
        break;
      case "spouse":
        data.partner_id = id;
        data.gender = gender === "m" ? "f" : "m";
        break;
      case "brother":
        data.father_id = fid;
        data.mother_id = mid;
        data.gender = "m";
        break;
      case "sister":
        data.father_id = fid;
        data.mother_id = mid;
        data.gender = "f";
        break;
    }

    return data;
  };

  const selectedRelation = useWatch({
    control: form.control,
    name: "relation",
  });

  // Determine gender based on relation
  const getGenderForRelation = (relation) => {
    switch (relation) {
      case "father":
      case "son":
      case "brother":
        return "m";
      case "mother":
      case "daughter":
      case "sister":
        return "f";
      case "spouse":
        return gender === "m" ? "f" : "m";
      default:
        return null;
    }
  };

  const relationGender = getGenderForRelation(selectedRelation);

  const filteredRelativesDropDown = relationshipTypes?.filter((relation) => {
    switch (relation.value) {
      case "father":
        return !fid;
      case "mother":
        return !mid;
      case "spouse":
        return !pid;
      default:
        return true;
    }
  });

  const onSubmit = async (values) => {
    try {
      const relationData = calculateRelationData(values.relation);
      if (!relationData) return;

      const memberData = {
        ...values,
        ...relationData,
        email: values.is_alive ? values.email : null,
        phone_no: values.is_alive ? values.phone_no : null,
        is_alive: values.is_alive ? 1 : 0,
      };

      await addMember(memberData);
      onSuccess?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <AsyncComponent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-16 p-2 md:p-4 lg:p-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-primary">
              Add New Relative
            </h2>
            <p className="text-sm text-gray-500">
              Enter relative's information below
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-full">
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Relation</SelectLabel>
                        {filteredRelativesDropDown?.map((relation) => (
                          <SelectItem key={relation.id} value={relation.value}>
                            {relation.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Input
                  value={relationGender === "m" ? "Male" : "Female"}
                  disabled
                  className="rounded-full"
                />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-full" />
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
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-full" />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-full" />
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
                  <FormLabel>Age Range</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-full">
                        <SelectValue placeholder="Select age range" />
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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="rounded-full" />
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
                  <FormControl>
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="IN"
                      value={field.value}
                      onChange={field.onChange}
                      limitMaxLength
                      maxLength={15}
                      className="border rounded-r-full rounded-l-full md:h-10 px-4 bg-background"
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
                  <FormLabel>Native Place</FormLabel>
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

            <div className="flex items-center">
              <FormField
                control={form.control}
                name="is_alive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Living Status</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === 1}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? 1 : 0)
                        }
                        className="data-[state=checked]:bg-brandPrimary data-[state=checked]:border-brandPrimary data-[state=checked]:hover:bg-brandPrimary data-[state=checked]:hover:border-brandPrimary"
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value === 1 ? "Alive" : "Deceased"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-brandPrimary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </Form>
      <div className="my-4 px-2 md:px-4 lg:px-6">
        <Map
          place={form.getValues("native_place")}
          className="w-full rounded-lg shadow-md"
        />
      </div>
    </AsyncComponent>
  );
}
