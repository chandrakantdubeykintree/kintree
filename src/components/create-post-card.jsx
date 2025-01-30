import { ICON_EVENTS, ICON_PHOTO, ICON_POLL } from "@/constants/iconUrls";
import { NavLink, useNavigate } from "react-router";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import AsyncComponent from "./async-component";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  route_create_poll,
  route_create_post,
  route_events,
  route_events_create_event,
} from "@/constants/routeEnpoints";

export default function CreatePostCard({ user }) {
  const navigate = useNavigate();

  return (
    <AsyncComponent>
      <Card className="rounded-2xl">
        <CardContent className="flex flex-col sm:flex-row gap-3 px-4 py-6">
          <div className="flex flex-row gap-3 flex-grow">
            <div tabIndex={0} role="button" className="w-10 rounded-full">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-125 border">
                <Avatar className="items-center justify-center">
                  <AvatarImage src={user?.profile_pic_url} />
                  <AvatarFallback>{user?.userInitials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <Input
              type="text"
              placeholder="What's on your mind?"
              className="boder rounded-full shadow-none h-10 px-4 flex-grow"
              onClick={() => navigate(route_create_post)}
            />
          </div>
          <div className="flex flex-row items-center gap-3 justify-around w-full sm:w-auto mt-2 sm:mt-0">
            <NavLink to={`${route_create_post}/post`}>
              <img
                src={ICON_PHOTO}
                className="transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer"
              />
            </NavLink>
            <NavLink to={route_events_create_event}>
              <img
                src={ICON_EVENTS}
                className="transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer hover:opacity-100"
              />
            </NavLink>
            <NavLink to={route_create_poll}>
              <img
                src={ICON_POLL}
                className="transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer"
              />
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </AsyncComponent>
  );
}
