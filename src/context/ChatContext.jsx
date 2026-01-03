import { createContext, useContext, useState, useEffect } from "react";
import socket from "../services/socket";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});

  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!userData?.id) return;

    // 🟢 Join room
    socket.emit("join", userData.id);

    // 🔹 Receive message
    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        const conv = prev[data.conversationId] || [];
        return { ...prev, [data.conversationId]: [...conv, data] };
      });
    });

    // 🔹 Typing status
    socket.on("typing", ({ conversationId, senderId, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [conversationId]: isTyping ? senderId : null,
      }));
    });

    // 🔹 Online users
    socket.on("online_users", (users) => {
      setOnlineUsers(users); // {userId: true/false}
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("online_users");
    };
  }, [userData?.id]);

  return (
    <ChatContext.Provider
      value={{ messages, setMessages, typingUsers, onlineUsers }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
