import { useNavigate, useParams } from "react-router";
import { NavLink } from "react-router";
import AsyncComponent from "@/components/async-component";
import Post from "@/components/post";
import { getInitials } from "@/utils/stringFormat";
import { useAuth } from "@/context/AuthProvider";
import { usePoll, usePost } from "@/hooks/usePosts";
import ComponentLoading from "@/components/component-loading";
import PostComments from "@/components/post-comments";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { checkPostAccess } from "@/services/privacyChecks";

export default function ViewPost() {
  const { user } = useAuth();
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch, error } = usePost(pollId);
  const { data: pollData } = usePoll(data?.post_data?.id);

  // useEffect(() => {
  //   if (!isLoading && data) {
  //     const hasAccess = checkPostAccess(
  //       data.author_details.id,
  //       data.post_data.privacy,
  //       user
  //     );

  //     if (!hasAccess) {
  //       toast.error("You don't have permission to view this post");
  //       navigate("/foreroom");
  //       return;
  //     }
  //   }
  // }, [data, isLoading, user, navigate]);
  const handlePostUpdate = () => {
    refetch();
  };

  if (isLoading) return <ComponentLoading />;
  if (error) {
    toast.error("Failed to load poll");
    navigate("/foreroom");
    return null;
  }

  return (
    <AsyncComponent>
      <div className="w-full mx-auto lg:px-0 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <NavLink
            to="/foreroom"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span className="h-8 w-8 rounded-full hover:bg-sky-100 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            Back to Foreroom
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-shrink-0">
            <Post
              post={data}
              user={{
                profile_pic_url: user?.profile_pic_url,
                userInitials:
                  getInitials(user?.basic_info?.first_name) +
                  " " +
                  getInitials(user?.basic_info?.last_name),
                id: user?.id,
              }}
              onReactionUpdate={handlePostUpdate}
            />
          </div>
          <div className="flex-1">
            <PostComments postId={pollId} onCommentUpdate={handlePostUpdate} />
          </div>
        </div>
      </div>
    </AsyncComponent>
  );
}
