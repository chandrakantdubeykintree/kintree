import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ICON_DELETE, ICON_EDIT2 } from "@/constants/iconUrls";
import { useProfile } from "@/hooks/useProfile";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useEducationTypes } from "@/hooks/useMasters";
import ComponentLoading from "./component-loading";
import toast from "react-hot-toast";
import YearSelect from "./custom-ui/year-select";
import SearchableDropdown from "./custom-ui/searchable-dropdown";
import { Plus } from "lucide-react";

export default function EditEducationForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const {
    profile: educations,
    updateProfile,
    isLoading,
    deleteEducation,
  } = useProfile("user/educations");
  const { width } = useWindowSize();
  const { data: educationTypeList = [] } = useEducationTypes();

  const educationSchema = z.object({
    type_id: z.string().min(1, "Education type is required"),
    institution_name: z.string().min(1, "Institution name is required"),
    start_year: z.string().min(1, "Start year is required").optional(),
    end_year: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      type_id: "",
      institution_name: "",
      start_year: "",
      end_year: "",
    },
  });

  const handleAddNew = () => {
    setSelectedEducation(null);
    setIsEditing(true);
    form.reset();
  };

  const handleEdit = (education) => {
    setSelectedEducation(education);
    setIsEditing(true);
    form.reset({
      type_id: education.type?.id?.toString() || "",
      institution_name: education.institution_name || "",
      start_year: education.start_year || "",
      end_year: education.end_year || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedEducation(null);
    form.reset();
  };

  const onSubmit = async (values) => {
    const submissionData = selectedEducation
      ? { ...values, id: selectedEducation.id }
      : values;

    try {
      await updateProfile({
        url: selectedEducation
          ? `user/educations/${selectedEducation.id}`
          : "user/educations",
        data: submissionData,
        method: selectedEducation ? "PUT" : "POST",
      });
      setIsEditing(false);
      setSelectedEducation(null);
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save education details. Please try again."
      );
    }
  };

  const content = isEditing ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-medium mb-4">
          {selectedEducation ? "Edit Education" : "Add New Education"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Type</FormLabel>
                <FormControl>
                  <SearchableDropdown
                    options={
                      educationTypeList?.map((r) => ({
                        id: r.id.toString(),
                        name: r.name,
                      })) || []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Select Education Type"
                    searchPlaceholder="Search education type..."
                    className="w-full rounded-full bg-background text-foreground my-2 shadow-sm px-4 h-10 lg:h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Name</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full rounded-full bg-background text-foreground my-2 shadow-sm px-4 h-10 lg:h-12"
                    placeholder="Enter Institution Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Year</FormLabel>
                <FormControl>
                  <YearSelect
                    {...field}
                    placeholder="Select Start Year"
                    startYear={1900}
                    endYear={new Date().getFullYear()}
                    className="w-full rounded-full bg-background text-foreground my-2 shadow-sm px-4 h-10 lg:h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Year</FormLabel>
                <FormControl>
                  <YearSelect
                    {...field}
                    placeholder="Select End Year"
                    startYear={1900}
                    endYear={new Date().getFullYear() + 10}
                    className="w-full rounded-full bg-background text-foreground my-2 shadow-sm px-4 h-10 lg:h-12"
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
    <div className="grid grid-cols-1 gap-6 max-h-[400px] overflow-y-auto no_scrollbar">
      {educations?.length > 0 ? (
        educations.map((education) => (
          <div
            key={education.id}
            className="border rounded-lg p-4 relative bg-[#e4e8ec] dark:bg-[#131313]"
          >
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 rounded-full"
                onClick={() => handleEdit(education)}
              >
                <img src={ICON_EDIT2} className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-10 rounded-full"
                onClick={() => deleteEducation(education.id)}
              >
                <img src={ICON_DELETE} className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Education Type</p>
                <h3 className="text-md font-semibold">
                  {educationTypeList.find(
                    (et) => et.id === education.type?.toString()
                  )?.name || education.type}
                </h3>
              </div>
              <div>
                <p className="text-sm">Institution Name</p>
                <h3 className="text-md font-semibold">
                  {education.institution_name}
                </h3>
              </div>
              <div>
                <p className="text-sm">Start Year</p>
                <h3 className="text-md font-semibold">
                  {education.start_year}
                </h3>
              </div>
              <div>
                <p className="text-sm">End Year</p>
                <h3 className="text-md font-semibold">{education.end_year}</h3>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          No education details available
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <ComponentLoading />;
  }

  return width > 640 ? (
    <>
      <div className="px-3">
        <div className="h-[60px] flex items-center justify-between border-b">
          <h2 className="text-lg font-medium">Education</h2>
          {!isEditing && (
            <button
              className="flex items-center gap-2 border border-brandPrimary dark:border-dark-card text-light-text rounded-l-full rounded-r-full px-4 py-2 cursor-pointer hover:bg-brandPrimary hover:text-white"
              onClick={handleAddNew}
            >
              <span>Add</span>
              <img src={ICON_EDIT2} className="" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">{content}</div>
    </>
  ) : (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="bg-[#F3EAF3] px-4 rounded-[6px] text-brandPrimary text-[16px] h-[36px] border-none">
          Education
        </AccordionTrigger>
        <AccordionContent className="border-none p-4 relative">
          <div className="flex absolute top-1 right-0 rounded-full w-10 h-10 cursor-pointer items-center justify-center">
            {!isEditing && (
              <Plus
                className="w-5 stroke-brandPrimary"
                onClick={handleAddNew}
              />
            )}
          </div>
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
