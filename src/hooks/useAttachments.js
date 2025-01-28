import { kintreeApi } from "@/services/kintreeApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const QUERY_KEYS = {
  ATTACHMENTS: "attachments",
};

const uploadAttachment = async (formData) => {
  try {
    const response = await kintreeApi.post("/attachments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to upload file";
    toast.error(message);
    return Promise.reject(error);
  }
};

const deleteAttachment = async (attachmentId) => {
  try {
    const response = await kintreeApi.delete(`/attachments/${attachmentId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to delete attachment";
    toast.error(message);
    return Promise.reject(error);
  }
};

const fetchAttachment = async (attachmentId) => {
  try {
    const response = await kintreeApi.get(`/attachments/${attachmentId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch attachment";
    toast.error(message);
    return Promise.reject(error);
  }
};

const fetchAllAttachments = async () => {
  try {
    const response = await kintreeApi.get("/attachments");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch attachments";
    toast.error(message);
    return Promise.reject(error);
  }
};

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAttachment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTACHMENTS] });
      return data;
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTACHMENTS] });
      toast.success("Attachment deleted successfully");
    },
  });
};

export const useAttachment = (attachmentId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATTACHMENTS, attachmentId],
    queryFn: () => fetchAttachment(attachmentId),
    enabled: Boolean(attachmentId),
  });
};

export const useAttachments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATTACHMENTS],
    queryFn: fetchAllAttachments,
  });
};
