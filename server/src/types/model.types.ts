import { Document, Types, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: number;
  dob: Date;
  verified: boolean;
  accountType: "Admin" | "User";
  tokenVersion: number;
  verificationToken?: string;
  verificationExpires: Date;
  profileImage: string;
  about: string;
  location: string;
  joiningDate: Date;
  post: Types.ObjectId[];
  friends: Types.ObjectId[];
  savedPosts: Types.ObjectId[];
}

export interface Location {
  country?: string;
  region?: string;
  city?: string;
  lat?: string;
  lon?: string;
}

export interface IRefreshToken extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  sessionId: string;
  deviceName?: string;
  userAgent?: string;
  ipAddress?: string;
  browserInfo?: string;
  osInfo?: string;
  location?: Location;
  revoked: boolean;
  expiresAt: Date;
  replacedByToken?: Types.ObjectId | null;
}

export interface IMedia extends Document {
  url: string;
  public_id: string;
  resource_type: string; // image/video/raw
  format: string;
  width: number;
  height: number;
  duration: number;
}

export interface IStory extends Document {
  userId: Types.ObjectId;
  mediaUrl: string;
  viewUsers: Types.ObjectId[];
  viewCount : Number;
  createdAt: Date;
}

export interface IReply extends Document {
  commentId: Types.ObjectId;
  userId: Types.ObjectId;
  description: string;
  likes: Types.ObjectId[];
  createdAt: Date;
}

export interface IPost extends Document {
  userId: Types.ObjectId;
  media: Types.ObjectId[];
  description: string;
  likes: Types.ObjectId[];
  shares: number;
  createdAt: Date;
  comments: Types.ObjectId[];
}

export interface IOtp extends Document {
  userId: Types.ObjectId;
  otp: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: "chat" | "call" | "friend_request" | "post" | "system";
  content: string;
  relatedId: Types.ObjectId;
  relatedModel: "chat" | "call" | "friend_request" | "post" | "system";
  isRead: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  type: "text" | "image" | "video" | "file" | "system";
  seenBy: Types.ObjectId[];
  createdAt: Date;
}

export interface IInteraction extends Document {
  actorId: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: "post" | "comment" | "story" | "user";
  type: "like" | "view" | "comment" | "share" | "follow";
  createdAt: Date;
}

export interface IGroup extends Document {
  admins: Types.ObjectId[];
  members: Types.ObjectId[];
  groupName: string;
}

export interface IFriendRequest extends Document {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface IComment extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  description: string;
  likes: Types.ObjectId[];
  createdAt: Date;
  replies: Types.ObjectId[];
}

export interface IChat extends Document {
  type: "private" | "group";
  members: Types.ObjectId[];
  groupId?: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  isMuted?: Types.ObjectId[];
  createdAt: Date;
}

export interface ICall extends Document {
  chatId: Types.ObjectId;
  callerId: Types.ObjectId;
  receiverIds: Types.ObjectId[];
  callType: "audio" | "video";
  status: "ongoing" | "missed" | "ended";
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  callLogMessageId?: Types.ObjectId;
}
