import { Request, Response } from "express";
import { Server } from "socket.io";
import asyncHandler from "../middlewares/asyncHandler.middleware";

import {
  handleUpdateProfile,
  handleGetFriends,
  handleSendFriendRequest,
  handleAcceptFriendRequest,
  handleDeleteProfile,
  handleRemoveFriend,
  handleUpdateProfileImage,
  handleGetUserDetail,
  handleCancelFriendRequest,
  handleRejectFriendRequest,
  handleSearchProfile,
} from "../services/profile.service";

import { ApiResponse } from "../utils/apiResponseHandler/apiResponse";
import {
  COMMON_MESSAGES,
  HTTP_STATUS,
  USER_MESSAGES,
} from "../utils/constants";
import { ApiError } from "../utils/apiResponseHandler/apiError";

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.currentUser.id;

    const updatedUser = await handleUpdateProfile(req.body, userId);

    res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(updatedUser, USER_MESSAGES.UPDATE_SUCCESS));
  }
);

export const getFriends = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const friends = await handleGetFriends(userId);

  res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success(friends, USER_MESSAGES.FOUND));
});

export const sendFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.currentUser.id;
    const { friendId } = req.params;

    const io = req.app.get("io") as Server;

    const message = await handleSendFriendRequest(io, userId, friendId);

    res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, message));
  }
);

export const acceptFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.currentUser.id;
    const { requesterId } = req.params;

    const message = await handleAcceptFriendRequest(userId, requesterId);

    res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, message));
  }
);

export const cancelFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.currentUser.id;
    const { targetUserId } = req.params;

    const message = await handleCancelFriendRequest(userId, targetUserId);

    res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, message));
  }
);

export const rejectFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.currentUser.id;
    const { requesterId } = req.params;

    const message = await handleRejectFriendRequest(userId, requesterId);

    res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, message));
  }
);

export const removeFriend = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.currentUser.id;
    const { friendId } = req.params;

    const message = await handleRemoveFriend(userId, friendId);

    res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, message));
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.currentUser.id;
  await handleDeleteProfile(userId);

  res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success(null, USER_MESSAGES.DELETE_SUCCESS));
});

export const updateProfileImage = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.currentUser.id;
    const { secureUrl } = req.body;

    if (!secureUrl) {
      throw ApiError.BadRequest(COMMON_MESSAGES.REQUIRED_FIELDS);
    }

    const updatedUser = await handleUpdateProfileImage(userId, secureUrl);

    res
      .status(HTTP_STATUS.OK)
      .json(
        ApiResponse.success(
          updatedUser,
          USER_MESSAGES.PROFILE_IMAGE_UPDATE_SUCCESS
        )
      );
  }
);

export const getUserDetail = asyncHandler(
  async (req: Request, res: Response) => {
    const { userName } = req.params;
    const user = await handleGetUserDetail(userName);

    res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(user, USER_MESSAGES.FOUND));
  }
);

export const getSearchedProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.currentUser;

    const search = req.query.search as string;

    if (!search) {
      throw ApiError.BadRequest(COMMON_MESSAGES.REQUIRED_FIELDS);
    }

    const users = await handleSearchProfile(id, search);

    res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(users, USER_MESSAGES.FOUND));
  }
);
