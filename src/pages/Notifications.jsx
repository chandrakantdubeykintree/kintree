import { useNotifications } from "@/hooks/useNotifications";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { formatTimeAgo } from "@/utils/stringFormat";
import { Card } from "@/components/ui/card";

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const {
    notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    markAsRead,
    markAsUnread,
    deleteNotification,
    isMarkingAsRead,
    isMarkingAsUnread,
    isDeleting,
  } = useNotifications(10);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.readed_at) {
      markAsRead(notification.id, {
        onError: () => {
          toast.error("Failed to mark notification as read");
        },
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;

    try {
      await deleteNotification(selectedNotification.id);
      setSelectedNotification(null);
      toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleToggleRead = async () => {
    if (!selectedNotification) return;

    try {
      if (selectedNotification.readed_at) {
        await markAsUnread(selectedNotification.id);
        toast.success("Marked as unread");
      } else {
        await markAsRead(selectedNotification.id);
        toast.success("Marked as read");
      }
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const NotificationCard = ({ notification }) => {
    const { notification_data, readed_at, type } = notification;
    const { notified_by, message } = notification_data;

    return (
      <div
        onClick={() => handleNotificationClick(notification)}
        className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
          !readed_at ? "bg-blue-50" : "bg-white"
        }`}
      >
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notified_by.profile_pic_url} />
            <AvatarFallback>
              {notified_by.first_name.charAt(0)}
              {notified_by.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className={`text-sm ${!readed_at ? "font-semibold" : ""}`}>
              {message}
            </p>
            {/* <p className="text-xs text-gray-500 mt-1">
              {formatTimeAgo(notification.created_at, {
                addSuffix: true,
              })}
            </p> */}
            <p className="text-xs text-gray-500 mt-1">
              @{notified_by.username}
            </p>
          </div>
          {!readed_at && (
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="container max-w-2xl mx-auto py-8 px-4 rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}

        {hasNextPage && (
          <div ref={ref} className="flex justify-center p-4">
            {isFetchingNextPage ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Button variant="ghost" onClick={() => fetchNextPage()}>
                Load more
              </Button>
            )}
          </div>
        )}

        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notifications yet
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedNotification}
        onOpenChange={() => setSelectedNotification(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notification</DialogTitle>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      selectedNotification.notification_data.notified_by
                        .profile_pic_url
                    }
                  />
                  <AvatarFallback>
                    {selectedNotification.notification_data.notified_by.first_name.charAt(
                      0
                    )}
                    {selectedNotification.notification_data.notified_by.last_name.charAt(
                      0
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedNotification.notification_data.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    @
                    {
                      selectedNotification.notification_data.notified_by
                        .username
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleToggleRead}
                  disabled={isMarkingAsRead || isMarkingAsUnread}
                  className="rounded-full"
                >
                  {isMarkingAsRead || isMarkingAsUnread ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selectedNotification.readed_at ? (
                    "Mark as unread"
                  ) : (
                    "Mark as read"
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-full"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
