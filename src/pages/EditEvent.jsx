import AsyncComponent from "@/components/async-component";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { useEvent, useEditEvent } from "@/hooks/useEvents";
import {
  useDeleteAttachment,
  useUploadAttachment,
} from "@/hooks/useAttachments";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFamilyMembers } from "@/hooks/useFamily";
import { useEventCategories } from "@/hooks/useMasters";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeName } from "@/utils/stringFormat";
import { format, addHours } from "date-fns";
import { NavLink, useNavigate, useParams } from "react-router";
import { Map } from "@/components/map";
import { LocationSearchInput } from "@/components/location-search-input";
import CustomMultiSelect from "@/components/custom-ui/custom-multi-select";
import { Card } from "@/components/ui/card";
import CustomDateTimePicker from "@/components/custom-ui/custom-date-time-picker";
import ComponentLoading from "@/components/component-loading";
import toast from "react-hot-toast";

const editEventSchema = z.object({
  event_category_id: z.string().min(1, "Event category is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  venue: z.string().min(1, "Venue is required"),
  start_at: z
    .string()
    .min(1, "Start date is required")
    .refine(
      (date) => new Date(date) > new Date(),
      "Start date & time must be in the future"
    ),
  end_at: z
    .string()
    .optional()
    .refine(
      (date) => !date || new Date(date) > new Date(),
      "End date & time must be in the future"
    ),
  details: z
    .string()
    .max(200, "Details must be 200 characters or less")
    .optional(),
  attachment_ids: z.array(z.number()).optional(),
  attendee_ids: z.array(z.number()).min(1, "Attendees are required"),
});

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
  const { mutateAsync: editEvent, isLoading } = useEditEvent();
  const { data: members = [] } = useFamilyMembers();
  const { data: eventCategories = [] } = useEventCategories();
  const { mutateAsync: uploadAttachment, isLoading: isUploading } =
    useUploadAttachment();
  const { mutate: deleteAttachment, isLoading: isDeleting } =
    useDeleteAttachment();
  const [attachments, setAttachments] = useState([]);

  const form = useForm({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      event_category_id: "",
      name: "",
      venue: "",
      start_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end_at: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
      details: "",
      attachment_ids: [],
      attendee_ids: [],
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        event_category_id: event.category?.id?.toString() || "",
        name: event.name || "",
        venue: event.venue || "",
        start_at: format(new Date(event.start_at), "yyyy-MM-dd'T'HH:mm"),
        end_at: event.end_at
          ? format(new Date(event.end_at), "yyyy-MM-dd'T'HH:mm")
          : "",
        details: event.details || "",
        attachment_ids: event.attachments?.map((att) => att.id) || [],
        attendee_ids: event.attendees?.map((att) => att.id) || [],
      });
      setAttachments(event.attachments || []);
    }
  }, [event, form]);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        event_category_id: parseInt(data.event_category_id),
        start_at: format(new Date(data.start_at), "yyyy-MM-dd HH:mm:ss"),
        end_at: data.end_at
          ? format(new Date(data.end_at), "yyyy-MM-dd HH:mm:ss")
          : undefined,
      };

      await editEvent({ eventId, updatedEvent: formattedData });
      toast.success("Event updated successfully");
      navigate(`/view-event/${eventId}`);
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (attachments.length + files.length > 3) {
      toast.error("Maximum 3 attachments allowed");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files[]", file);
    });

    try {
      const response = await uploadAttachment(formData);
      const newAttachments = response.data.map((file) => ({
        id: file.id,
        name: file.name,
        url: file.url,
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);
      const currentIds = form.getValues("attachment_ids") || [];
      form.setValue("attachment_ids", [
        ...currentIds,
        ...newAttachments.map((att) => att.id),
      ]);
    } catch (error) {
      toast.error("Failed to upload attachments");
    }
  };

  const removeAttachment = (attachmentId) => {
    if (!attachmentId) return;

    deleteAttachment(attachmentId, {
      onSuccess: () => {
        setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
        const currentIds = form.getValues("attachment_ids") || [];
        form.setValue(
          "attachment_ids",
          currentIds.filter((id) => id !== attachmentId)
        );
      },
      onError: () => {
        toast.error("Failed to delete attachment");
      },
    });
  };

  if (isLoadingEvent) return <ComponentLoading />;

  return (
    <AsyncComponent>
      <Card className="bg-background rounded-2xl h-full overflow-y-scroll no_scrollbar p-4">
        {/* <div className="flex items-center gap-4 mb-6">
          <NavLink
            to={`/view-event/${eventId}`}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <span className="h-8 w-8 rounded-full hover:bg-sky-100 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            Back to Event
          </NavLink>
        </div> */}
        <div className="text-2xl font-medium mb-4">Edit Event</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 rounded-full">
                          <SelectValue placeholder="Select event category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Event Category</SelectLabel>
                            {eventCategories?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {capitalizeName(category.name)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Event Name"
                        className="h-12 rounded-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocationSearchInput
                        {...field}
                        placeholder="Search venue..."
                        className="h-12 rounded-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attendee_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomMultiSelect
                        options={members
                          ?.filter((member) => member.is_active)
                          ?.map((member) => ({
                            value: member.id,
                            label: member.first_name,
                            icon: () => (
                              <img
                                src={member.profile_pic_url}
                                alt={member.first_name}
                                className="w-4 h-4 rounded-full"
                              />
                            ),
                          }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Attendees"
                        className="h-12 rounded-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_at"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomDateTimePicker
                        {...field}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd'T'HH:mm") : ""
                          );
                        }}
                        minDate={new Date()}
                        className="h-12 rounded-full"
                        placeholder="Select start date & time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_at"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomDateTimePicker
                        {...field}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd'T'HH:mm") : ""
                          );
                        }}
                        minDate={
                          form.watch("start_at")
                            ? new Date(form.watch("start_at"))
                            : new Date()
                        }
                        className="h-12 rounded-full"
                        placeholder="Select end date & time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Event Details"
                      className="rounded-2xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={attachments.length >= 3 || isUploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center gap-2 p-2 border rounded-full"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Upload Attachments"}
                </label>
                <span className="text-sm text-gray-500">
                  ({attachments.length}/3)
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 bg-gray-100 p-2 rounded-full"
                  >
                    <span className="text-sm">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-red-500"
                      disabled={isDeleting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {form.watch("venue") && (
              <div className="mt-4 mb-4">
                <Map
                  place={form.watch("venue")}
                  className="w-full h-[300px] rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="flex justify-center max-w-[751px] w-[90%] mx-auto">
              {form.watch("venue") && (
                <div className="mt-4">
                  <Map
                    place={form.watch("venue")}
                    className="w-full rounded-lg shadow-2xl h-[100px]"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={() => navigate(`/view-event/${eventId}`)}
                className="rounded-full h-10 md:h-12"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isUploading}
                className="rounded-full h-10 md:h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Event"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </AsyncComponent>
  );
}
