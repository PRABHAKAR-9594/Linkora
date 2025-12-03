import { api } from "@/lib";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateCommentMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      commentText,
    }: {
      postId: string;
      commentText: string;
    }) => {
      const { data } = await api.post(`/comment/create/${postId}`, {
        commentText,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
};

export const useCreateReplyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      commentId,
      replyText,
    }: {
      postId: string;
      commentId: string;
      replyText: string;
    }) => {
      const { data } = await api.post(
        `/comment/create-comment-reply/${commentId}`,
        { replyText }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      console.log("variables :: ", variables);
      qc.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
};

export const useToggleCommentLikeMutation = () => {
  return useMutation({
    mutationFn: async (commentId: string) => {
      const { data } = await api.patch(`/comment/like-comment/${commentId}`);
      return data;
    },
  });
};

export const useToggleReplyLikeMutation = () => {
  return useMutation({
    mutationFn: async (replyId: string) => {
      const { data } = await api.patch(`/comment/like-reply/${replyId}`);
      return data;
    },
  });
};

export const useCommentQuery = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => await api.get(`/comment/get-comments/${postId}`),
    // enabled: !postId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
