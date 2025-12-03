import { api } from "@/lib";
import { PostAPI } from "@/api/shared/post.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useCreatePostMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      mediaIds,
      description,
    }: {
      mediaIds: string[];
      description: string;
    }) => PostAPI.publishPost(mediaIds, description),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, ...data }: any) => {
      const res = await api.put(`/post/update/${postId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.delete(`/post/${postId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => PostAPI.getPosts(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage?.nextCursor ? lastPage.nextCursor : undefined,
    initialPageParam: undefined,
    staleTime: 60 * 1000,
    retry: 1,
  });
};

export const useToggleLikeMutation = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await api.patch(`/post/toggle-like/${postId}`);
      return data;
    },
  });
};
