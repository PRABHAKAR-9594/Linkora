import { ProfileAPI } from "@/features/profile/api/profile.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EditProfilePayload } from "../validation";
import { toast } from "sonner";
import { handleAxiosError } from "@/utils";
import { api } from "@/lib";

export const useUpdateProfileMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditProfilePayload) =>
      ProfileAPI.updateProfileDetails(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile updated!");
    },
    onError: handleAxiosError,
  });
};

export const useFetchSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: () => api.get("/sessions"),
    staleTime: 0,
    gcTime: 1000 * 60 * 1,
  });
};

export const useSessionLogOutMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      deviceName,
    }: {
      sessionId: string;
      deviceName: string;
    }) => api.delete(`/sessions/${sessionId}`),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
      toast.success(`Logout from device ${variables.deviceName}`);
    },
  });
};

export const useLogOutAllSessions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete("/sessions/logout-all-except-current"),
    onSuccess: () => {
      toast.success("Logged Out from all sessions.");
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};
