import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AsyncComponent from "./async-component";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function ShareInviteDialog({ isOpen, onClose, memberDetails }) {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);

      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <AsyncComponent>
      <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
        <DialogContent className="max-w-[305px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Share Invite</DialogTitle>
            <DialogDescription className="text-center">
              Share details with your members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="username"
                  value={memberDetails?.username}
                  className="pr-10"
                  readOnly
                />
                <button
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors ${
                    copiedField === "username"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                  onClick={() =>
                    handleCopy(memberDetails?.username, "username")
                  }
                  title="Copy username"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="password"
                  value={memberDetails?.password}
                  className="pr-10"
                  readOnly
                />
                <button
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors ${
                    copiedField === "password"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                  onClick={() =>
                    handleCopy(memberDetails?.password, "password")
                  }
                  title="Copy password"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              className="w-full mt-2 bg-brandPrimary text-white py-2 px-4 rounded-md hover:bg-brandPrimary/90 transition-colors"
              onClick={() =>
                handleCopy(
                  `Username: ${memberDetails?.username}\nPassword: ${memberDetails?.password}`,
                  "both"
                )
              }
            >
              Copy Both
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AsyncComponent>
  );
}
