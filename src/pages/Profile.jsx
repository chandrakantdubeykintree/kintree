import ProfileAbout from "@/components/profile-about";
import ProfileGallery from "@/components/profile-gallery";
import ProfileMembers from "@/components/profile-members";
import AsyncComponent from "@/components/async-component";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { api_user_profile } from "@/constants/apiEndpoints";
import { getInitials } from "@/utils/stringFormat";
import { Card } from "@/components/ui/card";

export default function Profile() {
  const { profile: user, isProfileLoading } = useProfile("/user/profile");

  const [activeTab, setActiveTab] = useState("about");
  function renderTabContent() {
    switch (activeTab) {
      case "about":
        return <ProfileAbout />;
      case "gallery":
        return <ProfileGallery />;
      case "members":
        return <ProfileMembers />;
      default:
        return <ProfileAbout />;
    }
  }
  return (
    <AsyncComponent>
      <Card className="w-full shadow-sm border-0 rounded-2xl h-full overflow-y-scroll no_scrollbar">
        <div
          className="relative w-full h-[120px] md:h-[150px] lg:h-[200px] bg-cover bg-center rounded-t-2xl"
          style={{
            backgroundImage: `url(${
              user?.basic_info?.profile_cover_pic_url ||
              "/illustrations/illustration_bg.png"
            })`,
          }}
        >
          {/* Profile Image */}
          <Avatar className="absolute left-0 bottom-0 transform translate-x-1/2 translate-y-1/2 w-24 h-24 border-4 border-white">
            <AvatarImage
              src={user?.basic_info?.profile_pic_url}
              alt="Profile"
            />
            <AvatarFallback className="text-2xl">
              {getInitials(user?.basic_info?.first_name) +
                " " +
                getInitials(user?.basic_info?.last_name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid gap-4 grid-cols-1 mt-16 mb-4 px-4">
          <div className="flex justify-start h-[54px] gap-2 border-b relative">
            <div
              className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-4 ${
                activeTab === "about"
                  ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                  : ""
              }`}
              onClick={() => setActiveTab("about")}
            >
              About
            </div>
            <div
              className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-4 ${
                activeTab === "gallery"
                  ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                  : ""
              }`}
              onClick={() => setActiveTab("gallery")}
            >
              Gallery
            </div>
            <div
              className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-4 ${
                activeTab === "members"
                  ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                  : ""
              }`}
              onClick={() => setActiveTab("members")}
            >
              Members
            </div>
          </div>
          {renderTabContent()}
        </div>
      </Card>
    </AsyncComponent>
  );
}
