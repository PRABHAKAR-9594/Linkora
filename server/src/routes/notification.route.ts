import express from "express";
import { getNotifications } from "../controllers/notification.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticateUser, getNotifications);

export default router;
