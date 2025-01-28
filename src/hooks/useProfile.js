import { kintreeApi } from "@/services/kintreeApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const apiRequest = async (method, url, data = null) => {
  const response = await kintreeApi({
    method,
    url,
    data,
  });
  return response.data.data;
};

const fetchData = async ({ infoType }) => apiRequest("GET", `${infoType}`);

export const useProfile = (infoType) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile", infoType],
    queryFn: () => fetchData({ infoType }),
    enabled: !!infoType,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ url, data, method = "PUT" }) => {
      const response = await kintreeApi({
        method,
        url,
        data,
      });
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(["profile", infoType]);
      if (response?.data?.success) {
        toast.success(response.data.message);
      } else {
        toast.error(Object.values(response.data.errors).toString());
      }
    },
    onError: (error) => console.error("Error updating profile:", error),
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (userEducationId) => {
      const response = await kintreeApi({
        method: "DELETE",
        url: `/user/educations/${userEducationId}`,
      });
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(["profile", infoType]);
      toast.success(response.data.message);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete education"
      );
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ url, data }) => {
      const response = await kintreeApi({
        method: "POST",
        url,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ["profile"] }); // Invalidate all profile-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] }); // If you have user-related queries

      // Show success message
      const imageType = variables.url.includes("cover") ? "Cover" : "Profile";
      toast.success(`${imageType} image updated successfully`);
    },
    onError: (error) => {
      console.error("Image upload error:", error);
      toast.error(error?.response?.data?.message || "Failed to update image");
    },
  });

  const updateInterestsMutation = useMutation({
    mutationFn: async (data) => {
      const response = await kintreeApi({
        method: "POST",
        url: "/user/store-custom-interests",
        data,
      });
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(["profile", infoType]);
      toast.success(response.data.message);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update interests"
      );
    },
  });

  return {
    profile: data,
    isProfileLoading: isLoading,
    isProfileError: isError,
    profileError: error,
    updateProfile: updateProfileMutation.mutate,
    deleteEducation: deleteEducationMutation.mutate,
    updateImage: updateImageMutation.mutate,
    isUpdating: updateImageMutation.isPending,
    updateError: updateImageMutation.error,
    updateInterests: updateInterestsMutation.mutate,
  };
};
