import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import AsyncComponent from "./async-component";
import { capitalizeName, getInitials } from "@/utils/stringFormat";
import { ICON_EDIT2 } from "@/constants/iconUrls";
import { useProfile } from "@/hooks/useProfile";

const ProfileCard = () => {
  const { profile: user, isProfileLoading } = useProfile("/user/profile");

  return (
    <AsyncComponent isLoading={isProfileLoading}>
      <Card className="w-full max-w-sm mx-auto shadow-sm p-4 border-0 rounded-2xl overflow-hidden">
        <div
          className="relative w-full h-32 bg-cover bg-center rounded-2xl"
          style={{
            backgroundImage: `url(${
              user?.basic_info?.profile_cover_pic_url ||
              "/illustrations/illustration_bg.png"
            })`,
          }}
        >
          <Avatar className="cursor-pointer absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 w-20 h-20 rounded-full border-2 border-brandPrimary transition-transform duration-300 ease-in-out hover:scale-105 bg-background">
            <AvatarImage src={user?.profile_pic_url} alt="@shadcn" />
            <AvatarFallback className="w-20 h-20 rounded-full text-2xl font-normal text-center">
              {getInitials(user?.basic_info?.first_name) +
                " " +
                getInitials(user?.basic_info?.last_name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <CardContent className="px-0 pt-8 pb-0">
          <CardTitle className="text-xl font-semibold text-center">
            {capitalizeName(user?.basic_info?.first_name) +
              " " +
              capitalizeName(user?.basic_info?.last_name) || "username"}
          </CardTitle>
          <CardTitle className="text-sm font-normal text-center">
            @{user?.username || "username"}
          </CardTitle>
          <hr className="my-4 h-[1.5px]" />
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <span className="font-medium">Posts</span>
              <span className="">{user?.post_count || 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">Event</span>
              <span className="">{user?.event_count || 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">Members</span>
              <span className="">{user?.family_member_count || 0}</span>
            </div>
          </div>
          {/* <hr className="my-4 h-[1.5px]" /> */}
        </CardContent>

        <CardFooter className="px-6 pb-8 flex flex-col items-start gap-3 hidden">
          <div className="text-lg font-semibold flex justify-between items-center w-full">
            <span>Bio</span>
            <span>
              <img
                src={ICON_EDIT2}
                className="w-4 h-4 transform -translate-x-1/2 translate-y-1/3 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125"
              />
            </span>
          </div>
          <div className="text-sm text-left">
            {user?.basic_info?.bio || "Add your bio here."}
          </div>
        </CardFooter>
      </Card>
    </AsyncComponent>
  );
};

export default ProfileCard;
