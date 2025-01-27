import { createContext, useContext, useState, useEffect } from "react";
import { kintreeApi } from "../services/kintreeApi";

import { tokenService } from "../services/tokenService";
import { getErrorMessage, determineErrorType } from "../services/errorHandling";
import {
  api_auth_login,
  api_auth_send_otp_login_register,
  api_auth_verify_otp_login_register,
} from "../constants/apiEndpoints";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrationState, setRegistrationState] = useState({
    isRegistrationComplete: null,
    nextStep: null,
    completedStep: null,
    verifiedContact: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const success = await fetchUserProfile();
        if (!success) {
          handleLogout();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchUserProfile = async (url = "/user/profile") => {
    try {
      const token =
        url === "/user/profile"
          ? tokenService.getLoginToken()
          : tokenService.getRegistrationToken();
      if (token && tokenService.isLoginTokenValid()) {
        kintreeApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await kintreeApi.get(url);

        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      handleLogout();
      return false;
    }
  };

  const handleSendOtp = async (credentials) => {
    try {
      const response = await kintreeApi.post(
        api_auth_send_otp_login_register,
        credentials
      );
      if (response.data.status) {
        toast.success(response.data.message);
        return { success: true };
      }
      toast.error(response.data.message);
      return { success: false, error: response.data.message };
    } catch (error) {
      const errorType = determineErrorType(error);
      toast.error(getErrorMessage(errorType));
      return { success: false, error: getErrorMessage(errorType) };
    }
  };

  const handleVerifyOTP = async (credentials) => {
    try {
      const response = await kintreeApi.post(
        api_auth_verify_otp_login_register,
        credentials
      );

      if (response.data.success) {
        // For registered users
        if (response.data.data.is_registration_complete === 1) {
          const { login_token, ...userData } = response.data.data;
          kintreeApi.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${login_token}`;
          tokenService.setLoginToken(login_token, true);
          // setUser(userData);
          await fetchUserProfile();
          setIsAuthenticated(true);
          clearRegistrationState();
          toast.success(response.data.message);
          return { success: true, isRegistered: true };
        }
        // For non-registered users
        else {
          const { complete_registration_token, next_step, completed_step } =
            response.data.data;
          setRegistrationState({
            isRegistrationComplete: 0,
            nextStep: next_step,
            completedStep: completed_step,
            verifiedContact: credentials.email || credentials.phone_no,
          });
          tokenService.setRegistrationToken(complete_registration_token);
          await fetchUserProfile("/user");
          toast.success(response.data.message);
          return { success: true, isRegistered: false };
        }
      }

      toast.error(response.data.message);
      return { success: false, error: response.data.message };
    } catch (error) {
      const errorType = determineErrorType(error);
      toast.error(getErrorMessage(errorType));
      return { success: false, error: getErrorMessage(errorType) };
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const response = await kintreeApi.post(api_auth_login, credentials);
      if (response?.data?.success) {
        const { login_token, ...userData } = response.data.data;
        kintreeApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${login_token}`;
        tokenService.setLoginToken(login_token, true);
        setUser(userData);
        await fetchUserProfile();
        setIsAuthenticated(true);
        clearRegistrationState();
        toast.success(response.data.message);
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      const errorType = determineErrorType(error);
      toast.error(getErrorMessage(errorType));
      return { success: false, error: getErrorMessage(errorType) };
    } finally {
      setLoading(false);
    }
  };

  const submitRegistrationStep = async (stepData) => {
    try {
      let response;
      if (stepData.step === 4 && stepData.profile_image) {
        const formData = new FormData();
        formData.append("step", stepData.step);
        if (stepData.profile_image instanceof File) {
          formData.append("profile_image", stepData.profile_image);
        } else {
          formData.append(
            "preseted_profile_image_id",
            stepData.preseted_profile_image_id || 1
          );
        }

        response = await kintreeApi.post(
          `/registration/step/${stepData?.step}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${tokenService.getRegistrationToken()}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await kintreeApi.post(
          `/registration/step/${stepData?.step}`,
          stepData,
          {
            headers: {
              Authorization: `Bearer ${tokenService.getRegistrationToken()}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.success) {
        if (response.data.data.is_registration_complete === 1) {
          const { login_token, ...userData } = response.data.data;
          tokenService.setLoginToken(login_token);
          setUser(userData);
          await fetchUserProfile();
          setIsAuthenticated(true);
          clearRegistrationState();
          return { success: true, isCompleted: true };
        } else {
          setRegistrationState((prev) => ({
            ...prev,
            nextStep: response.data.data.next_step,
            completedStep: response.data.data.completed_step,
          }));
          return { success: true, isCompleted: false };
        }
      }
      toast.error(response.data.message);
      return { success: false, error: response.data.message };
    } catch (error) {
      const errorType = determineErrorType(error);
      return { success: false, error: getErrorMessage(errorType) };
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearRegistrationState();
    tokenService.removeAllTokens();
  };

  const clearRegistrationState = () => {
    setRegistrationState({
      isRegistrationComplete: null,
      nextStep: null,
      completedStep: null,
      verifiedContact: null,
    });
    tokenService.removeRegistrationToken();
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        registrationState,
        handleLogin,
        handleSendOtp,
        handleVerifyOTP,
        submitRegistrationStep,
        handleLogout,
        clearRegistrationState,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
