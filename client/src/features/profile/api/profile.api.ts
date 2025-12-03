import type { AxiosResponse } from "axios";
import { api } from "@/lib";
import { ProfileURL } from "@/api/config";
import type { EditProfilePayload } from "@/features/settings/validation";

export const ProfileAPI = {
  updateProfileDetails: async (payload: EditProfilePayload) => {
    const { data }: AxiosResponse = await api.patch(ProfileURL.update, payload);
    return data;
  },

  updateProfilePicture: async (imageUrl: string) => {
    const { data }: AxiosResponse = await api.patch(ProfileURL.updateImage, {
      secureUrl: imageUrl,
    });
    return data;
  },

  deleteAccount: async () => {
    const { data }: AxiosResponse = await api.delete(ProfileURL.delete);
    return data;
  },

  fetchUserDetails: async (userId: string) => {
    const { data }: AxiosResponse = await api.get(
      ProfileURL.userDetail(userId)
    );
    return data;
  },
  fetchUserFriends: async (userId: string) => {
    const { data }: AxiosResponse = await api.get(ProfileURL.friends(userId));
    return data;
  },

  sendFriendRequest: async (receiverId: string) => {
    const { data }: AxiosResponse = await api.post(
      ProfileURL.sendRequest(receiverId)
    );
    return data;
  },

  acceptFriendRequest: async (senderId: string) => {
    const { data }: AxiosResponse = await api.post(
      ProfileURL.acceptRequest(senderId)
    );
    return data;
  },

  cancelFriendRequest: async (receiverId: string) => {
    const { data }: AxiosResponse = await api.post(
      ProfileURL.cancelRequest(receiverId)
    );
    return data;
  },

  rejectFriendRequest: async (senderId: string) => {
    const { data }: AxiosResponse = await api.post(
      ProfileURL.rejectRequest(senderId)
    );
    return data;
  },

  removeFriend: async (friendId: string) => {
    const { data }: AxiosResponse = await api.delete(
      ProfileURL.removeFriend(friendId)
    );
    return data;
  },

  searchUsers: async (search: string) => {
    const { data }: AxiosResponse = await api.get(
      ProfileURL.searchUsers(search)
    );
    return data;
  },
};
