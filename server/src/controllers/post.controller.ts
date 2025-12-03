import type { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import {
  handleCreatePost,
  handleGetPosts,
  handleGetPostsByUser,
  handleLike,
} from "../services/post.service";
import { ApiResponse } from "../utils/apiResponseHandler/apiResponse";
import {
  COMMON_MESSAGES,
  HTTP_STATUS,
  POST_MESSAGES,
} from "../utils/constants";
import { ApiError } from "../utils/apiResponseHandler/apiError";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.currentUser.id;
  const { description, mediaIds } = req.body;
  if (!mediaIds || mediaIds.length === 0 || !description) {
    throw ApiError.BadRequest(COMMON_MESSAGES.REQUIRED_FIELDS);
  }
  await handleCreatePost({ userId, mediaIds, description });
  return res
    .status(HTTP_STATUS.CREATED)
    .json(ApiResponse.created(null, POST_MESSAGES.CREATED));
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement logic for updating a post
  return res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success(null, "Update post endpoint under development"));
});

// Soft Delete Post (Archived using deleted_at + deleted_by fields)
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement soft delete logic (mark as deleted, not remove)
  return res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success(null, "Delete post endpoint under development"));
});

export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.currentUser;
  const { postId } = req.params;
  if (!postId) throw ApiError.BadRequest(COMMON_MESSAGES.REQUIRED_FIELDS);

  const { updatedPost, isLiked } = await handleLike(id, postId);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      ApiResponse.success(
        updatedPost,
        `Post successfully ${isLiked ? "unliked" : "liked"}`
      )
    );
});

export const getUserPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const cursor = req.query.cursor as string | undefined;
    const limit = Number(req.query.limit) || 10;

    const result = await handleGetPostsByUser(userId, cursor, limit);

    return res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(result, POST_MESSAGES.FETCH_SUCCESS));
  }
);

export const getSavedPost = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: Implement saved post retrieval logic
    return res
      .status(HTTP_STATUS.OK)
      .json(
        ApiResponse.success(null, "Get saved posts endpoint under development")
      );
  }
);

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const { cursor, limit } = req.query;

  const result = await handleGetPosts({
    cursor: cursor as string,
    limit: Number(limit) || 5,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success(result, POST_MESSAGES.FETCH_SUCCESS));
});
