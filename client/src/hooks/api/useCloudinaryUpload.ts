import { useMutation } from "@tanstack/react-query";
import type { UploadResult } from "./types";
import { MediaAPI } from "@/api/shared/media.api";

export const useCloudinaryUpload = () => {
  return useMutation({
    mutationFn: async ({
      file,
      saveToDB = true,
    }: {
      file: File;
      saveToDB?: boolean;
    }): Promise<UploadResult> => {
      const sig = await MediaAPI.getSignature();
      const uploaded = await MediaAPI.uploadToCloudinary(file, sig);
      if (saveToDB) {
        const media = await MediaAPI.saveMediaInDB(uploaded);
        return { uploaded, media };
      }
      return { uploaded };
    },
  });
};
