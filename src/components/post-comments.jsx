import { useParams } from "react-router";
import AsyncComponent from "./async-component";
import ComponentLoading from "./component-loading";
import { Card } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { getInitials, formatTimeAgo } from "@/services/stringFormat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ICON_LIKE,
  ICON_LIKEFILLED,
  ICON_OPTIONS,
  ICON_SEND,
} from "@/constants/iconUrl";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  usePostCommentReactions,
  useUpdateComment,
} from "@/hooks/usePosts";
import { Fragment, useState } from "react";
import { Input } from "./ui/input";
import { useAuth } from "@/context/AuthProvider";
import { useRef } from "react";
import { useEffect } from "react";

export default function PostComments() {
  const { postId } = useParams();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useComments(postId);

  const [commentInput, setCommentInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const createCommentMutation = useCreateComment();
  const loaderRef = useRef(null);
  const postCommentReactionMutation = usePostCommentReactions(postId);

  const handleCreateComment = () => {
    if (!commentInput.trim()) return;

    createCommentMutation.mutate(
      {
        postId,
        comment: commentInput,
        ...(replyingTo && { parent_id: replyingTo.id }),
      },
      {
        onSuccess: () => {
          setCommentInput("");
          setReplyingTo(null);
        },
      }
    );
  };

  const handleCommentInputChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateComment();
    }
  };

  const handleCommentReaction = (commentId) => {
    postCommentReactionMutation.mutate({
      commentId,
      data: { type: "like" },
    });
  };

  const handleReplyClick = (comment) => {
    setReplyingTo(comment);
    setCommentInput(`@${comment.author_details.username} `);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentInput("");
  };
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  if (isLoading) return <ComponentLoading />;

  return (
    <AsyncComponent>
      <Card className="flex flex-col">
        <div className="flex-1 overflow-y-auto no_scrollbar">
          <div className="space-y-4 p-3">
            {data?.pages?.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page?.data?.comments?.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <CommentItem
                      comment={comment}
                      onReply={handleReplyClick}
                      onReaction={handleCommentReaction}
                    />
                    {comment.replied_comments &&
                      comment.replied_comments.length > 0 && (
                        <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-1">
                          {comment.replied_comments.map((reply) => (
                            <CommentItem
                              key={reply.id}
                              comment={reply}
                              onReply={handleReplyClick}
                              onReaction={handleCommentReaction}
                              canReply={false}
                            />
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </Fragment>
            ))}
            {hasNextPage && (
              <div
                ref={loaderRef}
                className="h-12 flex justify-center items-center"
              >
                {isFetchingNextPage ? (
                  <ComponentLoading />
                ) : (
                  <span>Load more comments...</span>
                )}
              </div>
            )}
            {!data?.pages?.[0]?.data?.comments?.length && (
              <div className="text-center">No comments yet</div>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 p-4 border-t rounded-lg shadow-lg bg-background">
          <div className="flex flex-col gap-2">
            {replyingTo && (
              <div className="flex items-center justify-between text-sm text-brandPrimary p-2 rounded">
                <span>Replying to @{replyingTo.author_details.username}</span>
                <Button
                  variant="ghost"
                  className="border border-brandPrimary hover:bg-red-500 rounded-full"
                  size="sm"
                  onClick={handleCancelReply}
                >
                  Cancel
                </Button>
              </div>
            )}
            <div className="flex gap-2 ">
              <Input
                type="text"
                value={commentInput}
                onChange={handleCommentInputChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  replyingTo
                    ? `Reply to @${replyingTo.author_details.username}...`
                    : "Add a comment..."
                }
                className="flex-1 p-2 px-4 border h-10 rounded-full"
              />

              <img
                src={ICON_SEND}
                onClick={handleCreateComment}
                className="transform transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer max-w-5 w-5"
              />
            </div>
          </div>
        </div>
      </Card>
    </AsyncComponent>
  );
}

const CommentItem = ({ comment, onReply, onReaction, canReply = true }) => {
  const { postId } = useParams();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);

  const { user } = useAuth();
  const isAuthor = user?.id === comment?.author_details?.id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteCommentMutation.mutate({ postId, commentId: comment.id });
  };

  const handleSaveEdit = () => {
    if (editedComment.trim() === comment.comment) {
      setIsEditing(false);
      return;
    }

    updateCommentMutation.mutate(
      {
        postId,
        commentId: comment.id,
        comment: editedComment,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedComment(comment.comment);
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
      <Avatar className="h-10 w-10 rounded-full">
        <AvatarImage src={comment.author_details.profile_pic_url} />
        <AvatarFallback className="rounded-full h-10 w-10">
          {getInitials(comment.author_details.first_name) +
            " " +
            getInitials(comment.author_details.last_name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">
                {comment.author_details.first_name}{" "}
                {comment.author_details.last_name}
              </div>
              <div className="text-sm text-gray-500">
                @{comment.author_details.username}
              </div>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <img src={ICON_OPTIONS} className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="mt-1">
              <Input
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="rounded-full"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1">{comment.comment}</p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-2 text-sm">
          <button
            className="flex items-center gap-1"
            onClick={() => onReaction(comment.id)}
          >
            <img
              src={comment.user_reaction ? ICON_LIKEFILLED : ICON_LIKE}
              className="w-4 h-4"
            />
            <span>{comment.reaction_counts?.like?.count || 0} likes</span>
          </button>
          {canReply && <button onClick={() => onReply(comment)}>Reply</button>}
          <span className="text-gray-500">
            {formatTimeAgo(comment.created_at)}
          </span>
          {comment.updated_at !== comment.created_at && (
            <span className="text-gray-500">(edited)</span>
          )}
        </div>

        {(updateCommentMutation.isPending ||
          deleteCommentMutation.isPending) && (
          <div className="text-sm text-gray-500">
            {updateCommentMutation.isPending && "Updating comment..."}
            {deleteCommentMutation.isPending && "Deleting comment..."}
          </div>
        )}
      </div>
    </div>
  );
};
