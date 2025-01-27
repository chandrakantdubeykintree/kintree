import AsyncComponent from "./async-component";
import { ICON_CHECK_BRAND } from "@/constants/iconUrls";
import { Progress } from "./ui/progress";
import { usePollVote } from "@/hooks/usePosts";
import { formatTimeAgo } from "@/utils/stringFormat";

export default function PollPost({ post }) {
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
  } = post;

  const isPollEnded = () => {
    const endDate = new Date(post_data.poll_end_date);
    endDate.setHours(23, 59, 59, 999); // Set to the end of the day
    const now = new Date(); // Current date and time
    return now > endDate; // Poll is ended if the current date is past the end date
  };

  const isPollActive = () => {
    const now = new Date(); // Current date and time
    const startDate = new Date(post_data.poll_start_date);
    const endDate = new Date(post_data.poll_end_date);
    endDate.setHours(23, 59, 59, 999); // Set to the end of the day

    return startDate <= now && now <= endDate; // Poll is active if current time is between start date and end date
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to the end of the day
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const pollVoteMutation = usePollVote();
  const handleVote = (optionId) => {
    if (!post_data?.is_user_voted && isPollActive()) {
      pollVoteMutation.mutate(
        {
          pollId: post_data.id,
          optionId,
        },
        {
          onError: (error) => {
            console.error("Error voting:", error);
          },
        }
      );
    }
  };

  const isInteractionDisabled =
    post_data?.is_user_voted || isPollEnded() || !isPollActive();
  return (
    <AsyncComponent>
      <h2 className="text-lg font-normal mb-4">{post_data?.question}</h2>
      <div className="space-y-3 p-5 border rounded-xl">
        {post_data?.options?.map((option) => {
          const isVoted = post_data?.user_voted_option_ids?.includes(option.id);
          const votePercentage =
            post_data?.poll_total_votes > 0
              ? Math.round(
                  (option.vote_count / post_data.poll_total_votes) * 100
                )
              : 0;
          const isHighestVoted =
            Math.max(...post_data?.options?.map((o) => o?.vote_count)) ===
            option?.vote_count;

          return (
            <div
              key={option.id}
              className={`p-3 rounded-lg border transition-colors
                              ${isVoted ? "border-brandPrimary" : ""}
                              ${isHighestVoted ? "border-brandPrimary" : ""}
                              ${pollVoteMutation.isPending ? "opacity-50" : ""}
                              ${
                                !isInteractionDisabled
                                  ? "hover:bg-brandPrimary cursor-pointer"
                                  : "cursor-default"
                              }
                            `}
              onClick={() => !isInteractionDisabled && handleVote(option.id)}
              role={!isInteractionDisabled ? "button" : "presentation"}
              aria-disabled={isInteractionDisabled}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium flex gap-1 items-center">
                  {option.option}
                  {isVoted && isHighestVoted && (
                    <span className="ml-2">
                      <img src={ICON_CHECK_BRAND} className="h-5 w-5" />
                    </span>
                  )}
                </span>
                {(post_data.is_user_voted || isPollEnded()) && (
                  <span className="text-sm">
                    {option.vote_count} votes ({votePercentage}%)
                  </span>
                )}
              </div>

              {(post_data.is_user_voted || isPollEnded()) && (
                <Progress value={votePercentage} className="h-2" />
              )}
            </div>
          );
        })}
        <div className="mt-4 text-sm">
          {isPollEnded() ? (
            <div className="flex gap-2">
              <span>{post_data?.poll_total_votes} total votes</span>
              <span>-</span>
              <span>Poll ended {formatTimeAgo(post_data.poll_end_date)}</span>
            </div>
          ) : (
            <span>
              {getDaysRemaining(post_data.poll_end_date)} days remaining
            </span>
          )}
        </div>
      </div>
    </AsyncComponent>
  );
}
