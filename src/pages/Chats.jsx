import { Card } from "@/components/ui/card";
import { useFamilyMembers } from "@/hooks/useFamily";
import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useChannels,
  useCreateChannel,
  useDeleteChannel,
} from "@/hooks/useChannels";
import {
  Plus,
  ArrowLeft,
  MoreVertical,
  Check,
  CheckCheck,
  Trash2,
  Send,
  X,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { messageService, useMessageStore } from "@/services/messageService";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";

const TYPING_TIMER_LENGTH = 3000;

export default function Chats() {
  const { data: members, isLoading: membersLoading } = useFamilyMembers();
  const { data: channels = [], isLoading: channelsLoading } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const createChannel = useCreateChannel();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [newChannelData, setNewChannelData] = useState({
    name: "",
    description: "",
    thumbnail_image: null,
    selectedUserId: null,
  });
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [sendStatus, setSendStatus] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isGroupChatMode, setIsGroupChatMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const {
    messages,
    isConnected,
    isLoading: messagesLoading,
    isLoadingMore,
    isSending,
    pagination,
    error: socketError,
  } = useMessageStore();

  const deleteChannelMutation = useDeleteChannel();

  // Initialize socket connection
  useEffect(() => {
    if (!messageService.socket?.connected) {
      messageService.connect();
    }

    return () => {
      if (selectedChannel) {
        messageService.leaveChannel(selectedChannel.id);
      }
      messageService.disconnect();
    };
  }, []);

  // Scroll to bottom for new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto scroll to bottom when new messages arrive (not for loading more)
  useEffect(() => {
    if (!isLoadingMore) {
      scrollToBottom();
    }
  }, [messages, isLoadingMore, scrollToBottom]);

  // Maintain scroll position when loading older messages
  useEffect(() => {
    if (isLoadingMore) {
      const messagesContainer = document.querySelector(".messages-container");
      if (messagesContainer) {
        const scrollHeight = messagesContainer.scrollHeight;
        messagesContainer.scrollTop = scrollHeight;
      }
    }
  }, [messages, isLoadingMore]);

  // Handle message delivery status
  useEffect(() => {
    if (!selectedChannel || !messages.length) return;

    // Mark all unread messages as read when channel is opened
    const unreadMessages = messages.filter(
      (msg) => !msg.message_sent_by_me && !msg.read_at
    );

    if (unreadMessages.length > 0) {
      unreadMessages.forEach((msg) => {
        messageService.markAsRead(selectedChannel.id, msg.id);
      });
    }
  }, [selectedChannel, messages]);

  // Listen for typing events
  useEffect(() => {
    messageService.socket?.on("user-typing", ({ channelId, user }) => {
      if (channelId === selectedChannel?.id) {
        setTypingUsers((prev) => new Set(prev).add(user));
      }
    });

    messageService.socket?.on("user-stop-typing", ({ channelId, user }) => {
      if (channelId === selectedChannel?.id) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(user);
          return newSet;
        });
      }
    });

    return () => {
      messageService.socket?.off("user-typing");
      messageService.socket?.off("user-stop-typing");
    };
  }, [selectedChannel]);

  const handleMemberSelect = async (member) => {
    if (isGroupChatMode) {
      // For group chat, add/remove member from selection
      setSelectedMembers((prev) =>
        prev.some((m) => m.id === member.id)
          ? prev.filter((m) => m.id !== member.id)
          : [...prev, member]
      );
    } else {
      // For direct chat, create channel immediately
      setIsMembersDialogOpen(false);
      try {
        await createChannel.mutateAsync({
          is_group: 0,
          name: member.first_name + " " + member.last_name,
          description: null,
          thumbnail_image: null,
          user_ids: [member.id],
        });
      } catch (error) {
        console.error("Failed to create channel:", error);
      }
    }
  };

  const handleCreateGroupChat = async (e) => {
    e.preventDefault();
    if (selectedMembers.length < 2) return;

    try {
      const formData = new FormData();
      formData.append("is_group", "1");
      formData.append("name", newChannelData.name);
      if (newChannelData.description) {
        formData.append("description", newChannelData.description);
      }
      if (newChannelData.thumbnail_image) {
        formData.append("thumbnail_image", newChannelData.thumbnail_image);
      }
      selectedMembers.forEach((member) => {
        formData.append("user_ids[]", member.id);
      });

      await createChannel.mutateAsync(formData);

      setIsCreateDialogOpen(false);
      setIsMembersDialogOpen(false);
      setSelectedMembers([]);
      setNewChannelData({
        name: "",
        description: "",
        thumbnail_image: null,
      });
      setIsGroupChatMode(false);
    } catch (error) {
      console.error("Failed to create group channel:", error);
    }
  };

  const handleChannelSelect = async (channel) => {
    if (selectedChannel?.id === channel.id) return;

    if (selectedChannel) {
      messageService.leaveChannel(selectedChannel.id);
    }

    setSelectedChannel(channel);
    setShowMobileList(false);

    // Ensure socket is connected before joining channel
    if (!messageService.socket?.connected) {
      messageService.connect();
    }

    messageService.joinChannel(channel.id, 1); // Start with page 1
  };

  const handleScroll = (e) => {
    const element = e.target;
    if (
      Math.abs(element.scrollTop) < 10 &&
      !isLoadingMore &&
      pagination.currentPage < pagination.lastPage
    ) {
      messageService.loadMoreMessages(
        selectedChannel.id,
        pagination.currentPage + 1
      );
    }
  };

  // Handle message sending with better error handling
  const handleSendMessage = async (message) => {
    if (!selectedChannel || !message.trim()) return;

    try {
      await messageService.sendMessage(selectedChannel.id, message.trim());
      setNewMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (selectedChannel) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Emit typing start
      messageService.startTyping(selectedChannel.id);

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        messageService.stopTyping(selectedChannel.id);
      }, TYPING_TIMER_LENGTH);
    }
  };

  const handleMessageRead = (messageId) => {
    if (selectedChannel) {
      messageService.markAsRead(selectedChannel.id, messageId);
    }
  };

  const handleMessageDelete = async (messageId) => {
    if (!messageId || !selectedChannel?.id) return;

    try {
      await messageService.deleteMessage(selectedChannel.id, messageId);
      setMessageToDelete(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleStartEdit = (message) => {
    setEditingMessageId(message.id);
    setEditedMessage(message.message);
  };

  const handleSaveEdit = async (messageId) => {
    if (!editedMessage.trim() || editedMessage.length > 200) return;

    try {
      await messageService.updateMessage(
        selectedChannel.id,
        messageId,
        editedMessage
      );
      setEditingMessageId(null);
      setEditedMessage("");
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessage("");
  };

  const handleDeleteChat = async () => {
    try {
      await deleteChannelMutation.mutateAsync(selectedChannel.id);
      setIsDeleteDialogOpen(false);
      setSelectedChannel(null);
      setShowMobileList(true);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <TooltipProvider>
      <Card className="h-full bg-background rounded-2xl">
        <div className="grid md:grid-cols-8 h-full">
          {/* Channels list */}
          <div
            className={`${
              showMobileList ? "block" : "hidden"
            } md:block md:col-span-3 border-r h-full relative`}
          >
            {/* Fixed channels header */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 border-b bg-background z-10">
              <h2 className="font-bold text-lg">Chats</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsGroupChatMode(false);
                    setIsMembersDialogOpen(true);
                  }}
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsGroupChatMode(true);
                    setIsMembersDialogOpen(true);
                  }}
                >
                  <Users className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable channels list */}
            <div className="absolute top-[73px] bottom-0 left-0 right-0 overflow-y-auto no_scrollbar">
              <div className="p-4 space-y-2">
                {channelsLoading ? (
                  <p>Loading chats...</p>
                ) : channels?.data?.length > 0 ? (
                  channels?.data?.map((channel) => (
                    <div
                      key={channel.id}
                      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${
                        selectedChannel?.id === channel.id ? "bg-accent" : ""
                      }`}
                      onClick={() => handleChannelSelect(channel)}
                    >
                      <img
                        src={
                          channel.thumbnail_image_url || "/default-avatar.png"
                        }
                        alt={channel.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {channel.name || "Direct Message"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {channel.last_message || "No messages yet"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">
                    No chats yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div
            className={`${
              showMobileList ? "hidden" : "block"
            } md:block md:col-span-5 h-full relative`}
          >
            {selectedChannel ? (
              <>
                {/* Fixed chat header */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 border-b bg-background z-10">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setShowMobileList(true)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <img
                      src={
                        selectedChannel.thumbnail_image_url ||
                        "/default-avatar.png"
                      }
                      alt={selectedChannel.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <h3 className="font-medium">
                      {selectedChannel.name || "Direct Message"}
                    </h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setIsInfoDialogOpen(true)}
                      >
                        View Info
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Send status indicator */}
                {sendStatus && (
                  <div
                    className={`absolute top-[73px] left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full text-sm
                      ${
                        sendStatus.type === "success"
                          ? "bg-green-500/10 text-green-500"
                          : sendStatus.type === "error"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                  >
                    {sendStatus.message}
                  </div>
                )}

                {/* Scrollable messages area */}
                <div
                  className="absolute top-[73px] bottom-[89px] left-0 right-0 overflow-y-auto messages-container no_scrollbar"
                  onScroll={handleScroll}
                >
                  {isLoadingMore && (
                    <div className="text-center p-2 text-sm text-muted-foreground">
                      Loading more messages...
                    </div>
                  )}

                  <div className="p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={`message-${message.id}`}
                        className={`flex ${
                          message.message_sent_by_me
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="flex flex-col gap-1 max-w-[80%] group">
                          {!message.message_sent_by_me &&
                            message.created_by && (
                              <span className="text-xs text-muted-foreground ml-2">
                                {message.created_by.first_name ||
                                  "Unknown User"}
                              </span>
                            )}

                          <div className="flex flex-col gap-1">
                            <div
                              className={`relative p-3 rounded-2xl break-words whitespace-pre-wrap ${
                                message.message_sent_by_me
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="overflow-hidden break-words">
                                {message.message}
                              </div>
                            </div>

                            <div
                              className={`flex items-center gap-2 px-2 text-xs ${
                                message.message_sent_by_me
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              {message.message_sent_by_me && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 text-destructive"
                                        onClick={() =>
                                          setMessageToDelete(message)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <p>Delete message</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              )}

                              <span className="text-muted-foreground">
                                {message.created_at
                                  ? format(
                                      new Date(message.created_at),
                                      "HH:mm"
                                    )
                                  : ""}
                              </span>

                              {message.message_sent_by_me && (
                                <span>
                                  {message.read_at ? (
                                    <CheckCheck className="h-3 w-3 text-primary" />
                                  ) : message.delivered_at ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* Scroll anchor */}
                  </div>
                </div>

                {/* Fixed bottom section */}
                <div className="absolute bottom-0 left-0 right-0 border-t bg-background">
                  {/* Typing indicator */}
                  {typingUsers.size > 0 && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      {Array.from(typingUsers)
                        .map((user) => user.first_name)
                        .join(", ")}
                      {typingUsers.size === 1 ? " is" : " are"} typing...
                    </div>
                  )}

                  {/* Message input */}
                  <div className="p-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage(newMessage);
                      }}
                      className="space-y-1"
                    >
                      <div className="relative flex items-end gap-2">
                        <div className="relative flex-1">
                          <Textarea
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Type a message..."
                            disabled={!isConnected || isSending}
                            className="resize-none min-h-[20px] max-h-[120px] pr-3 rounded-2xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary no_scrollbar"
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(newMessage);
                              }
                            }}
                          />
                          <div className="absolute right-3 bottom-1 text-xs text-muted-foreground">
                            {newMessage.length}/200
                          </div>
                        </div>
                        <Button
                          type="submit"
                          size="icon"
                          className="h-10 w-10 shrink-0 rounded-full"
                          disabled={
                            !isConnected ||
                            isSending ||
                            !newMessage.trim() ||
                            newMessage.length > 200
                          }
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>

        {/* Chat Info Dialog */}
        <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Chat Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={
                    selectedChannel?.thumbnail_image_url ||
                    "/default-avatar.png"
                  }
                  alt={selectedChannel?.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h3 className="font-semibold text-lg">
                  {selectedChannel?.name || "Direct Message"}
                </h3>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedChannel?.description || "No description available"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Created</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedChannel?.created_at
                    ? format(new Date(selectedChannel.created_at), "PPP")
                    : "Unknown"}
                </p>
              </div>
              {!selectedChannel?.is_group && (
                <div className="grid gap-2">
                  <Label>Online Status</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedChannel?.is_online
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedChannel?.is_online ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Chat Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Chat</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this chat? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteChat}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteChannelMutation.isPending}
              >
                {deleteChannelMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Message Dialog */}
        <AlertDialog
          open={messageToDelete !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setMessageToDelete(null);
          }}
        >
          <AlertDialogContent className="max-w-[360px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this message? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  messageToDelete && handleMessageDelete(messageToDelete.id)
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Members Dialog */}
        <Dialog
          open={isMembersDialogOpen}
          onOpenChange={setIsMembersDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isGroupChatMode
                  ? "Create Group Chat"
                  : "Select Member to Chat With"}
              </DialogTitle>
              {isGroupChatMode && (
                <DialogDescription>
                  Select at least 2 members to create a group chat
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="space-y-2 mt-2 max-h-[60vh] overflow-y-auto">
              {membersLoading ? (
                <div className="flex items-center justify-center p-4">
                  <span className="text-muted-foreground">
                    Loading members...
                  </span>
                </div>
              ) : members?.length > 0 ? (
                <div className="space-y-2">
                  {isGroupChatMode && (
                    <div className="flex items-center justify-between px-2 py-1 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        Selected: {selectedMembers.length} members
                      </span>
                      {selectedMembers.length >= 2 ? (
                        <Button
                          size="sm"
                          onClick={() => setIsCreateDialogOpen(true)}
                        >
                          Next
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Select {2 - selectedMembers.length} more
                        </span>
                      )}
                    </div>
                  )}
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${
                        isGroupChatMode &&
                        selectedMembers.some((m) => m.id === member.id)
                          ? "bg-accent"
                          : ""
                      }`}
                      onClick={() => {
                        if (!isGroupChatMode) {
                          handleMemberSelect(member);
                        }
                      }}
                    >
                      <img
                        src={member.profile_pic_url || "/default-avatar.png"}
                        alt={member.first_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {member.first_name} {member.last_name}
                        </div>
                        {member.email && (
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        )}
                      </div>
                      {isGroupChatMode && (
                        <Checkbox
                          checked={selectedMembers.some(
                            (m) => m.id === member.id
                          )}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent div click
                            handleMemberSelect(member);
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4">
                  <span className="text-muted-foreground">
                    No members found
                  </span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Group Chat Creation Dialog */}
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              setNewChannelData({
                name: "",
                description: "",
                thumbnail_image: null,
              });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Group Chat</DialogTitle>
              <DialogDescription>
                Creating a group chat with {selectedMembers.length} members
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGroupChat}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Group Image</Label>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative group">
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewChannelData((prev) => ({
                              ...prev,
                              thumbnail_image: file,
                            }));
                          }
                        }}
                      />
                      <label
                        htmlFor="thumbnail"
                        className="cursor-pointer block"
                      >
                        {newChannelData.thumbnail_image ? (
                          <div className="relative w-24 h-24">
                            <img
                              src={URL.createObjectURL(
                                newChannelData.thumbnail_image
                              )}
                              alt="Thumbnail preview"
                              className="w-24 h-24 rounded-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-xs">Change Image</p>
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                            <div className="flex flex-col items-center">
                              <Users className="h-8 w-8 text-muted-foreground mb-1" />
                              <p className="text-xs text-muted-foreground">
                                Upload Image
                              </p>
                            </div>
                          </div>
                        )}
                      </label>
                      {newChannelData.thumbnail_image && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() =>
                            setNewChannelData((prev) => ({
                              ...prev,
                              thumbnail_image: null,
                            }))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {newChannelData.thumbnail_image && (
                      <p className="text-sm text-muted-foreground">
                        {newChannelData.thumbnail_image.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={newChannelData.name}
                    onChange={(e) =>
                      setNewChannelData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter group name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newChannelData.description}
                    onChange={(e) =>
                      setNewChannelData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Group description (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selected Members</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-1 bg-accent rounded-full px-3 py-1"
                      >
                        <span className="text-sm">
                          {member.first_name} {member.last_name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleMemberSelect(member)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newChannelData.name || selectedMembers.length < 2}
                >
                  Create Group
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
}
