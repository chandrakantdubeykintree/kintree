import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kintreeApi } from "../services/kintreeApi";
import { tokenService } from "../services/tokenService";
import { ApiError, handleApiError } from "../services/errorHandling";
import toast from "react-hot-toast";
import {
  api_auth_login_password,
  api_auth_logout,
  api_auth_register_step,
  api_auth_reset_password,
  api_auth_send_otp_forgot_password,
  api_auth_send_otp_forgot_username,
  api_auth_send_otp_login_register,
  api_auth_verify_otp_forgot_password,
  api_auth_verify_otp_forgot_username,
  api_auth_verify_otp_login_register,
  api_user_profile,
} from "../constants/apiEndpoints";
import { useNavigate } from "react-router";

// Query keys
export const AUTH_QUERY_KEYS = {
  user: ["user"],
  profile: ["user", "profile"],
  registrationState: ["registration", "state"],
};

const fetchUserProfile = async () => {
  const token = tokenService.getLoginToken();

  if (!token || !tokenService.isLoginTokenValid()) {
    throw new Error("No valid token found");
  }

  kintreeApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const response = await kintreeApi.get(api_user_profile);

  if (!response.data.success) {
    throw new ApiError(
      response.data.message,
      response.data.status,
      response.data.data
    );
  }

  return response.data.data;
};

