import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { tokenService } from "../services/tokenService";
import { toast } from "react-hot-toast";
import FlutterChats from "./FlutterChats";

export default function FlutterChat() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if running in Flutter WebView
    const isFlutterWebView = window.ReactNativeWebView !== undefined;

    if (isFlutterWebView) {
      // Inject CSS only for Flutter WebView
      const style = document.createElement("style");
      style.textContent = `
        html, body {
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }
        #root {
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }
      `;
      document.head.appendChild(style);
    }

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
      }
    };
  }, [token, navigate]);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <FlutterChats />
    </div>
  );
}
