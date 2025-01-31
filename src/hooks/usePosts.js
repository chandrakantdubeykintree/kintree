import { kintreeApi } from "../services/kintreeApi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { replaceUrlParams } from "../utils/stringFormat";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const QUERY_KEYS = {
  POSTS: "posts",
  POST: "post",
  REACTIONS: "reactions",
  POLLS: "polls",
  POLL: "poll",
  COMMENTS: "comments",
  POST_REACTIONS: "post_reactions",
};

const handleApiError = (error) => {
  const message = error.response?.data?.message || "Something went wrong";
  toast.error(message);
  return Promise.reject(error);
};

export const fetchPosts = async ({ pageParam = 1, limit = 15 }) => {
  try {
    const response = await kintreeApi.get("/posts", {
      params: { page: pageParam, limit },
    });

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchPostById = async (postId) => {
  try {
    const response = await kintreeApi.get(`/posts/${postId}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createPost = async (newPost) => {
  try {
    const endpoint = newPost.type === "poll" ? "/polls" : "/posts";
    if (newPost.files) {
      const formData = new FormData();
      newPost.files.forEach((file) => {
        formData.append("files", file);
      });
      Object.keys(newPost).forEach((key) => {
        if (key !== "files") {
          if (typeof newPost[key] === "object") {
            formData.append(key, JSON.stringify(newPost[key]));
          } else {
            formData.append(key, newPost[key]);
          }
        }
      });

      const response = await kintreeApi.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    }

    const response = await kintreeApi.post(endpoint, newPost);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const editPost = async (postId, updatedPost) => {
  try {
    const endpoint =
      updatedPost.type === "poll" ? `/polls/${postId}` : `/posts/${postId}`;
    if (updatedPost.files) {
      const formData = new FormData();

      updatedPost.files.forEach((file) => {
        formData.append("files", file);
      });

      Object.keys(updatedPost).forEach((key) => {
        if (key !== "files") {
          if (typeof updatedPost[key] === "object") {
            formData.append(key, JSON.stringify(updatedPost[key]));
          } else {
            formData.append(key, updatedPost[key]);
          }
        }
      });

      const response = await kintreeApi.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    }
    const response = await kintreeApi.put(endpoint, updatedPost);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deletePost = async (postId, postType = "post") => {
  try {
    const endpoint =
      postType === "poll" ? `/polls/${postId}` : `/posts/${postId}`;
    const response = await kintreeApi.delete(endpoint);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchComments = async ({ postId, pageParam = 1, limit = 10 }) => {
  try {
    const url = replaceUrlParams("/posts/:postId/comments", { postId });
    const response = await kintreeApi.get(url, {
      params: { page: pageParam, limit },
    });

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createComment = async ({ postId, comment, parent_id }) => {
  try {
    const url = replaceUrlParams("/posts/:postId/comments", { postId });
    const payload = parent_id ? { comment, parent_id } : { comment };
    const response = await kintreeApi.post(url, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateComment = async ({ postId, commentId, comment }) => {
  try {
    const url = replaceUrlParams("/posts/:postId/comments/:commentId", {
      postId,
      commentId,
    });
    const response = await kintreeApi.put(url, { comment });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteComment = async ({ postId, commentId }) => {
  try {
    const url = replaceUrlParams("/posts/:postId/comments/:commentId", {
      postId,
      commentId,
    });
    const response = await kintreeApi.delete(url);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const postCommentReaction = async ({ postId, commentId, data }) => {
  try {
    const url = `/posts/${postId}/comments/${commentId}/reactions`;
    const response = await kintreeApi.post(url, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const usePosts = (limit = 15) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ pageParam, limit }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.next_page ?? undefined;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch posts. Please try again later.");
      console.error("Posts fetch error:", error);
    },
  });
};

export const usePost = (postId, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POST, postId],
    queryFn: () => fetchPostById(postId),
    enabled: Boolean(postId),
    ...options,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch post details.");
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    },
    onSuccess: (data) => {
      toast.success(data.message || "Post created successfully!");
      if (data.type === "poll") {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POLLS] });
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
        refetchType: "all",
      });
    },
  });
};

export const useEditPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, updatedPost }) => editPost(postId, updatedPost),
    onSuccess: (data) => {
      toast.success("Post updated successfully!");
      // Invalidate and remove from cache
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.POST, data.id] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST, data.id],
        refetchType: "all",
      });
    },
    onError: (error) => {
      console.error("Edit post error:", error);
      toast.error(error.response?.data?.message || "Failed to update post");
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ postId, postType, type }) =>
      deletePost(postId, postType, type),
    onSuccess: (_, { postType, type }) => {
      toast.success(
        type === "poll"
          ? "Poll deleted successfully!"
          : "Post deleted successfully!"
      );
      if (postType === "poll") {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POLLS] });
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      navigate("/foreroom");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete post. Please try again."
      );
    },
  });
};

export const handleReaction = async ({ postId, type }) => {
  try {
    const url = replaceUrlParams("/posts/:postId/reactions", { postId });
    const response = await kintreeApi.post(url, { type: type });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchPostReactions = async (postId) => {
  try {
    const url = replaceUrlParams("/posts/:postId/reactions", { postId });
    const response = await kintreeApi.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const useFetchPostReactions = (postId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POST_REACTIONS, postId],
    queryFn: () => fetchPostReactions(postId),
    enabled: Boolean(postId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch post reactions.");
      console.error("Post reactions fetch error:", error);
    },
  });
};

export const handleVote = async ({ pollId, optionId }) => {
  try {
    const url = replaceUrlParams("/polls/:pollId/options/:optionId/vote", {
      pollId,
      optionId,
    });
    const response = await kintreeApi.patch(url);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const usePostReactions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleReaction,
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update reaction. Please try again."
      );
    },
    onSuccess: () => {
      toast.success(`Reaction updated successfully!`);
    },
    onSettled: (_, __, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        refetchType: "active",
        exact: true,
        queryKey: [QUERY_KEYS.POST, postId],
      });
    },
  });
};

export const usePollVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleVote,
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to register vote. Please try again."
      );
    },
    onSuccess: () => {
      toast.success("Vote registered successfully!");
    },
    onSettled: (_, __, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, pollId] });
    },
  });
};

export const fetchPoll = async (pollId) => {
  try {
    const url = replaceUrlParams("/polls/:pollId", { pollId });
    const response = await kintreeApi.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const usePoll = (pollId, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POLL, pollId],
    queryFn: () => fetchPoll(pollId),
    enabled: Boolean(pollId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
    ...options,
    onError: (error) => {
      toast.error("Failed to fetch poll.");
      console.error("Poll fetch error:", error);
    },
  });
};

export const useComments = (postId) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.COMMENTS, postId],
    queryFn: ({ pageParam = 1 }) =>
      fetchComments({ postId, pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      // Match the pattern used in posts
      if (lastPage?.data?.next_page) {
        return lastPage.data.next_page;
      }
      return undefined;
    },
    enabled: Boolean(postId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch comments.");
      console.error("Comments fetch error:", error);
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, { postId }) => {
      toast.success("Comment added successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, postId],
      });
    },
    onError: (error) => {
      toast.error("Failed to create comment. Please try again.");
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onSuccess: (_, { postId }) => {
      toast.success("Comment updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, postId],
      });
    },
    onError: (error) => {
      toast.error("Failed to update comment. Please try again.");
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, { postId }) => {
      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, postId],
      });
    },
    onError: (error) => {
      toast.error("Failed to delete comment. Please try again.");
    },
  });
};

export const usePostCommentReactions = (postId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }) =>
      postCommentReaction({ postId, commentId, data }),
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update reaction. Please try again."
      );
    },
    onSuccess: () => {
      toast.success("Reaction updated successfully!");
    },
    onSettled: (_, __, { commentId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, postId],
      });
    },
  });
};