export const useAuthentication = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // Query for checking auth status and getting user data
  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: fetchUserProfile,
    retry: false,
    onSuccess: (data) => {
      navigate("/foreroom");
    },
    onError: (error) => {
      handleApiError(error, "Failed to fetch user profile");
      tokenService.removeAllTokens();
      kintreeApi.defaults.headers.common["Authorization"] = null;
      navigate("/login");
    },
  });

  // Login mutation
  const loginPasswordMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_login_password,
        credentials
      );
      if (!response.data.success) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      const { login_token, ...userData } = data.data;
      kintreeApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${login_token}`;
      tokenService.setLoginToken(login_token, data.remember);
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, userData);
      toast.success(data.message);
    },
    onError: (error) => {
      handleApiError(error, "Failed to login");
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await kintreeApi.post(api_auth_logout);
      if (!response.data.success) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }
      return response.data;
    },
    onSuccess: () => {
      tokenService.removeAllTokens();
      kintreeApi.defaults.headers.common["Authorization"] = null;
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, null);
      queryClient.clear();
      toast.success("Logged out successfully");
      window.location.reload();
    },
    onError: (error) => {
      handleApiError(error, "Failed to logout");
    },
  });

  const { data: registrationState } = useQuery({
    queryKey: AUTH_QUERY_KEYS.registrationState,
    queryFn: () => {
      const token = tokenService.getRegistrationToken();
      if (!token) {
        return {
          isRegistrationComplete: false,
          nextStep: 1,
          completedStep: null,
          verifiedContact: null,
        };
      }
      return (
        queryClient.getQueryData(AUTH_QUERY_KEYS.registrationState) || {
          isRegistrationComplete: false,
          nextStep: 1,
          completedStep: null,
          verifiedContact: null,
        }
      );
    },
    initialData: {
      isRegistrationComplete: false,
      nextStep: 1,
      completedStep: null,
      verifiedContact: null,
    },
  });

  // Send OTP for login or register mutation
  const sendOTPLoginRegisterMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_send_otp_login_register,
        credentials
      );
      if (!response.data.status) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const verifyOTPLoginRegisterMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_verify_otp_login_register,
        credentials
      );
      if (!response.data.success) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.is_registration_complete === 1) {
        const { login_token, ...userData } = data.data;
        kintreeApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${login_token}`;
        tokenService.setLoginToken(login_token);
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, userData);
        navigate("/foreroom");
      } else {
        console.log("reached here");
        const { complete_registration_token, next_step, completed_step } =
          data.data;
        tokenService.setRegistrationToken(complete_registration_token);
        queryClient.setQueryData(AUTH_QUERY_KEYS.registrationState, {
          isRegistrationComplete: 0,
          nextStep: next_step,
          completedStep: completed_step,
        });
        navigate("/register/step/" + next_step);
      }
      toast.success(data.message);
    },
    onError: (error) => {
      handleApiError(error, "Failed to verify OTP");
    },
  });

  // Register mutation
  const registerStepMutation = useMutation({
    mutationFn: async (formData) => {
      const token = tokenService.getRegistrationToken();
      if (!token) throw new Error("No registration token found");

      const currentStep = registrationState.nextStep;

      let response;
      if (currentStep === 4 && formData.profile_image) {
        const formDataToSend = new FormData();
        if (formData.profile_image instanceof File) {
          formDataToSend.append("profile_image", formData.profile_image);
        } else {
          formDataToSend.append(
            "preseted_profile_image_id",
            formData.preseted_profile_image_id || 1
          );
        }

        response = await kintreeApi.post(
          `/registration/step/${currentStep}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await kintreeApi.post(
          `/registration/step/${currentStep}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!response.data.success) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }

      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.is_registration_complete === 1) {
        const { login_token, ...userData } = data.data;
        // Set login token first
        tokenService.setLoginToken(login_token);
        // Remove registration token
        tokenService.removeRegistrationToken();
        // Update user data in cache
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, userData);
        // Clear registration state
        queryClient.removeQueries(AUTH_QUERY_KEYS.registrationState);
        // Navigate to foreroom
        navigate("/foreroom", { replace: true });
        return { success: true, isCompleted: true };
      } else {
        const { next_step, completed_step } = data.data;
        queryClient.setQueryData(AUTH_QUERY_KEYS.registrationState, (prev) => ({
          ...prev,
          nextStep: next_step,
          completedStep: completed_step,
        }));
        return { success: true, isCompleted: false };
      }
    },
    onError: (error) => {
      handleApiError(error, "Failed to save registration data");
    },
  });

  // Forgot password mutation
  const sendOTPForgotPasswordMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_send_otp_forgot_password,
        credentials
      );
      if (!response.data.status) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      handleApiError(error, "Failed to send OTP for forgot password");
    },
  });

  const verifyOTPForgotPasswordMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_verify_otp_forgot_password,
        credentials
      );
      if (!response.data.success) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }
      const { token } = response.data.data;
      kintreeApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      tokenService.setResetPasswordToken(token);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      handleApiError(error, "Failed to verify OTP for forgot password");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.put(
        api_auth_reset_password,
        credentials
      );
      if (!response.data.success) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      tokenService.removeResetPasswordToken();
    },
    onError: (error) => {
      handleApiError(error, "Failed to reset password");
    },
  });

  // Forgot username mutation
  const sendOTPForgotUsernameMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_send_otp_forgot_username,
        credentials
      );
      if (!response.data.status) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      handleApiError(error, "Failed to send OTP for forgot username");
    },
  });

  const verifyOTPForgotUsernameMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_verify_otp_forgot_username,
        credentials
      );
      if (!response.data.success) {
        throw new ApiError(
          response.data.message,
          response.data.status,
          response.data.data
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      handleApiError(error, "Failed to verify OTP for forgot username");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    registrationState,
    loginPassword: loginPasswordMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    registerStep: registerStepMutation.mutateAsync,
    sendOTPLoginRegister: sendOTPLoginRegisterMutation.mutateAsync,
    verifyOTPLoginRegister: verifyOTPLoginRegisterMutation.mutateAsync,
    sendOTPForgotPassword: sendOTPForgotPasswordMutation.mutateAsync,
    verifyOTPForgotPassword: verifyOTPForgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    sendOTPForgotUsername: sendOTPForgotUsernameMutation.mutateAsync,
    verifyOTPForgotUsername: verifyOTPForgotUsernameMutation.mutateAsync,
  };
};
