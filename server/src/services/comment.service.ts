import { Types } from "mongoose";
import { Comment } from "../models/comment.model";
import { Post } from "../models/post.model";
import { Reply } from "../models/reply.model";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { ValidatePostExists } from "../utils/helper/dbValidators";
import { COMMENT_MESSAGES } from "../utils/constants";

export const handleCreateComment = async (
  commentText: string,
  postId: string,
  userId: string
) => {
  const post = await ValidatePostExists(postId);

  const comment = await Comment.create({
    userId,
    postId,
    description: commentText,
  });

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: { comments: comment._id },
    },
    { new: true }
  );

  return { updatedPost, comment };
};

export const handleCreateCommentReply = async (
  replyText: string,
  commentId: string,
  userId: string
) => {
  //validate comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw ApiError.BadRequest(COMMENT_MESSAGES.COMMENT_NOT_FOUND_TO_REPLY);
  }
  const reply = await Reply.create({
    userId,
    commentId,
    description: replyText,
  });

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $addToSet: {
        replies: reply._id,
      },
    },
    { new: true }
  );
  return { comment, reply };
};

export const handleToggleCommentLike = async (
  id: string,
  commentId: string
) => {
  const comment = await Comment.findById(commentId);
  const isCommentAuthor = comment?.userId.toString() === id;
  if (isCommentAuthor) {
    throw ApiError.BadRequest(COMMENT_MESSAGES.OWN_COMMENT_LIKE);
  }
  const isLiked = comment?.likes.includes(new Types.ObjectId(id));
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    isLiked ? { $pull: { likes: id } } : { $addToSet: { likes: id } },
    { new: true }
  );
  if (!updatedComment) {
    throw ApiError.NotFound(COMMENT_MESSAGES.NOT_FOUND);
  }
  return { updatedComment, isLiked };
};

export const handleToggleReplyLike = async (id: string, replyId: string) => {
  const reply = await Reply.findById(replyId);
  const isReplyAuthor = reply?.userId.toString() === id;
  if (isReplyAuthor) {
    throw ApiError.BadRequest(COMMENT_MESSAGES.OWN_REPLY_LIKE);
  }
  const isLiked = reply?.likes.includes(new Types.ObjectId(id));
  const updatedReply = await Reply.findByIdAndUpdate(
    replyId,
    isLiked ? { $pull: { likes: id } } : { $addToSet: { likes: id } },
    { new: true }
  );
  if (!updatedReply) {
    throw ApiError.NotFound(COMMENT_MESSAGES.REPLY_NOT_FOUND);
  }
  return { updatedReply, isLiked };
};

export const handleCommentsAndReply = async (postId: string) => {
  const comments = await Comment.find({ postId })
    .populate({
      path: "userId",
      select: "firstName lastName profileImage -_id",
    })
    .populate({
      path: "replies",
      populate: {
        path: "userId",
        select: "firstName lastName profileImage -_id",
      },
      select: "description likes createdAt",
    })
    .sort({ createdAt: -1 })
    .lean();

  return comments;
};
