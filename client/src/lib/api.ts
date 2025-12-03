import axios, { AxiosError } from "axios";
import queryClient from "./queryClient";
import { socket } from "./socket";
import { toast } from "sonner";

const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : // : "http://192.168.0.100:4000";
      "http://localhost:4000";

export const api = axios.create({
  withCredentials: true,
  baseURL: `${BACKEND_URL}/api/v1`,
});
let isLoggingOut = false;

async function logout() {
  if (isLoggingOut) return;
  isLoggingOut = true;

  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
  } catch (_) {}

  queryClient.clear();
  socket.disconnect();
  localStorage.clear();
  window.location.href = "/auth/login";
}

// ------------------------------------------
// Refresh Token Queue
// ------------------------------------------
let isRefreshing = false;
let pendingRequests: Array<(token?: string) => void> = [];

const queueRequest = (cb: (token?: string) => void) => {
  pendingRequests.push(cb);
};

const resolveQueue = () => {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
};

const skipUrls = [
  "/auth/register",
  "/auth/login",
  "/auth/force-login",
  "/auth/verify-otp",
  "/auth/send-password-link",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/logout",
];

// ------------------------------------------
// Axios Response Interceptor
// ------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as any;

    if (skipUrls.some((u) => error.config?.url?.includes(u))) {
      return Promise.reject(error);
    }

    // NETWORK ERROR
    if (!error.response) {
      toast.error("Network error. Check your connection.");
      return Promise.reject(error);
    }

    // 401 Unauthorized → Refresh token attempt
    if (status === 401 && !original._retry && !isLoggingOut) {
      console.log("Refreshing...");
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queueRequest(() => api(original).then(resolve).catch(reject));
        });
      }

      isRefreshing = true;

      try {
        await api.post("/auth/refresh", {}, { withCredentials: true });

        isRefreshing = false;
        resolveQueue();

        // retry original request
        return api(original);
      } catch (refreshError) {
        isRefreshing = false;
        pendingRequests = [];

        if (!isLoggingOut) {
          toast.error("Your session has expired. Logging out...");
        }
        await logout();

        // await logout(); // centralized logout
        return Promise.reject(refreshError);
      }
    }

    // OTHER ERRORS
    switch (status) {
      case 429:
        toast.error("Too many requests. Slow down.");
        break;
      case 404:
        toast.error("Resource not found.");
        break;
      case 500:
        toast.error("Server error. Try again later.");
        break;
      default:
        // Change the toast message with console.error() in production
        console.log("Refreshing...............");
        toast.error(error.response?.statusText || "Something went wrong.");
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
