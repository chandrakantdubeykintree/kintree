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
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.current_page < lastPage.data.last_page) {
        return lastPage.data.current_page + 1;
      }
      return undefined;
    },
    enabled: Boolean(searchTerm),
  });
}
