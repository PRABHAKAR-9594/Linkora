import { useAppDispatch, useAppSelector, useClickOutside } from "@/hooks";
import {
  closePostViewModal,
  getIsPostViewOpen,
  getPost,
} from "@/store/slices/postViewModal.slice";
import { CommentLayout, PersonAvatar } from "@/components/layout";
import React, { useRef } from "react";

import Media from "../components/Media";
import { AnimatePresence, motion } from "framer-motion";
import { CommentInput } from "@/components/layout/CommentLayout";
import { formatDate } from "@/utils";

const ViewPostModal: React.FC = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const post = useAppSelector(getPost);
  const isOpen = useAppSelector(getIsPostViewOpen);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useClickOutside(modalRef, () => dispatch(closePostViewModal()));

  const handleScrollToClose = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      dispatch(closePostViewModal());
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div
        ref={modalRef}
        className="flex md:flex-row flex-col w-full sm:w-[85vw] max-w-[1200px] h-screen md:h-[80vh] overflow-hidden rounded-xl shadow-2xl"
      >
        <div className="hidden md:flex w-[60%] h-full bg-black items-center justify-center">
          <div>
            <Media media={post.media} post={post} />
          </div>
        </div>

        {!isMobile && (
          <div className="w-full md:w-[40%] flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b">
              <PersonAvatar image={post?.userId?.profileImage} view={false} />
              <div className="min-w-0">
                <p className="text-foreground font-semibold text-sm sm:text-base truncate">
                  {post?.userId?.userName || "Unknown User"}{" "}
                  <span className="text-muted-foreground font-normal text-xs sm:text-sm">
                    •{" "}
                    {post?.createdAt ? formatDate(post.createdAt) : "Recently"}
                  </span>
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm truncate">
                  {post?.userId?.firstName} {post?.userId?.lastName || "Member"}
                </p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <CommentLayout postId={post._id} />
            </div>
          </div>
        )}

        {isMobile && (
          <AnimatePresence>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "15%" }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute bottom-0 left-0 w-full h-[85vh] bg-zinc-800 rounded-t-xl shadow-xl flex flex-col"
            >
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 300 }}
                dragElastic={0.06}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 140) dispatch(closePostViewModal());
                }}
                className="cursor-grab active:cursor-grabbing flex justify-center py-3"
              >
                <div className="w-12 h-1.5 bg-gray-500 rounded-full"></div>
              </motion.div>

              <div
                ref={scrollRef}
                onScroll={handleScrollToClose}
                className="flex-1 overflow-y-auto px-2"
              >
                <CommentLayout postId={post._id} />
              </div>

              <div className="border-t border-gray-700">
                <CommentInput postId={post._id} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default React.memo(ViewPostModal);
