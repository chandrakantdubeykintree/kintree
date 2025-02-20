import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function EarnKincoins() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-0">
        <CardContent className="border-0 rounded-2xl p-4 flex items-center justify-between gap-4 bg-[#f8fafc] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-background">
              <img
                src="/kincoins/add-member.png"
                className="h-10 w-[40px]"
                alt={t("add_member_icon")}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">{t("add_family_member")}</h2>
              <p className="text-sm font-medium text-[#8A8A8A]">
                {t("earn_kincoins_add_member")}
              </p>
            </div>
          </div>
          <div className="justify-self-end">
            <Button
              className="rounded-full px-8"
              onClick={() => navigate("/familytree")}
            >
              {t("add")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0">
        <CardContent className="border-0 rounded-2xl p-4 flex items-center justify-between gap-4 bg-[#f8fafc] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-background">
              <img
                src="/kincoins/post.png"
                className="h-10 w-[40px]"
                alt={t("post_icon")}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">{t("post_on_foreroom")}</h2>
              <p className="text-sm font-medium text-[#8A8A8A]">
                {t("earn_kincoins_daily_post")}
              </p>
            </div>
          </div>
          <div className="justify-self-end">
            <Button
              className="rounded-full px-8"
              onClick={() => navigate("/foreroom")}
            >
              {t("add")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0">
        <CardContent className="border-0 rounded-2xl p-4 flex items-center justify-between gap-4 bg-[#f8fafc] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-background">
              <img
                src="/kincoins/refer.png"
                className="h-10 w-[40px]"
                alt={t("refer_icon")}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">{t("refer_friend")}</h2>
              <p className="text-sm font-medium text-[#8A8A8A]">
                {t("earn_kincoins_refer")}
              </p>
            </div>
          </div>
          <div className="justify-self-end">
            <Button
              className="rounded-full px-8"
              onClick={() => navigate("/profile")}
            >
              {t("add")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0">
        <CardContent className="border-0 rounded-2xl p-4 flex items-center justify-between gap-4 bg-[#f8fafc] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-background">
              <img
                src="/kincoins/complete-profile.png"
                className="h-10 w-[40px]"
                alt={t("complete_profile_icon")}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">{t("complete_profile")}</h2>
              <p className="text-sm font-medium text-[#8A8A8A]">
                {t("earn_kincoins_complete_profile")}
              </p>
            </div>
          </div>
          <div className="justify-self-end">
            <Button
              className="rounded-full px-8"
              onClick={() => navigate("/profile")}
            >
              {t("add")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
