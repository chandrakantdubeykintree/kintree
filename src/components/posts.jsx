import {
  capitalizeName,
  formatCounts,
  formatTimeAgo,
  getInitials,
} from "@/utils/stringFormat";
import PhotoVideoPost from "./photo-video-post";
import PollPost from "./poll-post";
import AsyncComponent from "./async-component";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  ICON_COMMENT,
  ICON_EMOJI,
  ICON_LIKE,
  ICON_LIKEFILLED,
  ICON_SAVE,
  ICON_SEND,
  ICON_SHARE,
} from "@/constants/iconUrls";
import EmojiPicker from "emoji-picker-react";
import { NavLink } from "react-router";
import { Input } from "./ui/input";
import { useWindowSize } from "@/hooks/useWindowSize";
import PostEditDeleteDropDown from "./post-edit-dropdown";
import { route_view_poll, route_view_post } from "@/constants/routeEnpoints";
import { useCreateComment, usePostReactions } from "@/hooks/usePosts";
import { useState } from "react";
import { PRIVACYDROPDOWN } from "@/constants/dropDownConstants";
import { useClickOutside } from "@/hooks/useClickOutside";
import LikesDialog from "./likes-dialog";
import { BadgeCheck, Check } from "lucide-react";

export default function Posts({ post, user }) {
  const { width } = useWindowSize();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setCommentInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  const emojiPickerRef = useClickOutside(() => {
    setShowEmojiPicker(false);
  });
  const {
    id,
    privacy,
    post_data,
    author_details,
    reactions,
    user_reaction,
    comment_counts,
    created_at,
    updated_at,
    type,
  } = post;

  const [isLikesDialogOpen, setLikesDialogOpen] = useState(false);
  const likeData = reactions?.like || { count: 0, users: [] };

  const handleLikesClick = () => {
    setLikesDialogOpen(true);
  };
  const [commentInput, setCommentInput] = useState("");
  const createCommentMutation = useCreateComment();
  const postReactionMutation = usePostReactions();
  const handleCreateComment = () => {
    if (commentInput.trim() === "" || commentInput.length < 1) return;
    createCommentMutation.mutate(
      { postId: id, comment: commentInput },
      {
        onSuccess: () => {
          setCommentInput("");
        },
      }
    );
  };
  const handleCommentInputChange = (e) => {
    setCommentInput(e.target.value);
  };
  const hasUserReacted = (type) => {
    return user_reaction?.type === type;
  };
  const getReactionCount = (type) => {
    return reactions?.[type]?.count || 0;
  };
  const handlePostReaction = (type = "like") => {
    postReactionMutation.mutate(
      {
        postId: id,
        type: "like",
      },
      {
        onError: (error) => {
          console.error("Error handling reaction:", error);
        },
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateComment();
    }
  };

  const renderPost = (post) => {
    switch (post?.type) {
      case "poll":
        return <PollPost post={post} key={id} />;
      case "normal":
        return <PhotoVideoPost post={post} key={id} />;
    }
  };

  return (
    <AsyncComponent>
      <Card className="w-full mx-auto shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b p-5">
          <div className="grid grid-cols-8 gap-5 w-full">
            <div className="flex items-center gap-3 col-span-7 w-full">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 border">
                <Avatar className="items-center justify-center">
                  <AvatarImage src={author_details?.profile_pic_url} />
                  <AvatarFallback>
                    {getInitials(author_details?.first_name) +
                      " " +
                      getInitials(author_details?.last_name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold dark:text-white line-clamp-1 overflow-hidden flex items-center gap-1">
                    {capitalizeName(author_details?.first_name) +
                      " " +
                      capitalizeName(author_details?.last_name)}{" "}
                    {author_details?.is_brand_page && (
                      <span className="text-brandPrimary">
                        <BadgeCheck className="w-4 h-4" />
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center space-x-2 text-sm">
                  <span>{formatTimeAgo(created_at)}</span>
                  {updated_at && created_at !== updated_at && (
                    <>
                      <span>•</span>
                      <span>Edited {formatTimeAgo(updated_at)}</span>
                    </>
                  )}
                  <img
                    src={
                      PRIVACYDROPDOWN?.find((item) => item.id === privacy)?.icon
                    }
                    className="h-4 w-4"
                  />
                  {post_data?.feeling && (
                    <span className="text-sm font-medium flex items-center gap-1 text-primary">
                      {post_data?.feeling.name}
                      <img
                        src={post_data?.feeling.image_url}
                        className="w-5 h-5"
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 col-span-1 justify-end items-start">
              {user?.id === author_details?.id && (
                <PostEditDeleteDropDown type={type} id={id} />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pb-2">
          {renderPost(post)}
          <div className="flex justify-between mt-5">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 h-18 w-18">
                <img
                  src={hasUserReacted("like") ? ICON_LIKEFILLED : ICON_LIKE}
                  className={`w-5 h-5 transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer fill-current
                                    ${
                                      postReactionMutation.isPending
                                        ? "opacity-50"
                                        : ""
                                    }`}
                  alt="Like"
                  onClick={() => handlePostReaction(id, "like")}
                  disabled={postReactionMutation.isPending}
                />
                <span
                  className="text-sm cursor-pointer"
                  onClick={handleLikesClick}
                >
                  {" "}
                  {formatCounts("like", getReactionCount("like"), width)}
                </span>
              </button>
              <NavLink
                to={`${
                  type === "normal" ? route_view_post : route_view_poll
                }/${id}`}
                className="flex items-center gap-2 h-18 w-18"
              >
                <img
                  src={ICON_COMMENT}
                  className="w-5 h-5 transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer"
                />
                <span className="text-sm">
                  {formatCounts("comment", comment_counts || 0, width)}
                </span>
              </NavLink>
              <button className="flex items-center gap-2  h-18 w-18">
                <img
                  src={ICON_SHARE}
                  className="w-5 h-5 transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer"
                />
                {/* <span className="text-sm">share</span> */}
              </button>
            </div>

            {/* <div className="self-end">
              <button className="flex items-center gap-2  h-18 w-18 ">
                <img
                  src={ICON_SAVE}
                  className="w-5 h-5 transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer"
                />
              </button>
            </div> */}
          </div>
        </CardContent>
        <CardFooter className="p-4 flex gap-5 w-full border-t">
          <div className="flex items-center gap-3 col-span-8 lg:col-span-5 xl:col-span-6 w-full">
            <div tabIndex={0} role="button" className="w-10 rounded-full">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 border">
                <Avatar className="items-center justify-center">
                  <AvatarImage src={user?.profile_pic_url} />
                  <AvatarFallback>{user?.userInitials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <NavLink
              to={`${
                type === "normal" ? route_view_post : route_view_poll
              }/${id}`}
              className="w-full"
            >
              <Input
                type="text"
                placeholder="Add a comment..."
                className="boder rounded-full shadow-none h-10 px-4"
                style={{ width: "100%" }}
                value={commentInput}
                onChange={handleCommentInputChange}
                onKeyPress={handleKeyPress}
              />
            </NavLink>
          </div>
          <div className="flex items-center gap-3 col-span-8 justify-end">
            <img
              src={ICON_SEND}
              onClick={() => handleCreateComment()}
              className="transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer max-w-7"
            />
            <div className="" ref={emojiPickerRef}>
              <img
                src={ICON_EMOJI}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer max-w-7"
              />
              {showEmojiPicker && (
                <div className="absolute bottom-10 right-0 z-50">
                  <div className="shadow-lg rounded-lg">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={300}
                      height={400}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
      {isLikesDialogOpen && (
        <LikesDialog
          isOpen={isLikesDialogOpen}
          onClose={() => setLikesDialogOpen(false)}
          likes={likeData.users}
          postId={id}
        />
      )}
    </AsyncComponent>
  );
}
