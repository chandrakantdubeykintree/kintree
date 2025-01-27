import {
  api_family_tree,
  api_family_tree_members,
} from "@/constants/apiEndpoints";
import { kintreeApi } from "@/services/kintreeApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const QUERY_KEYS = {
  FAMILY: "family",
  MEMBER: "member",
  FAMILY_MEMBERS: "familyMembers",
};

const handleApiError = (error) => {
  const message = error.response?.data?.message || "Something went wrong";
  toast.error(message);
  return Promise.reject(error);
};

export const fetchFamily = async (updated_family_tree = 1) => {
  const response = await kintreeApi.get(api_family_tree, {
    params: { updated_family_tree },
  });

  if (!response.data.success) {
    return handleApiError(response);
  }
  return response.data.data;
};

export const fetchFamilyMembers = async () => {
  const response = await kintreeApi.get(api_family_tree_members);
  if (!response.data.success) {
    return handleApiError(response);
  }

  return response.data.data;
};

export const fetchMemberById = async (userId) => {
  const response = await kintreeApi.get(`/members-profile/${userId}`);
  if (!response.data.success) {
    return handleApiError(response);
  }
  return response.data.data;
};

export const addFamilyMember = async (memberData) => {
  const response = await kintreeApi.post(
    `${api_family_tree_members}`,
    memberData
  );
  if (!response.data.success) {
    return handleApiError(response);
  }
  return response.data.data;
};

export const updateFamilyMember = async (memberData) => {
  const response = await kintreeApi.put(
    `${api_family_tree_members}/${memberData.id}`,
    memberData
  );
  if (!response.data.success) {
    return handleApiError(response);
  }
  return response.data.data;
};

export const useFamily = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FAMILY],
    queryFn: () => fetchFamily(1),
    refetchFn: () => fetchFamily(0),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch family. Please try again later.");
      console.error("Family fetch error:", error);
    },
  });
};

export const useFamilyMembers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FAMILY_MEMBERS],
    queryFn: () => fetchFamilyMembers(),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch family members. Please try again later.");
      console.error("Family fetch error:", error);
    },
  });
};

export const useMember = (memberId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMBER, memberId],
    queryFn: () => fetchMemberById(memberId),
    enabled: Boolean(memberId),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch member details.");
      console.error("Member fetch error:", error);
    },
  });
};

export const useAddFamilyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFamilyMember,
    onSuccess: () => {
      toast.success("Family member added successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FAMILY],
        refetchType: "all",
        refetchFn: () => fetchFamily(1),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to add family member"
      );
    },
  });
};

export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFamilyMember,
    onSuccess: () => {
      toast.success("Family member updated successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FAMILY],
        // queryKey: [QUERY_KEYS.FAMILY_MEMBERS],
        refetchType: "all",
        refetchFn: () => fetchFamily(1),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update family member"
      );
    },
  });
};
