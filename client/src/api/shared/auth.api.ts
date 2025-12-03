import {  AuthURL } from "../config";
import { api } from "@/lib";

export const AuthAPI = {
  getCurrentUser: async () => {
    const { data } = await api.get(AuthURL.me);
    return data.data;
  },
  logout: async () => {
    const res = await api.post(AuthURL.logout);
    return res.data;
  },
};
