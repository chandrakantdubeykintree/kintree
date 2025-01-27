import { usePosts } from "@/hooks/usePosts";
import ComponentErrorBoundary from "../errorBoundaries/ComponentErrorBoundary";
import CreatePostCard from "../components/create-post-card";
import { useEffect, useRef } from "react";
import GlobalSpinner from "../components/global-spinner";
import ComponentLoading from "../components/component-loading";
import Posts from "../components/posts";
import { getInitials } from "@/utils/stringFormat";
import { useProfile } from "@/hooks/useProfile";
import { api_user_profile } from "@/constants/apiEndpoints";

export default function Foreroom() {
  const { profile: user } = useProfile(api_user_profile);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePosts();

  const postsData = data?.pages?.flatMap((page) => page?.data?.posts);
  const loaderRef = useRef(null);

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
  if (isLoading) return <GlobalSpinner />;

  return (
    <div className="grid gap-4 grid-cols-1">
      <CreatePostCard
        user={{
          profile_pic_url: user?.profile_pic_url,
          userInitials:
            getInitials(user?.basic_info?.first_name) +
            " " +
            getInitials(user?.basic_info?.last_name),
        }}
      />
      <ComponentErrorBoundary>
        <div className="w-full mx-auto">
          <div className="w-full mx-auto">
            <div className="space-y-4">
              {postsData?.map((post) => (
                <Posts
                  key={post.id}
                  post={post}
                  user={{
                    profile_pic_url: user?.profile_pic_url,
                    userInitials:
                      getInitials(user?.basic_info?.first_name) +
                      " " +
                      getInitials(user?.basic_info?.last_name),
                    id: user.id,
                  }}
                />
              ))}
            </div>
          </div>

          {hasNextPage && (
            <div
              ref={loaderRef}
              className="h-12 flex justify-center items-center"
            >
              {isFetchingNextPage ? (
                <ComponentLoading />
              ) : (
                <span>Scroll to load more</span>
              )}
            </div>
          )}
        </div>
      </ComponentErrorBoundary>
    </div>
  );
}
