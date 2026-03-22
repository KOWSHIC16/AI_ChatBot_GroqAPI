import mongoose from "mongoose";
import { randomUUID } from "crypto";
const chatSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => randomUUID(),
  },
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
    },
    title: {
      type: String,
      default: "New Chat",
    },
    chats: [chatSchema],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  conversations: [conversationSchema],
});

export default mongoose.model("User", userSchema);