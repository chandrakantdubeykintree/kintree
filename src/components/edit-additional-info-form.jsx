import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ICON_EDIT2 } from "@/constants/iconUrls";
import { useProfile } from "@/hooks/useProfile";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  useBloodGroups,
  useLanguages,
  useOccupations,
  useRelationshipTypes,
} from "@/hooks/useMasters";
import ComponentLoading from "./component-loading";
import toast from "react-hot-toast";
import { LocationSearchInput } from "./location-search-input";
import CustomMultiSelect from "./custom-ui/custom-multi-select";
import SearchableDropdown from "./custom-ui/searchable-dropdown";
import CustomDateMonthYearPicker from "./custom-ui/custom-dateMonthYearPicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const additionalInfoSchema = z.object({
  birth_place: z.string().min(1, "Birth place is required"),
  blood_group: z.string().min(1, "Blood group is required"),
  current_city: z.string().min(1, "Current city is required"),
  date_of_anniversary: z.string().optional(),
  known_language_ids: z
    .array(z.string())
    .min(1, "At least one language is required"),
  mother_tongue: z.string().min(1, "Mother tongue is required"),
  native_place: z.string().min(1, "Native place is required"),
  occupation: z.string().min(1, "Occupation is required"),
  relationship_status: z.string().min(1, "Relationship status is required"),
});

export default function EditAdditionalInfoForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { profile, updateProfile, isLoading } = useProfile(
    "/user/additional-info"
  );
  const { width } = useWindowSize();

  const { data: languagesList } = useLanguages();
  const { data: bloodGroupsList } = useBloodGroups();
  const { data: occupationList } = useOccupations();
  const { data: relationshipStatusList } = useRelationshipTypes();

  const form = useForm({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      birth_place: "",
      blood_group: "",
      current_city: "",
      date_of_anniversary: "",
      known_language_ids: [],
      mother_tongue: "",
      native_place: "",
      occupation: "",
      relationship_status: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        birth_place: profile.birth_place || "",
        blood_group: profile.blood_group || "",
        current_city: profile.current_city || "",
        date_of_anniversary: profile.date_of_anniversary || "",
        known_language_ids: Array.isArray(profile.known_languages)
          ? profile.known_languages.map(
              (lang) => lang.id?.toString() || lang.toString()
            )
          : [],
        mother_tongue: profile.mother_tongue || "",
        native_place: profile.native_place || "",
        occupation: profile.occupation || "",
        relationship_status: profile.relationship_status || "",
      });
    }
  }, [profile, form]);

  // Watch relationship status for conditional anniversary field
  const relationshipStatus = form.watch("relationship_status");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset();
  };

  const onSubmit = async (values) => {
    values = {
      ...values,
      known_language_ids: values.known_language_ids.map((id) => id.toString()),
      date_of_anniversary:
        values.relationship_status === "married"
          ? values.date_of_anniversary
          : null,
    };
    try {
      await updateProfile({
        url: "/user/additional-info",
        data: values,
      });
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update information"
      );
    }
  };

  const content = isEditing ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birth_place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Place</FormLabel>
                <FormControl>
                  <LocationSearchInput
                    {...field}
                    placeholder="Search for birth place..."
                    className="rounded-full h-10 md:h-12 bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blood_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <FormControl>
                  <SearchableDropdown
                    options={
                      bloodGroupsList?.map((bg) => ({
                        id: bg.id?.toString() || bg,
                        name: bg.name || bg,
                      })) || []
                    }
                    {...field}
                    placeholder="Select blood group"
                    className="h-10 md:h-12 bg-background rounded-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current City</FormLabel>
                <FormControl>
                  <LocationSearchInput
                    {...field}
                    placeholder="Search for current city..."
                    className="rounded-full h-10 md:h-12 bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relationship_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship Status</FormLabel>
                <FormControl>
                  <SearchableDropdown
                    options={
                      relationshipStatusList?.map((rs) => ({
                        id: rs.id?.toString() || rs,
                        name: rs.name || rs,
                      })) || []
                    }
                    {...field}
                    placeholder="Select relationship status"
                    className="h-10 md:h-12 bg-background rounded-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {relationshipStatus?.toLowerCase() === "married" && (
            <FormField
              control={form.control}
              name="date_of_anniversary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Anniversary</FormLabel>
                  <FormControl>
                    <CustomDateMonthYearPicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select Date"
                      className="rounded-full h-10 md:h-12 bg-background"
                      initialFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="known_language_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Known Languages</FormLabel>
                <FormControl>
                  <CustomMultiSelect
                    options={
                      languagesList?.map((lang) => ({
                        value: lang.id.toString(),
                        label: lang.name,
                      })) || []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select languages"
                    className="h-10 md:h-12 bg-background rounded-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_tongue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother Tongue</FormLabel>
                <FormControl>
                  <SearchableDropdown
                    options={
                      languagesList?.map((lang) => ({
                        id: lang.id?.toString() || lang,
                        name: lang.name || lang,
                      })) || []
                    }
                    {...field}
                    placeholder="Select mother tongue"
                    className="h-10 md:h-12 bg-background rounded-full"
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
                    {...field}
                    placeholder="Search for native place..."
                    className="rounded-full h-10 md:h-12 bg-background"
                  />
                </FormControl>
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
                <FormControl>
                  <SearchableDropdown
                    options={
                      occupationList?.map((occ) => ({
                        id: occ.id?.toString() || occ,
                        name: occ.name || occ,
                      })) || []
                    }
                    {...field}
                    placeholder="Select occupation"
                    className="h-10 md:h-12 bg-background rounded-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelEdit}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button type="submit" className="rounded-full">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Object.entries({
        "Birth Place": profile?.birth_place,
        "Blood Group": profile?.blood_group,
        "Current City": profile?.current_city,
        "Date of Anniversary": profile?.date_of_anniversary,
        "Known Languages": profile?.known_languages
          ?.map((lang) => lang.name)
          ?.join(", "),
        "Mother Tongue": profile?.mother_tongue,
        "Native Place": profile?.native_place,
        Occupation: profile?.occupation,
        "Relationship Status": profile?.relationship_status,
      }).map(([label, value]) => (
        <div key={label}>
          <p className="text-sm">{label}</p>
          <h3 className="text-md font-semibold">{value || "--"}</h3>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <ComponentLoading />;
  }

  return width > 640 ? (
    <>
      <div className="px-3">
        <div className="h-[60px] flex items-center justify-between border-b">
          <h2 className="text-lg font-medium">Additional Information</h2>
          {!isEditing && (
            <button
              className="flex items-center gap-2 border border-brandPrimary border-dark-border dark:border-dark-card text-light-text rounded-l-full rounded-r-full px-4 py-2 cursor-pointer hover:bg-brandPrimary hover:text-white"
              onClick={handleEditClick}
            >
              <span>Edit</span>
              <img src={ICON_EDIT2} className="" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">{content}</div>
    </>
  ) : (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-[#F3EAF3] px-4 rounded-[6px] text-brandPrimary text-[16px] h-[36px]">
          Additional Information
        </AccordionTrigger>
        <AccordionContent className="border-none p-4 relative">
          <div className="flex absolute top-1 right-0 rounded-full w-10 h-10 cursor-pointer items-center justify-center">
            {!isEditing && (
              <Pen
                className="w-5 stroke-brandPrimary"
                onClick={handleEditClick}
              />
            )}
          </div>
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
