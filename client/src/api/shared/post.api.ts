import type { AxiosResponse } from "axios";
import { PostURL } from "../config";
import { api } from "@/lib";

export const PostAPI = {
  getUserPosts: async (userId: string, cursor?: string, limit = 30) => {
    const newLimit = 40;
    const response: AxiosResponse = await api.get(
      PostURL.getUserPosts(userId, cursor, newLimit)
    );
    return response.data;
  },
  publishPost: async (mediaIds: string[], description: string) => {
    console.log("media id in publishPost :: ", mediaIds);
    const { data }: AxiosResponse = await api.post(PostURL.createPost, {
      mediaIds,
      description,
    });
    return data;
  },
  getPosts: async (cursor?: string, limit = 10) => {
    const response = await api.get("/post/getPosts", {
      params: { cursor, limit },
    });
    return response.data.data;
  },
  updatePost: async (
    postId: string,
    mediaId: string | undefined,
    description: string
  ) => {
    const response = await api.put(`/post/update/${postId}`, {
      mediaId,
      description,
    });
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await api.delete(`/post/${postId}`);
    return response.data;
  },
};
