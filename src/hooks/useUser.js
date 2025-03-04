import { kintreeApi } from "@/services/kintreeApi";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";

export function useSendOTPVerifyUser() {
  return useMutation({
    mutationFn: async ({ contact, type }) => {
      const response = await kintreeApi.post("/user/send-otp/verify-user", {
        contact,
        type,
      });
      return response.data;
    },
  });
}

export function useVerifyOTPVerifyUser() {
  return useMutation({
    mutationFn: async ({ contact, otp }) => {
      const response = await kintreeApi.post("/user/verify-otp/verify-user", {
        contact,
        otp,
      });
      return response.data;
    },
  });
}

export function useSearchUser(searchTerm, limit = 10) {
  return useInfiniteQuery({
    queryKey: ["search-user", searchTerm, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await kintreeApi.get(
        `/search-users?q=${searchTerm}&limit=${limit}&page=${pageParam}`
      );
      // Return both the data and pagination info
      return {
        users: response.data.data.users,
        pagination: {
          currentPage: response.data.data.current_page,
          lastPage: response.data.data.last_page,
          totalRecords: response.data.data.total_record,
          filteredRecords: response.data.data.filtered_record,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage >= lastPage.pagination.lastPage) {
        return undefined;
      }
      return lastPage.pagination.currentPage + 1;
    },
    enabled: Boolean(searchTerm?.trim()),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 5 minutes
  });
}
