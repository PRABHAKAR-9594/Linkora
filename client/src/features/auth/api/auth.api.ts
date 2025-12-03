import { api } from "@/lib";
import { AuthURL } from "@/api/config";

import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types";

export const AuthAPI = {
  register: async (data: RegisterPayload) => {
    const res = await api.post(AuthURL.register, data);
    return res.data;
  },

  login: async (data: LoginPayload) => {
    const res = await api.post(AuthURL.login, data);
    return res.data;
  },
  sendPasswordRestLink: async (payload: ForgotPasswordPayload) => {
    const res = await api.post(AuthURL.sendResetLink, payload);
    return res.data;
  },

  resetForgetPassword: async (data: ResetPasswordPayload) => {
    const res = await api.patch(AuthURL.resetPassword, data);
    return res.data;
  },

  verifyOtp: async (data: VerifyOtpPayload) => {
    const res = await api.post(AuthURL.verifyOtp, data);
    return res.data;
  },

  resendOtp: async () => {
    const res = await api.get(AuthURL.resendOtp);
    return res.data;
  },
};
