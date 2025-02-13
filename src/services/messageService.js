import { io } from "socket.io-client";
import { create } from "zustand";
import { tokenService } from "./tokenService";

const SOCKET_URL = import.meta.env.VITE_KINTREE_SOCKET_URL;

class MessageService {
  constructor() {
    this.socket = null;
    this.socketUrl = SOCKET_URL;
  }

  connect() {
    if (this.socket?.connected) return;

    const token = tokenService.getLoginToken();
    if (!token) {
      useMessageStore.getState().setError("No authentication token found");
      return;
    }

    const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      path: "/socket.io/",
      withCredentials: true,
      auth: { token: authToken },
      extraHeaders: {
        Authorization: authToken,
      },
      "Access-Control-Allow-Origin": "*",
    });

    this.setupSocketListeners();

    this.socket.on("connect_error", (error) => {
      useMessageStore.getState().setError("Socket connection error");
      // Fallback to polling if websocket fails
      if (error.type === "TransportError") {
        this.socket.io.opts.transports = ["polling"];
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      useMessageStore.getState().setConnected(false);
      useMessageStore.getState().clearMessages();
    }
  }

  setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      useMessageStore.getState().setConnected(true);
      useMessageStore.getState().setError(null);
      useMessageStore.getState().setChannelsLoading(true);

      this.socket.emit("get-channels", (response) => {
        if (response.success) {
          useMessageStore.getState().setChannels(response.channels);
        } else {
          console.error("Error fetching channels:", response.error);
        }
        useMessageStore.getState().setChannelsLoading(false);
      });
    });

    // this.socket.on("family-members-list", (data) => {
    //   useMessageStore.getState().setFamilyMembers(data);
    // });

    this.getFamilyMembers();

    this.socket.on("disconnect", (reason) => {
      useMessageStore.getState().setConnected(false);
    });

    this.socket.on("connect_error", (error) => {
      useMessageStore.getState().setError(error.message);
      useMessageStore.getState().setConnected(false);
    });

    this.socket.on("channel-delivered", (data) => {
      if (data.success) {
        const messages = useMessageStore.getState().messages;
        const updatedMessages = messages.map((msg) =>
          !msg.message_sent_by_me && !msg.delivered_at
            ? { ...msg, delivered_at: new Date().toISOString() }
            : msg
        );
        useMessageStore.getState().setMessages(updatedMessages);
      }
    });

    this.socket.on("channel-read", (data) => {
      if (data.success) {
        const messages = useMessageStore.getState().messages;
        const updatedMessages = messages.map((msg) =>
          !msg.message_sent_by_me && !msg.read_at
            ? { ...msg, read_at: new Date().toISOString() }
            : msg
        );
        useMessageStore.getState().setMessages(updatedMessages);
      }
    });

    // Channel events
    this.socket.on("channel-joined", (data) => {
      if (data.channel && data.messages) {
        useMessageStore.getState().setCurrentChannel(data.channel);
        useMessageStore.getState().setMessages(data.messages.data || []);
        useMessageStore.getState().setPagination(data.messages.pagination);
        useMessageStore.getState().setError(null);
      } else {
        useMessageStore.getState().setError("Invalid channel data received");
      }
      useMessageStore.getState().setLoading(false);
    });

    // Message events
    this.socket.on("message-sent", (response) => {
      if (response.success) {
        useMessageStore.getState().addMessage(response.data);
      }
    });

    this.socket.on("new-message", (message) => {
      useMessageStore.getState().addMessage(message);
      // Automatically mark as delivered when receiving new messages
      if (!message.message_sent_by_me) {
        this.markAsDelivered(message.channel_id, message.id);
      }
    });

    // Message status events
    this.socket.on("message-delivered", (data) => {
      useMessageStore.getState().updateMessageDeliveryStatus(data);
    });

    this.socket.on("message-read", (data) => {
      if (data.success) {
        const messages = useMessageStore.getState().messages;
        const updatedMessages = messages.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, read_at: new Date().toISOString() }
            : msg
        );
        useMessageStore.getState().setMessages(updatedMessages);
      }
    });

    this.socket.on("messages-delivered", (data) => {
      if (data.channelId === useMessageStore.getState().currentChannel?.id) {
        const messages = useMessageStore.getState().messages;
        const updatedMessages = messages.map((msg) =>
          msg.message_sent_by_me && !msg.delivered_at
            ? { ...msg, delivered_at: new Date().toISOString() }
            : msg
        );
        useMessageStore.getState().setMessages(updatedMessages);
      }
    });

    this.socket.on("messages-read", (data) => {
      if (data.channelId === useMessageStore.getState().currentChannel?.id) {
        const messages = useMessageStore.getState().messages;
        const updatedMessages = messages.map((msg) =>
          msg.message_sent_by_me && !msg.read_at
            ? { ...msg, read_at: new Date().toISOString() }
            : msg
        );
        useMessageStore.getState().setMessages(updatedMessages);
      }
    });

    // Typing events
    this.socket.on("user-typing", (data) => {
      useMessageStore.getState().setUserTyping(data.userId);
    });

    this.socket.on("user-stopped-typing", (data) => {
      useMessageStore.getState().setUserStoppedTyping(data.userId);
    });

    // User presence events
    this.socket.on("user-joined", (data) => {
      useMessageStore.getState().addActiveUser(data);
    });

    this.socket.on("user-left", (data) => {
      useMessageStore.getState().removeActiveUser(data);
    });

    this.socket.on("channel-error", (data) => {
      useMessageStore.getState().setError(data.error);
      useMessageStore.getState().setLoading(false);
    });

    this.socket.on("messages-loaded", (data) => {
      try {
        // Check if we have the direct messages and pagination data
        if (data.messages && data.pagination) {
          useMessageStore
            .getState()
            .addMessages(data.messages, data.pagination);
        } else if (data.data?.messages && data.data?.pagination) {
          // Alternative format check
          useMessageStore
            .getState()
            .addMessages(data.data.messages, data.data.pagination);
        } else {
          useMessageStore.getState().setError("Invalid message data received");
        }
      } catch (error) {
        useMessageStore.getState().setError("Failed to process messages");
      } finally {
        useMessageStore.getState().setLoadingMore(false);
      }
    });

    this.socket.on("error", (error) => {
      useMessageStore.getState().setError(error?.message || "Connection error");
      useMessageStore.getState().setLoadingMore(false);
    });

    this.socket.on("message-deleted", (data) => {
      if (data.success) {
        useMessageStore.getState().removeMessage(data.messageId);
      }
    });
  }

  // Channel methods
  joinChannel(channelId, page = 1) {
    if (!channelId || isNaN(parseInt(channelId))) {
      useMessageStore.getState().setError("Invalid channel ID");
      return;
    }

    if (!this.socket?.connected) {
      this.connect();
    }

    useMessageStore.getState().setLoading(true);
    useMessageStore.getState().setError(null);

    // First mark all messages as delivered
    this.markChannelAsDelivered(channelId);

    // Then mark all messages as read
    this.markChannelAsRead(channelId);

    this.socket.emit(
      "join-channel",
      {
        channelId: parseInt(channelId),
        page,
        limit: 20,
      },
      (response) => {
        if (!response.success) {
          useMessageStore.getState().setError(response.error);
          useMessageStore.getState().setLoading(false);
        }
      }
    );
  }

  markChannelAsDelivered(channelId) {
    if (!this.socket?.connected) return;

    this.socket.emit(
      "mark-channel-delivered",
      {
        channelId: parseInt(channelId),
      },
      (response) => {
        if (!response.success) {
          console.error("Failed to mark channel as delivered:", response.error);
        }
      }
    );
  }

  getFamilyMembers() {
    this.socket.emit("get-family-members", (response) => {
      useMessageStore.getState().setFamilyMembersLoading(true);
      if (response.success) {
        useMessageStore.getState().setFamilyMembers(response.family_members);
      } else {
        console.error("Error fetching family members:", response.error);
      }
      useMessageStore.getState().setFamilyMembersLoading(false);
    });
  }

  markChannelAsRead(channelId) {
    if (!this.socket?.connected) return;

    this.socket.emit(
      "mark-channel-read",
      {
        channelId: parseInt(channelId),
      },
      (response) => {
        if (!response.success) {
          console.error("Failed to mark channel as read:", response.error);
        }
      }
    );
  }

  leaveChannel(channelId) {
    if (!this.socket?.connected) return;
    this.socket.emit("leave-channel", channelId);
  }

  // Message methods
  async sendMessage(channelId, message, attachment = null) {
    if (!this.socket?.connected) return false;

    try {
      useMessageStore.getState().setSending(true);

      // If there's an attachment, convert it to base64
      let attachmentData = null;
      if (attachment) {
        // Validate file type
        const allowedTypes = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
        const fileExt = attachment.name
          .substring(attachment.name.lastIndexOf("."))
          .toLowerCase();

        if (!allowedTypes.includes(fileExt)) {
          throw new Error(
            `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
          );
        }

        // Convert file to base64
        const reader = new FileReader();
        attachmentData = await new Promise((resolve, reject) => {
          reader.onload = () =>
            resolve({
              data: reader.result,
              name: attachment.name,
              type: attachment.type,
            });
          reader.onerror = reject;
          reader.readAsDataURL(attachment);
        });
      }

      return new Promise((resolve, reject) => {
        this.socket.emit(
          "send-message",
          {
            channelId,
            message,
            attachment: attachmentData,
          },
          (response) => {
            if (response.success) {
              useMessageStore.getState().addMessage(response.data);
              resolve(response);
            } else {
              reject(new Error(response.error));
            }
          }
        );
      });
    } catch (error) {
      useMessageStore
        .getState()
        .setError(error.message || "Failed to send message");
      return false;
    } finally {
      useMessageStore.getState().setSending(false);
    }
  }

  // Message status methods
  markAsDelivered(channelId, messageId) {
    if (this.socket?.connected) {
      this.socket.emit("mark-delivered", { channelId, messageId });
    }
  }

  markAsRead(channelId, messageId) {
    if (!this.socket?.connected) return;

    this.socket.emit("mark-as-read", {
      channelId: parseInt(channelId),
      messageId: parseInt(messageId),
    });
  }

  // Typing methods
  startTyping(channelId) {
    if (this.socket?.connected) {
      this.socket.emit("typing-start", { channelId });
    }
  }

  stopTyping(channelId) {
    if (this.socket?.connected) {
      this.socket.emit("typing-stop", { channelId });
    }
  }

  // Message update/delete methods
  async updateMessage(channelId, messageId, message) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }

    try {
      useMessageStore.getState().setSending(true);

      return new Promise((resolve, reject) => {
        this.socket.emit(
          "update-message",
          { channelId, messageId, message },
          (response) => {
            if (response.error) {
              reject(new Error(response.error));
            } else {
              useMessageStore.getState().updateMessage(response);
              resolve(response);
            }
          }
        );
      });
    } catch (error) {
      useMessageStore.getState().setError("Failed to update message");
      throw error;
    } finally {
      useMessageStore.getState().setSending(false);
    }
  }

  async deleteMessage(channelId, messageId) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }

    try {
      return new Promise((resolve, reject) => {
        this.socket.emit(
          "delete-message",
          {
            channelId: parseInt(channelId),
            messageId: parseInt(messageId),
          },
          (response) => {
            if (response.success) {
              useMessageStore.getState().removeMessage(messageId);
              resolve(response);
            } else {
              reject(new Error(response.error || "Failed to delete message"));
            }
          }
        );
      });
    } catch (error) {
      useMessageStore.getState().setError("Failed to delete message");
      throw error;
    }
  }

  loadMoreMessages(channelId, page) {
    if (!this.socket?.connected) {
      useMessageStore.getState().setError("Socket not connected");
      return;
    }

    useMessageStore.getState().setLoadingMore(true);

    this.socket.emit("load-more-messages", {
      channelId: parseInt(channelId),
      page,
      limit: 20,
    });
  }

  deleteChannel(channelId) {
    if (!this.socket?.connected) return Promise.reject("Socket not connected");

    return new Promise((resolve, reject) => {
      this.socket.emit("delete-channel", { channelId }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.error || "Failed to delete channel");
        }
      });
    });
  }
}

// Zustand store
export const useMessageStore = create((set) => ({
  currentChannel: null,
  channelsLoading: false,
  channelsList: [],
  familyMembersLoading: false,
  familyMembers: [],
  messages: [],
  isConnected: false,
  isLoading: false,
  isSending: false,
  isLoadingMore: false,
  error: null,
  activeUsers: new Set(),
  pagination: {
    currentPage: 1,
    lastPage: 1,
    totalRecords: 0,
    filteredRecords: 0,
  },
  typingUsers: new Set(),
  setFamilyMembers: (familyMembers) => set({ familyMembers: familyMembers }),
  setFamilyMembersLoading: (loading) => set({ familyMembersLoading: loading }),
  setChannels: (channels) => set({ channelsList: channels }),
  setChannelsLoading: (loading) => set({ channelsLoading: loading }),
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  setConnected: (isConnected) => set({ isConnected }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) =>
    set((state) => ({
      error: error,
      isLoadingMore: false, // Ensure loading state is reset on error
    })),
  setSending: (isSending) => set({ isSending }),

  setMessages: (messages) => set({ messages }),
  setPagination: (pagination) =>
    set({
      pagination: {
        currentPage: pagination.currentPage,
        lastPage: pagination.lastPage,
        totalRecords: pagination.totalRecords,
        filteredRecords: pagination.filteredRecords,
      },
    }),

  addMessage: (message) =>
    set((state) => {
      // Check if message already exists to prevent duplicates
      const messageExists = state.messages.some((msg) => msg.id === message.id);
      if (messageExists) {
        return state;
      }
      return {
        messages: [...state.messages, message],
      };
    }),

  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    })),

  updateMessage: (updatedMessage) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === updatedMessage.id ? updatedMessage : msg
      ),
    })),

  updateMessageDeliveryStatus: (data) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === data.messageId
          ? { ...msg, delivered_at: data.deliveredAt }
          : msg
      ),
    })),

  updateMessageReadStatus: (data) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === data.messageId ? { ...msg, read_at: data.readAt } : msg
      ),
    })),

  addActiveUser: (userData) =>
    set((state) => ({
      activeUsers: new Set([...state.activeUsers, userData.userId]),
    })),

  removeActiveUser: (userData) =>
    set((state) => ({
      activeUsers: new Set(
        [...state.activeUsers].filter((id) => id !== userData.userId)
      ),
    })),

  setUserTyping: (userId) =>
    set((state) => ({
      typingUsers: new Set([...state.typingUsers, userId]),
    })),

  setUserStoppedTyping: (userId) =>
    set((state) => ({
      typingUsers: new Set(
        [...state.typingUsers].filter((id) => id !== userId)
      ),
    })),

  clearMessages: () =>
    set({
      messages: [],
      currentChannel: null,
      pagination: {
        currentPage: 1,
        lastPage: 1,
        totalRecords: 0,
        filteredRecords: 0,
      },
      typingUsers: new Set(),
    }),

  addMessages: (newMessages, pagination) =>
    set((state) => {
      try {
        // Ensure we have valid arrays
        const currentMessages = Array.isArray(state.messages)
          ? state.messages
          : [];
        const incomingMessages = Array.isArray(newMessages) ? newMessages : [];

        // For subsequent pages, prepend messages (since older messages are coming in)
        return {
          messages: [...incomingMessages, ...currentMessages],
          pagination: {
            currentPage:
              pagination?.currentPage || state.pagination.currentPage,
            lastPage: pagination?.lastPage || state.pagination.lastPage,
            totalRecords:
              pagination?.totalRecords || state.pagination.totalRecords,
            filteredRecords:
              pagination?.filteredRecords || state.pagination.filteredRecords,
          },
        };
      } catch (error) {
        return state; // Return unchanged state on error
      }
    }),

  setLoadingMore: (isLoadingMore) => set({ isLoadingMore }),
}));

export const messageService = new MessageService();
