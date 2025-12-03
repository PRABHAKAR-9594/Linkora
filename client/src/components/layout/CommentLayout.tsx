import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Send, Heart, MessageCircle, X } from "lucide-react";
import { formatDate } from "@/utils";
import { useState } from "react";
import { useCurrentUserQuery } from "@/hooks";
import { useThrottleFn } from "@/hooks/ui/useThrottleFn";
import { useOptimisticLike } from "@/hooks/useOptimisticLike";
import {
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
  useToggleReplyLikeMutation,
  useCommentQuery,
  useCreateReplyMutation,
} from "@/features/comments/hooks/useComment";

interface CommentType {
  _id: string;
  userId: {
    profileImage: string;
    firstName: string;
    lastName: string;
  };
  description: string;
  likes: string[];
  replies: ReplyType[];
  createdAt: string;
}

interface ReplyType {
  _id: string;
  userId: {
    profileImage: string;
    firstName: string;
    lastName: string;
  };
  description: string;
  likes: string[];
  createdAt: string;
}

interface CommentsProps {
  postId: string;
}

interface ReplyingTo {
  commentId: string;
  authorName: string;
  preview: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { data, isLoading, isError } = useCommentQuery(postId);
  const [replyingTo, setReplyingTo] = useState<ReplyingTo | null>(null);

  const comments: CommentType[] = Array.isArray(data?.data?.data)
    ? data?.data?.data
    : [];

  if (!comments) return <div>No Comments Yet</div>;

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-slate-400">Loading comments...</div>
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center py-12 text-red-500">
        Failed to load comments.
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {comments?.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onReplyClick={(authorName, preview) =>
              setReplyingTo({ commentId: comment._id, authorName, preview })
            }
          />
        ))}
      </div>
      <CommentInput
        postId={postId}
        replyingTo={replyingTo}
        onClearReply={() => setReplyingTo(null)}
      />
    </div>
  );
};

interface CommentItemProps {
  comment: CommentType;
  onReplyClick: (authorName: string, preview: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReplyClick }) => {
  const { mutate: toggleLikeComment } = useToggleCommentLikeMutation();
  // const { mutate: toggleLikeReply } = useToggleReplyLikeMutation();

  const {
    isLiked: isCommentLiked,
    likesCount: commentLikesCount,
    throttledLike: throttledCommentLike,
  } = useOptimisticLike(comment.likes, toggleLikeComment, comment._id);

  const commentPreview = comment?.description?.substring(0, 50);

  return (
    <div className="space-y-5">
      <div className="flex gap-4 group">
        <Avatar className="w-11 h-11 ring-2 ring-slate-100">
          <AvatarImage
            src={comment.userId.profileImage}
            alt="User avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-3">
              <h4 className="font-semibold text-slate-900 text-[15px]">
                {comment.userId.firstName} {comment.userId.lastName}
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            <p className="text-slate-700 text-[15px] leading-relaxed">
              {comment.description}
            </p>
          </div>

          <div className="flex items-center gap-5 pt-1">
            <button
              onClick={throttledCommentLike}
              className={`flex items-center gap-1.5 text-[13px] font-medium transition-all ${
                isCommentLiked
                  ? "text-red-500"
                  : "text-slate-500 hover:text-red-500"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isCommentLiked ? "fill-red-500 text-red-500" : ""
                }`}
                strokeWidth={1.5}
              />
              <span>{commentLikesCount}</span>
            </button>

            <button
              onClick={() =>
                onReplyClick(
                  `${comment.userId.firstName} ${comment.userId.lastName}`,
                  commentPreview
                )
              }
              className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="pl-[60px] space-y-5 border-l-2 border-slate-100 ml-5">
          {comment.replies.map((reply) => (
            <ReplyItem key={reply._id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ReplyItemProps {
  reply: ReplyType;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply }) => {
  const { mutate: toggleLikeReply } = useToggleReplyLikeMutation();

  const {
    isLiked: isReplyLiked,
    likesCount: replyLikesCount,
    throttledLike: throttledReplyLike,
  } = useOptimisticLike(reply.likes, toggleLikeReply, reply._id);

  return (
    <div className="flex gap-3.5 group">
      <Avatar className="w-9 h-9 ring-2 ring-slate-100">
        <AvatarImage
          src={reply.userId.profileImage}
          alt="User avatar"
          className="w-full h-full rounded-full object-cover"
        />
      </Avatar>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-baseline gap-2.5">
          <h5 className="font-semibold text-slate-900 text-[14px]">
            {reply.userId.firstName} {reply.userId.lastName}
          </h5>
          <span className="text-xs text-slate-400">
            {formatDate(reply.createdAt)}
          </span>
        </div>

        <p className="text-slate-700 text-[14px] leading-relaxed">
          {reply.description}
        </p>

        <button
          onClick={throttledReplyLike}
          className={`flex items-center gap-1.5 text-[13px] font-medium pt-1 transition-all ${
            isReplyLiked ? "text-red-500" : "text-slate-500 hover:text-red-500"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              isReplyLiked ? "fill-red-500 text-red-500" : ""
            }`}
            strokeWidth={1.5}
          />
          <span>{replyLikesCount}</span>
        </button>
      </div>
    </div>
  );
};

interface CommentInputProps {
  postId: string;
  replyingTo?: ReplyingTo | null;
  onClearReply?: () => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  replyingTo,
  onClearReply,
}) => {
  const { data } = useCurrentUserQuery();
  const user = data?.data;
  const [text, setText] = useState("");

  const { mutate: createComment } = useCreateCommentMutation();
  const { mutate: createReply } = useCreateReplyMutation();

  const handleSubmit = () => {
    if (!text.trim()) return;

    if (replyingTo) {
      const commentId = replyingTo.commentId;
      createReply({ postId, commentId, replyText: text });

      setText("");
      onClearReply?.();
    } else {
      createComment({ postId, commentText: text });
      setText("");
    }
  };

  const throttledSubmit = useThrottleFn(handleSubmit, 800);

  return (
    <div className="sticky bottom-0 bg-white border-t border-slate-200">
      {replyingTo && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-blue-900">
                Replying to {replyingTo.authorName}
              </p>
              <p className="text-xs text-blue-700 line-clamp-1">
                "{replyingTo.preview}..."
              </p>
            </div>
          </div>
          <button
            onClick={onClearReply}
            className="p-1.5 hover:bg-blue-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      )}

      <div className="flex items-start gap-4 px-6 py-5">
        <Avatar className="w-11 h-11 ring-2 ring-slate-100">
          <AvatarImage src={user?.profileImage} />
        </Avatar>

        <div className="flex-1 flex items-end gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
            className="flex-1 text-[15px] bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none placeholder:text-slate-400"
            rows={1}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />

          <button
            onClick={throttledSubmit}
            disabled={!text.trim()}
            className={`p-3 rounded-full transition-all ${
              text.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
