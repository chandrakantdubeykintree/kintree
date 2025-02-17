import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { tokenService } from "../services/tokenService";

import { toast } from "react-hot-toast";
import Chats from "./Chats";

export default function FlutterChat() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    if (token) {
      // Set the token from the URL
      tokenService.setLoginToken(token);

      // Basic token validation (you can add more complex validation if needed)
      if (tokenService.isLoginTokenValid()) {
        setIsValidToken(true);
      } else {
        toast.error("Invalid or expired token");
        navigate("/"); // Redirect to home or any other page
      }
    } else {
      toast.error("No token provided");
      navigate("/"); // Redirect to home or any other page
    }
  }, [token, navigate]);

  if (!isValidToken) {
    return null; // Or a loading spinner
  }

  return (
    <div className="mx-auto">
      <main className={`max-w-[1370px] mx-auto px-1`}>
        <div className="grid grid-cols-12 gap-4 h-[100vh]">
          <div
            className={`
              col-span-12 
              overflow-y-scroll no_scrollbar relative
            `}
          >
            <Chats />
          </div>
        </div>
      </main>
    </div>
  );
}
