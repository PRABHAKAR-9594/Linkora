import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import {
  getSessions,
  deleteSession,
  logoutAllExceptCurrent,
} from "../controllers/session.controller";

const router = Router();

router.get("/", authenticateUser, getSessions);
router.delete("/:sessionId", authenticateUser, deleteSession);
router.delete(
  "/logout-all-except-current",
  authenticateUser,
  logoutAllExceptCurrent
);

export default router;
