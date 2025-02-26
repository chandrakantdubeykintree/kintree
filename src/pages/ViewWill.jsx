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
import { useTranslation } from "react-i18next";

export default function ViewWill() {
  const { willUrl } = "https://kintree.com/will/1234567890";
  const [isVerified, setIsVerified] = useState(false);
  const { generateWill, isGeneratingWill, willData } = useWill();
  const { t } = useTranslation();

  return (
    <AsyncComponent>
      <Card className="w-full mx-auto overflow-y-scroll no_scrollbar h-full flex flex-col items-center">
        {!isVerified ? (
          <CardHeader>
            <CardTitle className="text-center">{t("view_will")}</CardTitle>
            <CardDescription className="text-center">
              {t("verify_email_phone_number")}
            </CardDescription>
          </CardHeader>
        ) : (
          <CardHeader>
            <CardTitle className="text-center">{t("view_will")}</CardTitle>
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
