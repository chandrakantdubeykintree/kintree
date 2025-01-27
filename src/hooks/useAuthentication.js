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
  api_auth_reset_username,
  api_auth_send_otp_forgot_password,
  api_auth_send_otp_forgot_username,
  api_auth_send_otp_login_register,
  api_auth_verify_otp_forgot_password,
  api_auth_verify_otp_forgot_username,
  api_auth_verify_otp_login_register,
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
  const response = await kintreeApi.get("/user/profile");

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
    },
    onError: (error) => {
      handleApiError(error, "Failed to logout");
    },
  });

  const { data: registrationState } = useQuery({
    queryKey: AUTH_QUERY_KEYS.registrationState,
    queryFn: () => ({
      isRegistrationComplete: false,
      nextStep: null,
      completedStep: null,
      verifiedContact: null,
    }),
    enabled: false, // This query is manually controlled
  });

  // Send OTP for login or register mutation
  const sendOTPLoginRegisterMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_send_otp_login_register,
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
      // Handle registered users
      if (data.data.is_registration_complete === 1) {
        const { login_token, ...userData } = data.data;
        kintreeApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${login_token}`;
        tokenService.setLoginToken(login_token);
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, userData);
        navigate("/foreroom");
      }
      // Handle users in registration process
      else {
        const { complete_registration_token, next_step, completed_step } =
          data.data;
        tokenService.setRegistrationToken(complete_registration_token);
        queryClient.setQueryData(AUTH_QUERY_KEYS.registrationState, {
          isRegistrationComplete: 0,
          nextStep: next_step,
          completedStep: completed_step,
          verifiedContact: credentials.email || credentials.phone_no,
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
    mutationFn: async ({ step, data }) => {
      const token = tokenService.getRegistrationToken();
      if (!token) throw new Error("No registration token found");

      const response = await kintreeApi.post(
        api_auth_register_step.replace(":step", step),
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Final step completed
      if (data.data.is_registration_complete === 1) {
        const { login_token, ...userData } = data.data;
        tokenService.removeRegistrationToken();
        tokenService.setLoginToken(login_token);
        kintreeApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${login_token}`;
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, userData);
        queryClient.removeQueries(AUTH_QUERY_KEYS.registrationState);
        navigate("/foreroom");
      }
      // Move to next step
      else {
        const { complete_registration_token, next_step, completed_step } =
          data.data;
        tokenService.setRegistrationToken(complete_registration_token);
        queryClient.setQueryData(AUTH_QUERY_KEYS.registrationState, (prev) => ({
          ...prev,
          nextStep: next_step,
          completedStep: completed_step,
        }));
        navigate("/register/step/" + next_step);
      }
      toast.success(data.message);
    },
    onError: (error) => {
      handleApiError(error, "Failed to register");
    },
  });

  // Forgot password mutation
  const sendOTPForgotPasswordMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await kintreeApi.post(
        api_auth_send_otp_forgot_password,
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
      const response = await kintreeApi.post(
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

  const resetUsernameMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await kintreeApi.post(api_auth_reset_username, userData);
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
      handleApiError(error, "Failed to reset username");
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
    resetUsername: resetUsernameMutation.mutateAsync,
  };
};
