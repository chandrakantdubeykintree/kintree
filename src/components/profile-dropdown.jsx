import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "./ui/sheet";
import { useWindowSize } from "@/hooks/useWindowSize";
import { mainNavLinks, profileMenuItems } from "@/constants/navLinks";
import { NavLink, useLocation, useNavigate } from "react-router";
import { capitalizeName, getInitials } from "@/utils/stringFormat";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { api_user_profile } from "@/constants/apiEndpoints";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function ProfileDropDown() {
  const { width } = useWindowSize();
  const { profile: user } = useProfile(api_user_profile);
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthentication();
  const handleNavLinkClick = () => {
    setIsSheetOpen(false); // Close the sheet
  };

  function handleUserLogout() {
    logout();
    navigate("/login");
  }

  return width > 768 ? (
    <DropdownMenu className="hidden md:block">
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-10 h-10 rounded-full border-2 border-brandPrimary transition-transform duration-300 ease-in-out hover:scale-105">
          <AvatarImage src={user?.profile_pic_url} alt="" />
          <AvatarFallback className="w-10 h-10 rounded-full text-sm font-normal text-center">
            {getInitials(user?.basic_info?.first_name || "") +
              " " +
              getInitials(user?.basic_info?.last_name || "")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        {profileMenuItems.map(({ path, label, icon }) => {
          return (
            <DropdownMenuItem key={path} className="cursor-pointer">
              <NavLink key={path} to={path} className="flex gap-4 items-center">
                <img src={icon} className="h-6 w-6" />
                <span className="text-sm">{label}</span>
              </NavLink>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem className="cursor-pointer">
          <div className="flex gap-4 items-center" onClick={handleUserLogout}>
            <img src="/icons/logout.svg" className="h-6 w-6" />
            <span className="text-sm">Logout</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Sheet
      className={`block md:hidden ${isSheetOpen ? "open" : "closed"}`}
      open={isSheetOpen}
      onOpenChange={setIsSheetOpen}
    >
      <SheetTrigger>
        <Avatar className="cursor-pointer w-10 h-10 rounded-full border-2 border-brandPrimary transition-transform duration-300 ease-in-out hover:scale-105">
          <AvatarImage src={user?.profile_pic_url} alt="" />
          <AvatarFallback className="w-10 h-10 rounded-full text-sm font-normal text-center">
            {getInitials(user?.basic_info?.first_name || "") +
              " " +
              getInitials(user?.basic_info?.last_name || "")}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll no_scrollbar">
        <SheetHeader>
          <SheetTitle className="py-4 flex flex-col gap-2 items-center">
            <Avatar className="cursor-pointer w-16 h-16 rounded-full border-2 border-brandPrimary transition-transform duration-300 ease-in-out hover:scale-105">
              <AvatarImage src={user?.profile_pic_url} alt="" />
              <AvatarFallback className="w-16 h-16 rounded-full text-sm font-normal text-center">
                {getInitials(user?.basic_info?.first_name || "") +
                  " " +
                  getInitials(user?.basic_info?.last_name || "")}
              </AvatarFallback>
            </Avatar>
            <span>
              {capitalizeName(user?.basic_info?.first_name) +
                " " +
                capitalizeName(user?.basic_info?.last_name)}
            </span>
          </SheetTitle>
        </SheetHeader>
        <SheetDescription className="hidden"></SheetDescription>

        <div className="flex flex-col gap-4 overflow-y-scroll h-full">
          {mainNavLinks.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-4 h-12 font-medium pl-2 rounded-xl text-base ${
                location?.pathname === path ? "bg-brandPrimary text-white" : ""
              } hover:bg-brandPrimary`}
              onClick={handleNavLinkClick}
            >
              <img src={icon} className="h-6 w-6" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
          <div
            className={`flex items-center gap-4 h-12 font-medium pl-2 rounded-xl text-base hover:bg-brandPrimary cursor-pointer`}
            onClick={handleUserLogout}
          >
            <img src="/icons/logout.svg" className="h-6 w-6" />
            <span className="text-sm">Logout</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
