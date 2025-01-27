import { NavLink } from "react-router";
import ThemeToggle from "./theme-toggle";
import ProfileDropDown from "./profile-dropdown";
import NotificationDropDown from "./notification-dropdown";
import LanguagesDropDown from "./languages-dropdown";
import { ICON_KINTREELOGO, ICON_KINTREELOGO_DARK } from "../constants/iconUrls";

import { useWindowSize } from "@/hooks/useWindowSize";
import { capitalizeName } from "@/utils/stringFormat";
import { useProfile } from "@/hooks/useProfile";
import AsyncComponent from "./async-component";
import { api_user_profile } from "@/constants/apiEndpoints";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { route_foreroom } from "@/constants/routeEnpoints";

export default function Navbar() {
  const { theme } = useThemeLanguage();
  const { width } = useWindowSize();
  const { profile: user, isProfileLoading } = useProfile(api_user_profile);
  const notifications = [
    {
      title: "Your call has been confirmed.",
      description: "1 hour ago",
    },
    {
      title: "You have a new message!",
      description: "1 hour ago",
    },
    {
      title: "Your subscription is expiring soon!",
      description: "2 hours ago",
    },
  ];
  return (
    <AsyncComponent isLoading={isProfileLoading}>
      <div className="h-[84px] flex justify-between items-center">
        <NavLink className="ml-2 lg:ml-4" to={route_foreroom}>
          <img
            src={theme === "light" ? ICON_KINTREELOGO : ICON_KINTREELOGO_DARK}
            alt="logo"
            className="w-[60px] h-12 transform transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </NavLink>
        <div className="flex items-center gap-3 md:gap-3 lg:gap-4 mr-2 lg:mr-4">
          <LanguagesDropDown />
          <ThemeToggle />
          <NotificationDropDown notifications={notifications} />
          {width > 768 ? (
            <>
              <div className="line-clamp-1 overflow-hidden max-w-40 md:max-w-full">
                {capitalizeName(user?.basic_info?.first_name) +
                  " " +
                  capitalizeName(user?.basic_info?.last_name) || "username"}
              </div>
            </>
          ) : null}
          <ProfileDropDown />
        </div>
      </div>
    </AsyncComponent>
  );
}
