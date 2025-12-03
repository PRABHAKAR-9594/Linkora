import mongoose, { ObjectId, Types } from "mongoose";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { HTTP_STATUS, POST_MESSAGES } from "../utils/constants";
import {
  validateMediaExists,
  validateUserExists,
} from "../utils/helper/dbValidators";
import { createPost, GetPostsByUserResult } from "../types/post.types";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";

export const handleCreatePost = async (data: createPost) => {
  await validateUserExists(data.userId);
  // Validate all mediaIds properly
  await Promise.all(
    data.mediaIds.map((id: Types.ObjectId) =>
      validateMediaExists(id.toString())
    )
  );

  const post = await Post.create({
    userId: data.userId,
    media: data.mediaIds,
    description: data.description,
  });

  await User.findByIdAndUpdate(data.userId, {
    $addToSet: { post: post._id },
  });

  return post;
};

export const handleGetPostsByUser = async (
  userId: string,
  cursor?: string,
  limit: number = 10
): Promise<GetPostsByUserResult> => {
  await validateUserExists(userId);

  const query: any = { userId: new mongoose.Types.ObjectId(userId) };

  if (cursor) {
    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      throw ApiError.BadRequest(POST_MESSAGES.INVALID_CURSOR);
    }
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const validLimit = Math.max(1, limit);

  const fetchedPosts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(validLimit + 1)
    .populate("media")
    .populate("userId", "userName profileImage")
    .lean()
    .exec();

  let nextCursor: string | null = null;
  let posts = fetchedPosts;

  if (fetchedPosts.length > validLimit) {
    const extra = fetchedPosts.pop();
    posts = fetchedPosts;
    nextCursor = (extra?._id as mongoose.Types.ObjectId).toString();
  }

  return { posts, nextCursor };
};

interface QueryParams {
  cursor?: string;
  limit?: number;
}

export const handleGetPosts = async ({ cursor, limit = 5 }: QueryParams) => {
  const query: any = {};
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .populate("userId")
    .populate("media");

  const hasNextPage = posts.length > limit;
  const nextCursor = hasNextPage ? posts[limit]._id : null;

  return {
    posts: posts.slice(0, limit),
    nextCursor,
  };
};

export const handleLike = async (id: string, postId: string) => {
  const post = await Post.findById(postId);
  const isPostOwner = post?.userId.toString() === id;
  if (isPostOwner) {
    throw ApiError.BadRequest(POST_MESSAGES.OWN_POST);
  }
  const isLiked = post?.likes.includes(new Types.ObjectId(id));
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    isLiked ? { $pull: { likes: id } } : { $addToSet: { likes: id } },
    { new: true }
  );
  if (!updatedPost) {
    throw ApiError.NotFound(POST_MESSAGES.NOT_FOUND);
  }
  return { updatedPost, isLiked };
};
