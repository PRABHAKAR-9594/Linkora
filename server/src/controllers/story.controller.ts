import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS, STORY_MESSAGES } from "../utils/constants";
import { ApiResponse } from "../utils/apiResponseHandler/apiResponse";
import {
  handleCreateStory,
  handleDeleteStory,
  handleGetFriendsStories,
  handleGetMyStories,
  handleStoryViewed,
} from "../services/story.service";

export const createStory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.currentUser;

  const { mediaUrl } = req.body;

  const createdStory = await handleCreateStory(id, mediaUrl);

  res
    .status(HTTP_STATUS.CREATED)
    .json(ApiResponse.created(createdStory, STORY_MESSAGES.CREATED));
});

export const getMyStories= asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.currentUser;
    const stories = await handleGetMyStories(id);
    res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(stories, STORY_MESSAGES.STORY_BY_USER));
  }
);
export const viewStory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.currentUser;
  const { storyId } = req.params;

  const storyViewed = await handleStoryViewed(id, storyId);

  res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success(storyViewed, STORY_MESSAGES.VIEW_UPDATED));
});

export const deleteStory = asyncHandler(async (req: Request, res: Response) => {
  const { storyId } = req.params;

  const deletedStory = await handleDeleteStory(storyId);

  res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success(deletedStory, STORY_MESSAGES.DELETED));
});

export const getFriendsStories = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.currentUser;

    const stories = await handleGetFriendsStories(id);

    res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(stories, STORY_MESSAGES.FRIEND_STORIES_FETCHED));
  }
);
