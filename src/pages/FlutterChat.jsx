import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { tokenService } from "../services/tokenService";
import { toast } from "react-hot-toast";
import FlutterChats from "./FlutterChats";

export default function FlutterChat() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const isFlutterWebView = true;

    // Enhanced CSS for WebView scrolling
    const style = document.createElement("style");
    style.setAttribute("data-flutter-webview", "true");
    style.textContent = `
        html, body {
          height: 100% !important;
          width: 100% !important;
          overflow: auto !important;
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: contain !important;
          position: fixed !important;
        }
        #root {
          height: 100% !important;
          width: 100% !important;
          overflow: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
        .messages-container {
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: contain !important;
          overflow-y: scroll !important;
          flex: 1 1 auto !important;
        }
      `;
    document.head.appendChild(style);

    // Prevent bounce effect on iOS
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    // Enable momentum scrolling
    document.addEventListener(
      "touchmove",
      (e) => {
        if (e.target.closest(".messages-container")) {
          e.stopPropagation();
        }
      },
      { passive: false }
    );

    if (token) {
      tokenService.setLoginToken(token);
      if (tokenService.isLoginTokenValid()) {
        // Additional scroll fixes for Flutter WebView
        document.body.style.overflow = "auto";
        document.body.style.webkitOverflowScrolling = "touch";
        document.documentElement.style.overflow = "auto";
        document.documentElement.style.webkitOverflowScrolling = "touch";
      } else {
        toast.error("Invalid or expired token");
        navigate("/");
      }
    } else {
      toast.error("No token provided");
      navigate("/");
    }

    return () => {
      if (isFlutterWebView) {
        // Clean up injected styles
        const style = document.querySelector("style[data-flutter-webview]");
        if (style) {
          style.remove();
        }
        // Reset touch-action
        document.body.style.touchAction = "";
        document.documentElement.style.touchAction = "";
      }
    };
  }, [token, navigate]);

  return (
    <div style={{ height: "100vh" }}>
      <FlutterChats />
    </div>
  );
}
