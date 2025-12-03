import express from "express";
import {
  createStory,
  deleteStory,
  getFriendsStories,
  getMyStories,
  viewStory,
} from "../controllers/story.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticateUser, createStory);
router.patch("/view-story/:storyId", authenticateUser, viewStory);
router.get("/get-my-stories", authenticateUser, getMyStories);
router.get("/get-story-by-friends", authenticateUser, getFriendsStories);
router.delete("/:storyId", authenticateUser, deleteStory);

export default router;
