import { Types } from "mongoose";
import { Story } from "../models/story.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { validateUserExists } from "../utils/helper/dbValidators";
import { STORY_MESSAGES, USER_MESSAGES } from "../utils/constants";

export const handleCreateStory = async (id: string, mediaUrl: string) => {
  const story = await Story.create({ userId: id, mediaUrl });

  return story;
};

export const handleStoryViewed = async (userId: string, storyId: string) => {
  const story = await Story.findById(storyId);
  if (!story) {
    throw ApiError.NotFound(STORY_MESSAGES.NOT_FOUNND);
  }

  // Prevent user from increasing their own story view
  if (story.userId.toString() === userId) {
    throw ApiError.BadRequest(STORY_MESSAGES.OWN_STORY_VIEW_NOT_ALLOWED);
  }

  // Single atomic update: add viewer & increment count (only if first time)
  const updatedStory = await Story.findOneAndUpdate(
    { _id: storyId, viewUsers: { $ne: userId } }, // Only if user hasn't viewed before
    {
      $addToSet: { viewUsers: userId }, // Add user to view list
      $inc: { viewCount: 1 }, // Increase count
    },
    { new: true }
  );

  // If user has already viewed, return original story without increment
  return updatedStory || story;
};

export const handleGetMyStories = async (userId: string) => {
  const user = await validateUserExists(userId);

  const stories = await Story.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .select("_id mediaUrl viewUsers viewCount createdAt")
    .populate("userId", "userName firstName lastName profileImage")
    .populate("viewUsers", "userName profileImage firstName lastName");

  return stories;
};

export const handleDeleteStory = async (storyId: string) => {
  const deletedStory = await Story.findByIdAndDelete(storyId);
  if (!deletedStory) {
    throw ApiError.NotFound(STORY_MESSAGES.NOT_FOUNND);
  }
  return deletedStory;
};

export const handleGetFriendsStories = async (userId: string) => {
  const user = await User.findById(userId).select("friends");
  if (!user) throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);

  if (!user.friends || user.friends.length === 0) return [];

  const stories = await Story.aggregate([
    {
      $match: {
        userId: { $in: user.friends },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$userId",
        stories: {
          $push: {
            _id: "$_id",
            mediaUrl: "$mediaUrl",
            createdAt: "$createdAt",
            viewCount: "$viewCount",
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        user: {
          _id: "$user._id",
          userName: "$user.userName",
          profileImage: "$user.profileImage",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
        },
        stories: 1,
      },
    },
  ]);

  return stories;
};
