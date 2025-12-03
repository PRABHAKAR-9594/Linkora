import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { LandingLayout, MainLayout } from "@/components/layout";
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyOtpPage,
} from "@/features/auth";
import { LandingPage } from "@/features/landing";
import { HomePage } from "@/features/home";
import { ProfilePage } from "@/features/profile";
import SettingsPage from "@/features/settings/pages/SettingPage";
import NotFound from "@/components/feedback/NotFound";
import { ExplorePage } from "@/features/explore";
import NotificationPage from "@/features/notifications/pages/NotificationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  {
    path: "/auth",
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "verify-otp", element: <VerifyOtpPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/home", index: true, element: <HomePage /> },
      // added question mark ( ? ) at the end of the userName
      // so we can access both self profile and other users profile
      { path: "/profile/:userName?", element: <ProfilePage /> },
      { path : "/notifications", element : <NotificationPage/>},
      { path: "/settings", element: <SettingsPage /> },
      { path: "/explore", element: <ExplorePage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
