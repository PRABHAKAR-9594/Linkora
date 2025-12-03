import { Schema, model } from "mongoose";
import { IUser } from "../types/model.types";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, //hide password in ALL queries by default
    },
    phoneNumber: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    accountType: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    // To delete the user profile from table
    verificationExpires: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 30 minutes
      select: false,
    },
    profileImage: String,
    about: String,
    location: String,
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    post: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

//Delete this document after the account is not verified for past 30minutes using verificationExpires
userSchema.index(
  { verificationExpires: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { verified: false } }
);

userSchema.index({ friends: 1 });
userSchema.index({ savedPosts: 1 });
userSchema.index({ post: 1 });

// Compound example (optional)
userSchema.index({ email: 1, verified: 1 });

// Text search (optional)
userSchema.index({ userName: "text", firstName: "text", lastName: "text" });

export const User = model<IUser>("User", userSchema);
