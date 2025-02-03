import AsyncComponent from "@/components/async-component";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import VerifyUserForm from "@/components/verify-user-form";
import PDFViewer from "@/components/will/PDFVIewer";
import { useWill } from "@/hooks/useWill";
import { useState } from "react";

export default function ViewWill() {
  const { willUrl } = "https://kintree.com/will/1234567890";
  const [isVerified, setIsVerified] = useState(false);
  const { generateWill, isGeneratingWill, willData } = useWill();

  return (
    <AsyncComponent>
      <Card className="w-full mx-auto overflow-y-scroll no_scrollbar h-full flex flex-col items-center">
        {!isVerified ? (
          <CardHeader>
            <CardTitle className="text-center">View Will</CardTitle>
            <CardDescription className="text-center">
              Verify your email/phone number to view the will
            </CardDescription>
          </CardHeader>
        ) : (
          <CardHeader>
            <CardTitle className="text-center">View Will</CardTitle>
          </CardHeader>
        )}
        <CardContent className="w-full flex justify-center">
          {isVerified ? (
            <PDFViewer url={willUrl} />
          ) : (
            <VerifyUserForm setIsVerified={setIsVerified} />
          )}
        </CardContent>
      </Card>
    </AsyncComponent>
  );
}
