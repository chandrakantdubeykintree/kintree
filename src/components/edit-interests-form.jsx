import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProfile } from "@/hooks/useProfile";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ICON_EDIT2 } from "@/constants/iconUrls";
import { useInterests } from "@/hooks/useMasters";
import { Badge } from "@/components/ui/badge";
import ComponentLoading from "@/components/component-loading";
import toast from "react-hot-toast";
import { Pen, Plus, Trash2 } from "lucide-react";

const interestsSchema = z.object({
  interest_ids: z
    .array(z.string())
    .min(1, "Please select at least one interest"),
  searchQuery: z.string().optional(),
});

const newInterestSchema = z.object({
  name: z.string().min(1, "Interest name is required"),
});

export default function EditInterestsForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { profile, updateProfile, isLoading } = useProfile("/user/interests");
  const { data: availableInterests, refetch: refetchInterests } =
    useInterests();

  const { width } = useWindowSize();
  const { updateInterests } = useProfile("/user/store-custom-interests");

  const form = useForm({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      interest_ids: profile?.map((interest) => interest.id.toString()) || [],
      searchQuery: "",
    },
  });

  const createInterestForm = useForm({
    resolver: zodResolver(newInterestSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset();
  };

  const onSubmit = async (values) => {
    try {
      await updateProfile({
        url: "/user/interests",
        data: { interest_ids: values.interest_ids },
      });
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update interests"
      );
    }
  };

  const onCreateInterest = async (values) => {
    try {
      await updateInterests({
        name: values.name,
      });
      setShowCreateModal(false);
      createInterestForm.reset();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create interest"
      );
    }
  };

  const handleRemoveAll = () => {
    form.setValue("interest_ids", []);
  };
  const handleInterestChange = (interestId) => {
    const currentInterests = form.getValues("interest_ids");
    const index = currentInterests.indexOf(interestId);

    if (index === -1) {
      form.setValue("interest_ids", [...currentInterests, interestId]);
    } else {
      form.setValue(
        "interest_ids",
        currentInterests.filter((id) => id !== interestId)
      );
    }
  };

  const filteredInterests = availableInterests?.filter((interest) =>
    interest.name
      .toLowerCase()
      .includes(form.watch("searchQuery", "").toLowerCase())
  );

  const content = isEditing ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <div className="flex gap-2 items-center">
            <FormField
              control={form.control}
              name="searchQuery"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Search interests..."
                      className="w-full rounded-full bg-background text-foreground my-2 shadow-sm px-4 h-10"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Interest
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="interest_ids"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-wrap gap-2 overflow-hidden overflow-y-scroll max-h-[300px] p-2">
                  {filteredInterests?.map((interest) => {
                    const isSelected = field.value.includes(
                      interest.id.toString()
                    );
                    return (
                      <Badge
                        key={interest.id}
                        className={`cursor-pointer text-md font-semibold rounded-full px-4 py-1 flex items-center gap-2 transition-all ${
                          isSelected
                            ? "bg-brandPrimary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() =>
                          handleInterestChange(interest.id.toString())
                        }
                      >
                        {interest.name}
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemoveAll}
            className="rounded-full"
          >
            <Trash2 className="w-4 h-4" />
            Remove All
          </Button>
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
    <div className="flex flex-wrap w-full">
      {profile?.length > 0 ? (
        profile.map((interest) => (
          <Badge
            key={interest.id}
            className="m-1 text-md font-semibold rounded-full bg-brandPrimary text-white"
          >
            {interest.name}
          </Badge>
        ))
      ) : (
        <div>
          <p className="text-sm">No interests available</p>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (profile) {
      form.reset({
        interest_ids: profile.map((interest) => interest.id.toString()),
        searchQuery: "",
      });
    }
  }, [profile, form]);

  if (isLoading) {
    return <ComponentLoading />;
  }

  return width > 640 ? (
    <>
      <div className="px-3">
        <div className="h-[60px] flex items-center justify-between border-b">
          <h2 className="text-lg font-medium">Interests</h2>
          {!isEditing && (
            <button
              className="flex items-center border-brandPrimary gap-2 border border-dark-border dark:border-dark-card text-light-text rounded-l-full rounded-r-full px-4 py-2 cursor-pointer hover:bg-brandPrimary hover:text-white"
              onClick={handleEditClick}
            >
              <span>Edit</span>
              <img src={ICON_EDIT2} className="" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">{content}</div>
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Interest</DialogTitle>
          </DialogHeader>
          <Form {...createInterestForm}>
            <form onSubmit={createInterestForm.handleSubmit(onCreateInterest)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={createInterestForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter interest name"
                          className="rounded-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    createInterestForm.reset();
                  }}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full">
                  Add Interest
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  ) : (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1 border-none">
        <AccordionTrigger className="bg-[#F3EAF3] px-4 rounded-[6px] text-brandPrimary text-[16px] h-[36px] border-none">
          Interests
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
