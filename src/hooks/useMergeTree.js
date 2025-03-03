import { kintreeApi } from "../services/kintreeApi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const QUERY_KEYS = {
  MERGE_REQUESTS: "merge-requests",
  MERGE_REQUEST: "merge-request",
  CANCEL_MERGE_REQUEST: "cancel-merge-request",
};

import { QUERY_KEYS as FAMILY_QUERY_KEYS } from "./useFamily";
import { useNavigate } from "react-router";
import { route_family_tree } from "@/constants/routeEnpoints";

// Fetch merge requests with pagination
export const fetchMergeRequests = async ({ pageParam = 1, limit = 12 }) => {
  try {
    const response = await kintreeApi.get(`/tree-merge-requests`, {
      params: {
        limit,
        page: pageParam,
      },
    });

    return {
      data: {
        requests: response.data.data.requests,
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        total_record: response.data.data.total_record,
        filtered_record: response.data.data.filtered_record,
      },
      success: response.data.success,
      message: response.data.message,
      status_code: response.data.status_code,
      pageParam,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch single merge request
export const fetchMergeRequest = async (requestId) => {
  try {
    const response = await kintreeApi.get(`/tree-merge-requests/${requestId}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create merge request
export const createMergeRequest = async ({
  user_id,
  requestor_id_on_receiver_tree,
  relation_type,
}) => {
  try {
    const response = await kintreeApi.post("/tree-merge-requests", {
      user_id,
      requestor_id_on_receiver_tree,
      relation_type,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Respond to merge request
export const respondToMergeRequest = async ({
  requestId,
  is_accepted,
  same_persons,
}) => {
  try {
    const response = await kintreeApi.put(`/tree-merge-requests/${requestId}`, {
      is_accepted,
      same_persons,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Add this new function to handle canceling merge requests
export const cancelMergeRequest = async (requestId) => {
  try {
    const response = await kintreeApi.delete(
      `/tree-merge-requests/${requestId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Add this new hook for canceling merge requests
export const useCancelMergeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMergeRequest,
    onSuccess: (data, requestId) => {
      toast.success("Merge request cancelled successfully!");

      // Invalidate merge requests list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MERGE_REQUESTS],
      });

      // Invalidate member data
      queryClient.invalidateQueries({
        queryKey: [FAMILY_QUERY_KEYS.MEMBER],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel merge request. Please try again."
      );
    },
  });
};

// Hook for fetching merge requests
export const useMergeRequests = (limit = 12) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.MERGE_REQUESTS, limit],
    queryFn: ({ pageParam = 1 }) => fetchMergeRequests({ pageParam, limit }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data || !lastPage.success) return undefined;
      return lastPage.data.current_page < lastPage.data.last_page
        ? lastPage.data.current_page + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch merge requests. Please try again later.");
    },
  });
};

// Hook for fetching single merge request
export const useMergeRequest = (requestId, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MERGE_REQUEST, requestId],
    queryFn: () => fetchMergeRequest(requestId),
    enabled: Boolean(requestId) && options.enabled !== false,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch merge request details.");
    },
  });
};

// Hook for creating merge request
export const useCreateMergeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMergeRequest,
    onSuccess: (data, variables) => {
      // Invalidate merge requests list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MERGE_REQUESTS],
      });

      return data;
    },
    onError: (error) => {
      console.error("Merge request creation failed:", error);
      throw error;
    },
  });
};

// Hook for responding to merge request
export const useRespondToMergeRequest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: respondToMergeRequest,
    onSuccess: (data) => {
      toast.success("Response submitted successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MERGE_REQUESTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MERGE_REQUESTS],
      });
      navigate(route_family_tree, { replace: true });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to respond to merge request. Please try again."
      );
    },
  });
};

const handleApiError = (error) => {
  const message = error.response?.data?.message || "Something went wrong";
  toast.error(message);
  return Promise.reject(error);
};
