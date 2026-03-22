import axios from "axios";
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string, conversationId: string) => {
  const res = await axios.post(`/chat/${conversationId}/message`, { message });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const getUserConversations = async () => {
  const res = await axios.get("/chat/conversations");
  if (res.status !== 200) {
    throw new Error("Unable to fetch conversations");
  }
  const data = await res.data;
  return data;
};

export const getConversationChats = async (conversationId: string) => {
  const res = await axios.get(`/chat/${conversationId}`);
  if (res.status !== 200) {
    throw new Error("Unable to fetch chats for this conversation");
  }
  const data = await res.data;
  return data;
};

export const deleteConversation = async (conversationId: string) => {
  const res = await axios.delete(`/chat/${conversationId}`);
  if (res.status !== 200) {
    throw new Error("Unable to delete conversation");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};
