import mongoose, { Types } from "mongoose";
import { Server } from "socket.io";
import { FriendRequest } from "../models/friendRequest.model";
import { User } from "../models/user.model";
import { UpdateProfile } from "../types/profile.types";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import {
  COMMON_MESSAGES,
  FRIEND_MESSAGES,
  HTTP_STATUS,
  USER_MESSAGES,
} from "../utils/constants";
import { validateUserExists } from "../utils/helper/dbValidators";
import { redisClient } from "../config/redis.config";
import { sendNotification } from "../socket/sendNotification.socket";

export const handleUpdateProfile = async (
  data: UpdateProfile,
  userId: string
) => {
  await validateUserExists(userId);

  const updatePayload = {
    ...(data.firstName && { firstName: data.firstName }),
    ...(data.lastName && { lastName: data.lastName }),
    ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
    ...(data.dob && { dob: data.dob }),
    ...(data.location && { location: data.location }),
    ...(data.about && { about: data.about }),
  };

  if (!Object.keys(updatePayload).length) {
    throw ApiError.BadRequest(USER_MESSAGES.NO_DATA_PROVIDED);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updatePayload },
    { new: true }
  ).select("-password");

  await redisClient.del(`user:${userId}`);

  if (!updatedUser) {
    throw ApiError.ServerError(USER_MESSAGES.UPDATE_FAILED);
  }

  return updatedUser;
};

export const handleDeleteProfile = async (userId: string) => {
  await validateUserExists(userId);

  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) {
    throw ApiError.ServerError(USER_MESSAGES.DELETE_FAILED);
  }

  return deleted;
};

export const handleGetFriends = async (userId: string) => {
  await validateUserExists(userId);

  const user = await User.findById(userId)
    .populate("friends", "-password -verificationToken")
    .select("friends");

  if (!user) {
    throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);
  }

  return user.friends;
};

export const handleSendFriendRequest = async (
  io: Server,
  from: string,
  to: string
) => {
  if (from === to) {
    throw ApiError.BadRequest(FRIEND_MESSAGES.CANNOT_SELF_REQUEST);
  }

  await validateUserExists(from);
  await validateUserExists(to);

  if (await User.exists({ _id: from, friends: to })) {
    throw ApiError.Conflict(FRIEND_MESSAGES.ALREADY_FRIENDS);
  }

  if (await FriendRequest.exists({ from, to })) {
    throw ApiError.Conflict(FRIEND_MESSAGES.ALREADY_SENT);
  }

  const request = await FriendRequest.create({ from, to });

  // if (!request) {
  //   throw ApiError.BadRequest("Something went wrong.");
  // }

  await sendNotification(io, {
    userId: new Types.ObjectId(to),
    type: "friend_request",
    content: "You have a new friend request",
    relatedId: request._id,
    relatedModel: "friend_request",
  });

  return FRIEND_MESSAGES.REQUEST_SENT;
};

export const handleAcceptFriendRequest = async (
  userId: string,
  requesterId: string
) => {
  if (userId === requesterId) {
    throw ApiError.BadRequest(FRIEND_MESSAGES.CANNOT_SELF_ACCEPT);
  }

  await validateUserExists(userId);
  await validateUserExists(requesterId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await FriendRequest.findOne({
      from: requesterId,
      to: userId,
      status: "pending",
    }).session(session);

    if (!request) {
      throw ApiError.NotFound(FRIEND_MESSAGES.NOT_FOUND);
    }

    await User.updateOne(
      { _id: userId },
      { $addToSet: { friends: requesterId } },
      { session }
    );
    await User.updateOne(
      { _id: requesterId },
      { $addToSet: { friends: userId } },
      { session }
    );
    await FriendRequest.updateOne(
      { _id: request._id },
      { status: "accepted" },
      { session }
    );

    await session.commitTransaction();
    return FRIEND_MESSAGES.REQUEST_ACCEPTED;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const handleCancelFriendRequest = async (
  userId: string,
  targetUserId: string
) => {
  const request = await FriendRequest.findOneAndDelete({
    from: userId,
    to: targetUserId,
    status: "pending",
  });

  if (!request) {
    throw ApiError.NotFound(FRIEND_MESSAGES.NOT_FOUND);
  }

  return FRIEND_MESSAGES.REQUEST_CANCELED;
};

export const handleRejectFriendRequest = async (
  userId: string,
  requesterId: string
) => {
  const request = await FriendRequest.findOneAndUpdate(
    { from: requesterId, to: userId, status: "pending" },
    { status: "rejected" }
  );

  if (!request) {
    throw ApiError.NotFound(FRIEND_MESSAGES.NOT_FOUND);
  }

  return FRIEND_MESSAGES.REQUEST_REJECTED;
};

export const handleRemoveFriend = async (userId: string, friendId: string) => {
  if (userId === friendId) {
    throw ApiError.BadRequest(FRIEND_MESSAGES.CANNOT_SELF_REQUEST);
  }

  await validateUserExists(userId);
  await validateUserExists(friendId);

  const areFriends = await User.exists({ _id: userId, friends: friendId });
  if (!areFriends) {
    throw ApiError.NotFound(FRIEND_MESSAGES.NOT_FRIENDS);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await User.updateOne(
      { _id: userId },
      { $pull: { friends: friendId } },
      { session }
    );
    await User.updateOne(
      { _id: friendId },
      { $pull: { friends: userId } },
      { session }
    );
    await session.commitTransaction();

    return FRIEND_MESSAGES.FRIEND_REMOVED;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const handleUpdateProfileImage = async (
  userId: string,
  secureUrl: string
) => {
  if (!secureUrl) {
    throw ApiError.BadRequest(COMMON_MESSAGES.REQUIRED_FIELDS);
  }

  await validateUserExists(userId);

  const updated = await User.findByIdAndUpdate(
    userId,
    { profileImage: secureUrl },
    { new: true }
  ).select("-password");

  await redisClient.del(`user:${userId}`);

  if (!updated) {
    throw ApiError.NotFound(USER_MESSAGES.PROFILE_IMAGE_UPDATE_FAILED);
  }

  return updated;
};

export const handleGetUserDetail = async (userName: string) => {
  const user = await User.aggregate([
    { $match: { userName } },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        userName: 1,
        email: 1,
        profileImage: 1,
        about: 1,
        location: 1,
        joiningDate: 1,
        friendsCount: { $size: "$friends" },
      },
    },
  ]);

  if (!user.length) {
    throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);
  }

  return user[0];
};

export const handleSearchProfile = async (id: string, search: string) => {
  if (!search?.trim()) return [];

  return await User.aggregate([
    {
      $addFields: {
        fullName: { $concat: ["$firstName", " ", "$lastName"] },
      },
    },
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(id) },
        $or: [
          { userName: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        userName: 1,
        profileImage: 1,
      },
    },
  ]);
};
