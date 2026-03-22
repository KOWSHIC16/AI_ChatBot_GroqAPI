import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteConversation,
  getConversationChats,
  getUserConversations,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ConversationMeta = {
  id: string;
  title: string;
  updatedAt: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("new");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);
    try {
      const chatData = await sendChatRequest(content, activeConversationId);
      setChatMessages([...chatData.conversation.chats]);
      
      if (activeConversationId === "new") {
        setActiveConversationId(chatData.conversation.id);
        const convData = await getUserConversations();
        setConversations(convData.conversations);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message: API Key may be invalid or missing credits.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (activeConversationId === "new") return;
    try {
      toast.loading("Deleting Chat Session", { id: "deletechats" });
      await deleteConversation(activeConversationId);
      setChatMessages([]);
      setActiveConversationId("new");
      const convData = await getUserConversations();
      setConversations(convData.conversations);
      toast.success("Deleted Chat Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chat failed", { id: "deletechats" });
    }
  };

  const startNewChat = () => {
    setActiveConversationId("new");
    setChatMessages([]);
  };

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    toast.loading("Loading Chat", { id: "loadchat" });
    try {
      const data = await getConversationChats(id);
      setChatMessages(data.conversation.chats);
      toast.success("Loaded Chat", { id: "loadchat" });
    } catch (err) {
      console.log(err);
      toast.error("Loading chat failed", { id: "loadchat" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading History", { id: "loadchats" });
      getUserConversations()
        .then((data) => {
          setConversations(data.conversations);
          toast.success("Successfully loaded past chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "80vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
            p: 2,
            overflowY: "auto",
          }}
        >
          <Button
            onClick={startNewChat}
            sx={{
              width: "100%",
              mb: 3,
              color: "white",
              fontWeight: "600",
              bgcolor: "#19c37d",
              ":hover": {
                bgcolor: "#12955f",
              },
            }}
          >
            + New Chat
          </Button>

          {conversations.map((conv) => (
            <Button
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              sx={{
                width: "100%",
                mb: 1,
                color: "white",
                bgcolor: activeConversationId === conv.id ? "#343541" : "transparent",
                border: "1px solid #343541",
                justifyContent: "flex-start",
                textTransform: "none",
                textAlign: "left",
              }}
            >
              {conv.title}
            </Button>
          ))}

          <Button
            onClick={handleDeleteConversation}
            disabled={activeConversationId === "new"}
            sx={{
              width: "100%",
              mt: "auto",
              color: "#DBD8E3",
              fontWeight: "700",
              borderRadius: 3,
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
              ":disabled": {
                bgcolor: "gray",
              }
            }}
          >
            Clear Active Chat
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "#DBD8E3",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - Llama 3.1 (via Groq)
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
          {isTyping && (
            <Box
              sx={{
                display: "flex",
                p: 2,
                bgcolor: "#004d5612",
                gap: 2,
                borderRadius: 2,
                my: 1,
                alignItems: "center",
              }}
            >
              <Avatar sx={{ ml: "0" }}>
                <img src="openai.png" alt="openai" width={"30px"} />
              </Avatar>
              <Typography
                sx={{
                  fontSize: "20px",
                  color: "white",
                  animation: "pulse 1.5s infinite",
                }}
              >
                <style>
                  {`
                    @keyframes pulse {
                      0% { opacity: 0.4; }
                      50% { opacity: 1; }
                      100% { opacity: 0.4; }
                    }
                  `}
                </style>
                Exploring...
              </Typography>
            </Box>
          )}
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          {" "}
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "#DBD8E3",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "#DBD8E3", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
