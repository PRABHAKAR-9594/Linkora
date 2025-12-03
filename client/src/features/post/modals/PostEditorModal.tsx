import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostEditorSchema, type PostEditorPayload } from "../validation";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closePostModal } from "@/store/slices/postEditorModal.slice";
import { useCurrentUserQuery } from "@/hooks/api/useUser";

import { usePostMediaUpload } from "../hooks/usePostMediaUpload";
import { useCreatePostMutation } from "../hooks/usePost";

const PostEditorModal = () => {
  const { isOpen } = useSelector((state: any) => state.postModal);
  const dispatch = useDispatch();
  const { data: user } = useCurrentUserQuery();

  const [isExpanded, setIsExpanded] = useState(false);

  const {
    files,
    getRootProps,
    getInputProps,
    removeFile,
    uploadAll,
    resetFiles,
    uploadStatus,
  } = usePostMediaUpload(5);

  const createPost = useCreatePostMutation();

  const form = useForm<PostEditorPayload>({
    resolver: zodResolver(PostEditorSchema),
    defaultValues: { description: "", mediaIds: [] },
  });

  const handleSubmit = async (values: PostEditorPayload) => {
    const mediaIds = await uploadAll();

    createPost.mutate(
      { ...values, mediaIds },
      {
        onSuccess: () => {
          toast.success("Post created!");
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!uploadStatus && !createPost.isPending) {
      form.reset();
      resetFiles();
      dispatch(closePostModal());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-xl p-0 rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader className="p-4">
              <DialogTitle className="text-center">Create Post</DialogTitle>
            </DialogHeader>

            <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-11 h-11 ring-2 ring-slate-100">
                  <AvatarImage
                    src={user?.profileImage}
                    alt="User avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="font-semibold text-primary/80">@{user?.userName}</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What's on your mind?"
                          className={`p-4 resize-none ${
                            isExpanded ? "min-h-[280px]" : "min-h-[120px]"
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between px-4 pb-2">
                  <span>
                    {form.watch("description")?.length || 0} characters
                  </span>
                  <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="ghost"
                    size="sm"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3" /> Compact
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3" /> Expand
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div
                {...getRootProps()}
                className=" p-6 rounded-xl text-center cursor-pointer"
              >
                <input {...getInputProps()} />
                <p>Drag & drop or click to upload files</p>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="relative group rounded-md overflow-hidden aspect-square"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={file.preview}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <video
                          src={file.preview}
                          className="object-cover w-full h-full"
                        />
                      )}

                      <button
                        onClick={() => removeFile(file.name)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between p-3">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !files.length && !form.watch("description") && uploadStatus
                }
              >
                Post
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PostEditorModal;
