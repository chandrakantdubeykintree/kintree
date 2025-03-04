import {
  capitalizeName,
  formatCounts,
  formatTimeAgo,
  getInitials,
} from "@/utils/stringFormat";
import PhotoVideoPost from "./photo-video-post";
import PollPost from "./poll-post";
import AsyncComponent from "./async-component";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  ICON_COMMENT,
  ICON_LIKE,
  ICON_LIKEFILLED,
  ICON_SHARE,
} from "@/constants/iconUrls";
import { NavLink, useLocation } from "react-router";
import { useWindowSize } from "@/hooks/useWindowSize";
import PostEditDeleteDropDown from "./post-edit-dropdown";
import { route_view_poll, route_view_post } from "@/constants/routeEnpoints";
import { usePostReactions } from "@/hooks/usePosts";
import { PRIVACYDROPDOWN } from "@/constants/dropDownConstants";
import { useTranslation } from "react-i18next";

export default function Recipe({ post, user, onReactionUpdate }) {
  const { t } = useTranslation();
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
  const { width } = useWindowSize();
  const location = useLocation();
  const isViewPost = location.pathname.substring("/viewpost");

  const postReactionMutation = usePostReactions();

  const hasUserReacted = (type) => {
    return user_reaction?.type === type;
  };

  const getReactionCount = (type) => {
    return reactions?.[type]?.count || 0;
  };

  const handlePostReaction = (id, type = "like") => {
    postReactionMutation.mutate({
      postId: id,
      type: type,
    });
    if (onReactionUpdate) {
      onReactionUpdate();
    }
  };

  const renderPost = (post) => {
    return <RecipePost post={post} key={id} />;
  };
  return (
    <AsyncComponent>
      <Card className="w-full mx-auto shadow-sm border-0 rounded-2xl overflow-hidden">
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
                  <h3 className="font-semibold dark:text-white line-clamp-1 overflow-hidden">
                    {capitalizeName(author_details?.first_name) +
                      " " +
                      capitalizeName(author_details?.last_name)}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center space-x-2 text-sm">
                  <span>{formatTimeAgo(created_at)}</span>
                  {updated_at && created_at !== updated_at && (
                    <>
                      <span>•</span>
                      <span>
                        {t("edited")} {formatTimeAgo(updated_at)}
                      </span>
                    </>
                  )}
                  <img
                    src={
                      PRIVACYDROPDOWN?.find((item) => item.id === privacy)?.icon
                    }
                    className="h-4 w-4"
                  />
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
        <CardContent className="p-4">
          {renderPost(post)}
          <div className="flex justify-between mt-5">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePostReaction(id, "like")}
                className="flex items-center gap-2 h-18 w-18"
                disabled={postReactionMutation.isPending}
              >
                <img
                  src={hasUserReacted("like") ? ICON_LIKEFILLED : ICON_LIKE}
                  className={`w-5 h-5 transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer fill-current
                  ${postReactionMutation.isPending ? "opacity-50" : ""}`}
                  alt="Like"
                />
                <span className="text-sm">
                  {formatCounts("like", getReactionCount("like"), width)}
                </span>
              </button>

              {isViewPost ? (
                <div className="flex items-center gap-2 h-18 w-18">
                  <img
                    src={ICON_COMMENT}
                    className="w-5 h-5 transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer"
                  />
                  <span className="text-sm">
                    {formatCounts("comment", comment_counts || 0, width)}
                  </span>
                </div>
              ) : (
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
                  <span>
                    {formatCounts("comment", comment_counts || 0, width)}
                  </span>
                </NavLink>
              )}
              <button className="flex items-center gap-2  h-18 w-18">
                <img
                  src={ICON_SHARE}
                  className="w-5 h-5 transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer"
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AsyncComponent>
  );
}
