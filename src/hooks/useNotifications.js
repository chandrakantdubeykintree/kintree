import { kintreeApi } from "@/services/kintreeApi";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export function useNotifications(limit = 10) {
  const queryClient = useQueryClient();

  // Fetch notifications with pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await kintreeApi.get("/user/notifications", {
        params: {
          page: pageParam,
          limit,
        },
      });
      return response.data.data;
    },
    refetchInterval: 60000,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
  });

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId) => {
      const response = await kintreeApi.put(
        `/user/notifications/${notificationId}/mark-as-read`
      );
      return response.data.data;
    },
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData(["notifications"], (oldData) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((notification) =>
              notification.id === updatedNotification.id
                ? updatedNotification
                : notification
            ),
          })),
        };
      });
    },
  });

  // Mark notification as unread
  const markAsUnread = useMutation({
    mutationFn: async (notificationId) => {
      const response = await kintreeApi.put(
        `/user/notifications/${notificationId}/mark-as-unread`
      );
      return response.data.data;
    },
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData(["notifications"], (oldData) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((notification) =>
              notification.id === updatedNotification.id
                ? updatedNotification
                : notification
            ),
          })),
        };
      });
    },
  });

  // Delete notification
  const deleteNotification = useMutation({
    mutationFn: async (notificationId) => {
      await kintreeApi.delete(`/user/notifications/${notificationId}`);
      return notificationId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["notifications"], (oldData) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            notifications: page.notifications.filter(
              (notification) => notification.id !== deletedId
            ),
            total_record: page.total_record - 1,
            filtered_record: page.filtered_record - 1,
          })),
        };
      });
    },
  });

  // Helper function to get all notifications from all pages
  const getAllNotifications = () => {
    return data?.pages.flatMap((page) => page.notifications) || [];
  };

  // Helper function to get unread count
  const getUnreadCount = () => {
    return getAllNotifications().filter(
      (notification) => !notification.readed_at
    ).length;
  };

  return {
    notifications: getAllNotifications(),
    unreadCount: getUnreadCount(),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    markAsRead: markAsRead.mutate,
    markAsUnread: markAsUnread.mutate,
    deleteNotification: deleteNotification.mutate,
    isMarkingAsRead: markAsRead.isLoading,
    isMarkingAsUnread: markAsUnread.isLoading,
    isDeleting: deleteNotification.isLoading,
  };
}
