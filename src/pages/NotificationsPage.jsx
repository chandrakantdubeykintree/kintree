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
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useMergeRequests } from "@/hooks/useMergeTree";
import AsyncComponent from "@/components/async-component";
import { CustomTabs, CustomTabPanel } from "@/components/ui/custom-tabs";

export default function NotificationsPage() {
  const { t } = useTranslation();

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
  const { data: mergeRequests, isLoading: isMergeRequestsLoading } =
    useMergeRequests();

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
          toast.error("error marking notification read");
        },
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;

    try {
      await deleteNotification(selectedNotification.id);
      setSelectedNotification(null);
      toast.success(t("notification_deleted_successfully"));
    } catch (error) {
      toast.error(t("failed_to_delete_notification"));
    }
  };

  const handleToggleRead = async () => {
    if (!selectedNotification) return;

    try {
      if (selectedNotification.readed_at) {
        await markAsUnread(selectedNotification.id);
        toast.success(t("marked_as_unread"));
      } else {
        await markAsRead(selectedNotification.id);
        toast.success(t("marked_as_read"));
      }
    } catch (error) {
      toast.error(t("failed_to_update_notification"));
    }
  };

  const [activeTab, setActiveTab] = useState("notifications");

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.readed_at).length;
  };

  const getMergeRequestsCount = () => {
    return mergeRequests?.pages?.[0]?.data?.length || 0;
  };

  // const formatDate = (dateString) => {
  //   const [datePart, timePart] = dateString.split(" ");
  //   const [day, month, year] = datePart.split("-");
  //   return new Date(`${year}-${month}-${day}T${timePart}`).toLocaleString(
  //     "en-US",
  //     {
  //       day: "numeric",
  //       month: "short",
  //       year: "numeric",
  //       hour: "numeric",
  //       minute: "numeric",
  //     }
  //   );
  // };

  const formatDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    return new Date(`${year}-${month}-${day}T${timePart}`).toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const MergeRequestCard = ({ mergeRequest }) => {
    return (
      <div className="p-3 md:p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 bg-orange-50/80 dark:bg-orange-900/20">
        <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
          {/* Avatar Section */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={mergeRequest.requested_by?.profile_pic_url} />
            <AvatarFallback>
              {mergeRequest.requested_by?.first_name?.charAt(0) || "U"}
              {mergeRequest.requested_by?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Content Section */}
          <div className="flex-1 space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {mergeRequest.requested_by?.first_name}{" "}
                {mergeRequest.requested_by?.last_name}{" "}
                <span className="font-normal">
                  wants to merge their family tree as{" "}
                </span>
                <span className="text-primary font-semibold">
                  {mergeRequest.type?.name}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{mergeRequest.requested_by?.username}
              </p>
            </div>

            {/* Tree Info */}
            <div className="flex flex-col gap-1.5">
              <div className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Sender Tree:</span>{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  {mergeRequest.senderRelatives.length} members
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Your Tree:</span>{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  {mergeRequest.receiverRelatives.length} members
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 px-4 text-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle reject
                }}
              >
                Decline
              </Button>
              <Button
                size="sm"
                className="rounded-full h-8 px-4 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle accept
                }}
              >
                Accept
              </Button>
            </div>
          </div>

          {/* Date - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatDate(mergeRequest.created_at)}
          </div>

          {/* Date - Shown on mobile, hidden on larger screens */}
          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-2">
            {formatDate(mergeRequest.created_at)}
          </div>
        </div>
      </div>
    );
  };

  const NotificationCard = ({ notification }) => {
    const { notification_data, readed_at, type } = notification;
    const { notified_by, message } = notification_data;

    return (
      <div
        onClick={() => notified_by && handleNotificationClick(notification)}
        className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
          !readed_at ? "bg-blue-50" : "bg-white"
        }`}
      >
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notified_by?.profile_pic_url} />
            <AvatarFallback>
              {notified_by?.first_name?.charAt(0) || "U"}
              {notified_by?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className={`text-sm ${!readed_at ? "font-semibold" : ""}`}>
              {message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              @{notified_by?.username}
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
    <AsyncComponent>
      <Card className="container max-w-2xl mx-auto py-8 px-4 rounded-2xl h-full">
        <h1 className="text-2xl font-bold mb-6">{t("notifications")}</h1>

        <CustomTabs
          tabs={[
            {
              label: t("notifications"),
              value: "notifications",
              count: getUnreadCount(),
            },
            {
              label: t("merge_requests"),
              value: "merge-requests",
              count: getMergeRequestsCount(),
            },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <CustomTabPanel value="notifications" activeTab={activeTab}>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}

            {hasNextPage && (
              <div ref={ref} className="flex justify-center p-4">
                {isFetchingNextPage ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Button variant="ghost" onClick={() => fetchNextPage()}>
                    {t("load_more")}
                  </Button>
                )}
              </div>
            )}

            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {t("no_notifications")}
              </div>
            )}
          </div>
        </CustomTabPanel>

        <CustomTabPanel value="merge-requests" activeTab={activeTab}>
          <div className="space-y-2">
            {!isMergeRequestsLoading &&
            mergeRequests?.pages?.[0]?.data?.length > 0 ? (
              mergeRequests.pages.map((page) =>
                page.data.map((request) => (
                  <MergeRequestCard key={request.id} mergeRequest={request} />
                ))
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                {isMergeRequestsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  t("no_merge_requests")
                )}
              </div>
            )}
          </div>
        </CustomTabPanel>
      </Card>
      <Dialog
        open={!!selectedNotification}
        onOpenChange={() => setSelectedNotification(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("notification")}</DialogTitle>
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
                    t("mark_as_unread")
                  ) : (
                    t("mark_as_read")
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
                    t("delete")
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AsyncComponent>
  );
}
