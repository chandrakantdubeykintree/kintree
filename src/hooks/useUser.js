import { kintreeApi } from "@/services/kintreeApi";
import { useMutation } from "@tanstack/react-query";

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
