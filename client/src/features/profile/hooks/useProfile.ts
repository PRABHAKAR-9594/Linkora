import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PostAPI } from "@/api/shared/post.api";
import { ProfileAPI } from "../api/profile.api";

import { handleAxiosError } from "@/utils";

export const useUpdateProfileImageMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => ProfileAPI.updateProfilePicture(url),
    onSuccess: () => {
      console.log("invalid query");
      qc.invalidateQueries({ queryKey: ["currentUser"] });
      console.log("query invalidated successfully.");
    },
    onError: handleAxiosError,
  });
};

export const useUserPostsQuery = (
  userId: string | undefined,
  cursor?: string,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["posts", userId, cursor],
    queryFn: () => PostAPI.getUserPosts(userId!, cursor, limit),
    enabled: !!userId, // this prevents undefined userId from running the query
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });
};

export const useProfileByUsernameQuery = (username: string) => {
  return useQuery({
    queryKey: ["profileByUsername", username],
    queryFn: () => ProfileAPI.fetchUserDetails(username),
    enabled: !!username, // this prevents undefined username from running the query
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });
};
