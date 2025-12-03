import type {
  CloudinarySignatureResponse,
  CloudinaryUploadedMedia,
  SavedMediaInDB,
} from "@/hooks/api/types";
import type { AxiosResponse } from "axios";
import { MediaURL } from "@/api/config";
import { api } from "@/lib";

async function getSignature(): Promise<CloudinarySignatureResponse> {
  const { data }: AxiosResponse = await api.get(MediaURL.signature);
  return data.data;
}

// Upload file to Cloudinary
async function uploadToCloudinary(
  file: File,
  sig: CloudinarySignatureResponse
): Promise<CloudinaryUploadedMedia> {
  const formData = new FormData();

  formData.append("file", file);
  console.log("timestamp :: ", sig.timestamp);
  formData.append("timestamp", sig.timestamp.toString());
  formData.append("signature", sig.signature);
  formData.append("api_key", sig.apiKey);

  const { data } = await api.post(
    MediaURL.uploadToCloudinary(sig.cloudName),
    formData,
    {
      withCredentials: false,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  console.log("data in cloudinary :: ", data);
  return data;
}

const saveMediaInDB = async (
  media: CloudinaryUploadedMedia
): Promise<SavedMediaInDB> => {
  console.log("media :: ", media);
  const { data }: AxiosResponse<{ data: SavedMediaInDB }> = await api.post(
    MediaURL.upload,
    media
  );
  return data.data;
};

export const MediaAPI = {
  getSignature,
  uploadToCloudinary,
  saveMediaInDB,
};
