import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tokenService } from "../services/tokenService";
import { useAuth } from "../context/AuthProvider";
import GlobalSpinner from "./global-spinner";

export default function WebViewAuth() {
  const navigate = useNavigate();
  const { fetchUserProfile } = useAuth();

  useEffect(() => {
    const handleWebViewAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");

      if (tokenFromUrl) {
        tokenService.setLoginToken(tokenFromUrl);
        await fetchUserProfile();
        navigate("/chats", { replace: true });
      }
    };

    handleWebViewAuth();
  }, []);

  return <GlobalSpinner />;
}
