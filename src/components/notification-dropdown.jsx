import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ICON_NOTIFICATION } from "@/constants/iconUrls";
import { CardDescription, CardTitle } from "./ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export default function NotificationDropDown() {
  const { notifications, unreadCount, isLoading, markAsRead } =
    useNotifications(10); // Limit to 5 notifications

  const handleNotificationClick = (notification) => {
    if (!notification.readed_at) {
      markAsRead(notification.id);
    }
  };

  const NotificationItem = ({ notification }) => {
    const { notification_data, readed_at } = notification;
    const { notified_by, message } = notification_data;

    return (
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex items-start gap-3 py-2 w-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={notified_by.profile_pic_url} />
            <AvatarFallback>
              {notified_by.first_name.charAt(0)}
              {notified_by.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className={`text-sm ${!readed_at ? "font-semibold" : ""}`}>
              {message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              @{notified_by.username}
            </p>
          </div>
          {!readed_at && (
            <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
          )}
        </div>
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative">
        <div className="relative cursor-pointer">
          <img
            src={ICON_NOTIFICATION}
            className="w-6 h-6 transform transition-transform duration-300 ease-in-out hover:scale-125"
            alt="Notifications"
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-xs font-bold text-white flex items-center justify-center bg-red-500 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[275px]" align="end">
        <div className="p-4">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            You have {unreadCount} unread notification{unreadCount !== 1 && "s"}
          </CardDescription>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-[400px] overflow-y-auto no_scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <NavLink
            to="/notifications"
            className="w-full text-center py-2 text-sm text-primary hover:text-primary/80 cursor-pointer font-semibold"
          >
            View all notifications
          </NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
