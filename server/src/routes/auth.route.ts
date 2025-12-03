import { Router } from "express";
import {
  getCurentUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resendOtp,
  resetPassword,
  sendPasswordResetEmail,
  verifyOtp,
} from "../controllers/auth.controller";
import { authenticateUser, verifyAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", authenticateUser, logoutUser);
router.post("/refresh", refreshToken);

router.post("/verify-otp", verifyAuth, verifyOtp);
router.get("/resend-otp", verifyAuth, resendOtp);

router.post("/send-password-reset-email", sendPasswordResetEmail);
router.patch("/reset-password", resetPassword);

router.get("/me", authenticateUser, getCurentUser);

export default router;
