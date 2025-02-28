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
import {
  useMergeRequest,
  useMergeRequests,
  useRespondToMergeRequest,
} from "@/hooks/useMergeTree";
import AsyncComponent from "@/components/async-component";
import { CustomTabs, CustomTabPanel } from "@/components/ui/custom-tabs";
import { capitalizeName } from "@/utils/stringFormat";
import { useCancelMergeRequest } from "@/hooks/useMergeTree";

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

const calculateMyRelativesCount = (mergeRequest) => {
  if (mergeRequest?.is_request_sent)
    return mergeRequest?.sender_relatives_count || 0;
  if (mergeRequest?.is_request_received)
    return mergeRequest?.receiver_relatives_count || 0;
};
const calculateMembersRelativesCount = (mergeRequest) => {
  if (mergeRequest?.is_request_sent)
    return mergeRequest?.receiver_relatives_count || 0;
  if (mergeRequest?.is_request_received)
    return mergeRequest?.sender_relatives_count || 0;
};

const MergeRequestDialog = ({ isOpen, onClose, requestId }) => {
  const { data: mergeRequest, isLoading } = useMergeRequest(requestId, {
    enabled: isOpen,
  });

  const { mutate: respondToRequest, isLoading: isResponding } =
    useRespondToMergeRequest();

  const handleAccept = () => {
    respondToRequest(
      {
        requestId,
        is_accepted: true,
        same_persons: [],
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] sm:max-w-sm rounded-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Merge Request Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : mergeRequest ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mergeRequest.requested_by?.profile_pic_url} />
                <AvatarFallback>
                  {mergeRequest.requested_by?.first_name?.charAt(0)}
                  {mergeRequest.requested_by?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">
                  {mergeRequest.is_request_sent ? (
                    <>
                      You requested to merge family tree with{" "}
                      {capitalizeName(mergeRequest.requested_to?.first_name)}{" "}
                      {capitalizeName(mergeRequest.requested_to?.last_name)}
                    </>
                  ) : (
                    <>
                      {capitalizeName(mergeRequest.requested_by?.first_name)}{" "}
                      {capitalizeName(mergeRequest.requested_by?.last_name)}{" "}
                      wants to merge
                    </>
                  )}
                  &nbsp; as{" "}
                  <span className="text-primary">
                    {mergeRequest.type?.name}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Their Tree Members:</span>
                <span className="font-medium">
                  {calculateMembersRelativesCount(mergeRequest) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Your Tree Members:</span>
                <span className="font-medium">
                  {calculateMyRelativesCount(mergeRequest) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium">
                  {mergeRequest.is_accepted === null
                    ? "Pending"
                    : mergeRequest.is_accepted
                    ? "Accepted"
                    : "Declined"}
                </span>
              </div>
            </div>

            {!mergeRequest.is_request_sent &&
              mergeRequest.is_accepted === null && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAccept}
                    disabled={isResponding}
                    className="rounded-full"
                  >
                    {isResponding ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Accept & Merge
                  </Button>
                </div>
              )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

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
  const { mutate: cancelMergeRequest, isLoading: isCancelling } =
    useCancelMergeRequest();

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.readed_at).length;
  };

  const getMergeRequestsCount = () => {
    return mergeRequests?.pages?.[0]?.data?.requests?.length || 0;
  };

  const MergeRequestCard = ({ mergeRequest }) => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const handleCancelRequest = (e) => {
      e.stopPropagation();
      cancelMergeRequest(mergeRequest.id, {
        onSuccess: () => {
          toast.success("Merge request cancelled successfully");
        },
      });
    };
    return (
      <AsyncComponent>
        <div className="p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 bg-orange-50/80 dark:bg-orange-900/20">
          {/* Main Content */}
          <div className="flex gap-4">
            {/* Avatar */}
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={mergeRequest.requested_by?.profile_pic_url} />
              <AvatarFallback>
                {mergeRequest.requested_by?.first_name?.charAt(0) || "U"}
                {mergeRequest.requested_by?.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {mergeRequest.is_request_sent ? (
                  <>
                    You requested to merge your family tree with{" "}
                    <span>
                      {capitalizeName(mergeRequest.requested_to?.first_name)}
                      &nbsp;
                      {capitalizeName(mergeRequest.requested_to?.last_name)}
                    </span>
                  </>
                ) : (
                  <>
                    {capitalizeName(mergeRequest.requested_by?.first_name)}{" "}
                    {capitalizeName(mergeRequest.requested_by?.last_name)}{" "}
                  </>
                )}
                <span className="font-normal">
                  {mergeRequest.is_request_sent
                    ? "as "
                    : "wants to merge their family tree as "}
                </span>
                <span className="text-primary font-semibold">
                  {mergeRequest.type?.name}
                </span>
              </p>

              {/* Date - Desktop */}
              <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(mergeRequest.created_at)}
              </div>
            </div>
          </div>

          {/* Date - Mobile */}
          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-3">
            {formatDate(mergeRequest.created_at)}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            {mergeRequest.is_request_sent ? (
              <>
                <Button
                  size="sm"
                  className="rounded-full h-8 px-4 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsViewModalOpen(true);
                  }}
                >
                  View Request
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8 px-4 text-sm text-primary"
                  onClick={handleCancelRequest}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Cancel Request
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  className="rounded-full h-8 px-4 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsViewModalOpen(true);
                  }}
                >
                  View Request
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8 px-4 text-sm text-primary"
                  onClick={handleCancelRequest}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Decline
                </Button>
              </>
            )}
          </div>
        </div>

        <MergeRequestDialog
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          requestId={mergeRequest.id}
        />
      </AsyncComponent>
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
      <Card className="container max-w-2xl mx-auto py-8 px-4 rounded-2xl h-full overflow-y-scroll no_scrollbar">
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
            mergeRequests?.pages?.[0]?.data?.requests?.length > 0 ? (
              mergeRequests.pages.map((page) =>
                page.data.requests.map((request) => (
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
