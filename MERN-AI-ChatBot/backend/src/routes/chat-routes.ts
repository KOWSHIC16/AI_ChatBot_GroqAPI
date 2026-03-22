import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import {
  deleteConversation,
  generateChatCompletion,
  getUserConversations,
  getConversationChats
} from "../controllers/chat-controllers.js";

//Protected API
const chatRoutes = Router();
chatRoutes.post(
  "/:conversationId/message",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);
chatRoutes.get("/conversations", verifyToken, getUserConversations);
chatRoutes.get("/:conversationId", verifyToken, getConversationChats);
chatRoutes.delete("/:conversationId", verifyToken, deleteConversation);

export default chatRoutes;