import express from "express";
import userProfile from "../controllers/users/userProfile.controller";
import loadChat from "../controllers/chats/loadChat.controller";
import getUsers from "../controllers/users/getUsers.controller";
import handleWebhook from "../controllers/webhooks/webhook.controller";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleWebhook
);
router.get("/user/profile",authMiddleware.getAuthenticatedUser, userProfile);
router.post("/user/getChatId", authMiddleware.getAuthenticatedUser, loadChat.getChatId);
router.post("/user/loadChat",authMiddleware.getAuthenticatedUser, loadChat.loadChat);
router.get("/getUsers",authMiddleware.getAuthenticatedUser, getUsers);
export default router;
