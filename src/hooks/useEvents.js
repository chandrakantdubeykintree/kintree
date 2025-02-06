import { kintreeApi } from "../services/kintreeApi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const QUERY_KEYS = {
  EVENTS: "events",
  EVENT: "event",
};

export const fetchEvents = async ({
  pageParam = 1,
  limit = 12,
  filter = "upcoming",
}) => {
  try {
    const response = await kintreeApi.get(`/events`, {
      params: {
        limit,
        page: pageParam,
        filter,
      },
    });

    return {
      data: {
        events: response.data.data.events,
        current_page: response.data.data.current_page,
        next_page: response.data.data.next_page,
        last_page: response.data.data.last_page,
        total_record: response.data.data.total_record,
      },
      success: response.data.success,
      message: response.data.message,
      status_code: response.data.status_code,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchEvent = async (eventId) => {
  try {
    const response = await kintreeApi.get(`/events/${eventId}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createEvent = async (newEvent) => {
  try {
    const response = await kintreeApi.post("/events", newEvent);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const editEvent = async (eventId, updatedEvent) => {
  try {
    const response = await kintreeApi.put(`/events/${eventId}`, updatedEvent);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await kintreeApi.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const useEvents = (filter = "upcoming") => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.EVENTS, filter],
    queryFn: ({ pageParam = 1 }) =>
      fetchEvents({
        pageParam,
        limit: 12,
        filter,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.current_page >= lastPage.data.last_page) {
        return undefined;
      }
      return lastPage.data.current_page + 1;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch events. Please try again later.");
    },
  });
};

export const useEvent = (eventId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENT, eventId],
    queryFn: () => fetchEvent(eventId),
    enabled: Boolean(eventId),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch event details.");
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to create event. Please try again."
      );
    },
    onSuccess: (data) => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
  });
};

export const useEditEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, updatedEvent }) => editEvent(eventId, updatedEvent),
    onSuccess: (data, { eventId }) => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT, eventId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId }) => deleteEvent(eventId),
    onSuccess: (_, { eventId }) => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete event. Please try again."
      );
    },
  });
};

const handleApiError = (error) => {
  const message = error.response?.data?.message || "Something went wrong";
  toast.error(message);
  return Promise.reject(error);
};
