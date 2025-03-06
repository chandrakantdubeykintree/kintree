import {
  api_family_tree,
  api_family_tree_members,
} from "@/constants/apiEndpoints";
import { kintreeApi } from "@/services/kintreeApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

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

export const deleteMember = async (memberId) => {
  const response = await kintreeApi.delete(
    `${api_family_tree_members}/${memberId}`
  );
  if (!response.data.success) {
    return handleApiError(response);
  }
  return response.data.data;
};

export const addFamilyMember = async (memberData) => {
  const formData = new FormData();

  // Handle profile image if provided and valid
  if (memberData.profile_image && memberData.profile_image instanceof File) {
    formData.append("profile_image", memberData.profile_image);
  }

  // Append other member data, excluding null/undefined values
  Object.entries(memberData).forEach(([key, value]) => {
    if (
      key !== "profile_image" &&
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      formData.append(key, value);
    }
  });

  const response = await kintreeApi.post(
    `${api_family_tree_members}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!response.data.success) {
    return handleApiError(response);
  }
  return response.data.data;
};

export const updateFamilyMember = async (memberData) => {
  const formData = new FormData();

  // // Essential fields that must be included
  // const requiredFields = ["first_name", "last_name", "is_alive", "id"];
  // const optionalFields = [
  //   "middle_name",
  //   "email",
  //   "phone_no",
  //   "age_range",
  //   "native_place",
  // ];

  // // Handle profile image if provided and valid
  // if (memberData.profile_image instanceof File) {
  //   formData.append("profile_image", memberData.profile_image);
  // }

  // // First append all required fields
  // requiredFields.forEach((field) => {
  //   if (memberData[field] !== undefined) {
  //     formData.append(field, memberData[field]);
  //   }
  // });

  // // Then append optional fields if they exist
  // optionalFields.forEach((field) => {
  //   if (
  //     memberData[field] !== undefined &&
  //     memberData[field] !== null &&
  //     memberData[field] !== ""
  //   ) {
  //     formData.append(field, memberData[field]);
  //   }
  // });

  // // For debugging - log the FormData contents
  // for (let pair of formData.entries()) {
  //   console.log(pair[0] + ": " + pair[1]);
  // }

  if (memberData.profile_image && memberData.profile_image instanceof File) {
    formData.append("profile_image", memberData.profile_image);
  }

  // Append other member data, excluding null/undefined values
  Object.entries(memberData).forEach(([key, value]) => {
    if (
      key !== "profile_image" &&
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      formData.append(String(key), value);
    }
  });

  const response = await kintreeApi.put(
    `${api_family_tree_members}/${memberData.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
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
      Object.entries(error.data.errors)?.map((error) =>
        toast.error(error[1][0])
      );
    },
  });
};

export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFamilyMember,
    onSuccess: async (data, variables) => {
      toast.success("Member updated successfully");
      console.log(data, variables);

      // Invalidate family tree data
      try {
        // First invalidate family tree
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.FAMILY],
          refetchType: "all",
          refetchFn: () => fetchFamily(1),
        });

        // Then invalidate individual member data
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER, variables.id],
        });

        // Finally invalidate family members list
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.FAMILY_MEMBERS],
        });
      } catch (error) {
        console.error("Error during query invalidation:", error);
      }
    },
    onError: (error) => {
      Object.entries(error.data.errors)?.map((error) =>
        toast.error(error[1][0])
      );
    },
  });
};

export const useDeleteMember = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      toast.success("Family member deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FAMILY],
        refetchType: "all",
        refetchFn: () => fetchFamily(1),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FAMILY_MEMBERS],
        refetchType: "all",
        refetchFn: () => fetchFamilyMembers(),
      });
      navigate("/familytree");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete member");
    },
  });
};
