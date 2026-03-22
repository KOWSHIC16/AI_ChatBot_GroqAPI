import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  const { conversationId } = req.params;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not registered OR Token malfunctioned" });

    // Find or create conversation
    let conversation;
    if (conversationId === "new") {
      conversation = {
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        chats: []
      };
      user.conversations.push(conversation);
      conversation = user.conversations[user.conversations.length - 1]; 
    } else {
      conversation = user.conversations.find(c => c.id === conversationId);
      if (!conversation) return res.status(404).json({ message: "Conversation not found" });
    }

    const chats = conversation.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message, role: "user" });
    conversation.chats.push({ content: message, role: "user" });

    const config = configureOpenAI();
    const openai = new OpenAIApi(config);
    const chatResponse = await openai.createChatCompletion({
      model: "llama-3.1-8b-instant",
      messages: chats,
    });
    conversation.chats.push(chatResponse.data.choices[0].message);
    await user.save();
    return res.status(200).json({ conversation });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).send("User not registered OR Token malfunctioned");
    if (user._id.toString() !== res.locals.jwtData.id) return res.status(401).send("Permissions didn't match");

    const conversations = user.conversations.map(c => ({
      id: c.id,
      title: c.title,
      //@ts-ignore
      updatedAt: c.updatedAt
    })).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return res.status(200).json({ message: "OK", conversations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const getConversationChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).send("User not registered");

    const conversation = user.conversations.find(c => c.id === conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    return res.status(200).json({ message: "OK", conversation });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).send("User not registered");

    //@ts-ignore
    user.conversations = user.conversations.filter(c => c.id !== conversationId);
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};