import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Chip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

import PersonIcon from "@mui/icons-material/Person"
import CallIcon from "@mui/icons-material/Call"
import VideocamIcon from "@mui/icons-material/Videocam"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AccessTimeIcon from "@mui/icons-material/AccessTime"

import MessageBubble from "./MessageBubble";
import { connectSocket } from "../services/socketIo";
import { postData } from "../services/FetchAllServices";

export default function ChatWindow({ user, onBack, isMobile }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);

  const socket = useRef(null);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("user"));

  /* ================= SOCKET INIT (ONLY ONCE) ================= */
  useEffect(() => {
    socket.current = connectSocket();

    socket.current.emit("join", userData.id);
    socket.current.emit("addUser", userData.id);

    socket.current.on("getOnlineUsers", setOnlineUsers);

    socket.current.on("newMessage", (msg) => {
      
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
      );
    });

    socket.current.on("messageStatus", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId || m.tempId === messageId
            ? { ...m, status }
            : m
        )
      );
    });

    socket.current.on("typing", ({ conversationId, senderId, isTyping }) => {
      if (senderId !== userData.id) {
        setTyping(isTyping);
      }
    });

    return () => socket.current.disconnect();
  }, []);

  /* ================= FETCH CHAT ================= */
  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      const conv = await postData("/api/chat/conversation", {
        userId: userData.id,
        astrologerId: user.id,
      });

      setConversationId(conv.id);
      socket.current.emit("joinConversation", conv.id);

      const chats = await postData("/api/chat/messages", {
        conversationId: conv.id,
      });

      setMessages(chats || []);
    })();
  }, [user?.id]);

  /* ================= SEEN + SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    if (conversationId) {
      socket.current.emit("seen", {
        conversationId,
        userId: userData.id,
      });
    }
  }, [messages]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  /* ================= SEND ================= */
  const handleSend = () => {
    if (!text.trim() || timeLeft <= 0) return;

    const tempId = Date.now();

    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     tempId,
    //     message: text,
    //     sender_id: userData.id,
    //     status: "sent",
    //   },
    // ]);

    socket.current.emit("sendMessage", {
      conversationId,
      senderId: userData.id,
      receiverId: user.id,
      message: text,
    });

    setText("");
  };

  /* ================= TYPING (INSTANT) ================= */
  const handleTyping = (e) => {
    setText(e.target.value);

    socket.current.emit("typing", {
      conversationId,
      senderId: userData.id,
      receiverId: user.id,
      isTyping: true,
    });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.current.emit("typing", {
        conversationId,
        senderId: userData.id,
        receiverId: user.id,
        isTyping: false,
      });
    }, 700);
  };

  const isOnline = onlineUsers.includes(user?.id);

  const handlePayment = () => {
    alert("Payment Successful")
    setTimeLeft(120)
  };

  if (!user) return <Box p={3}>Select chat</Box>

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          {isMobile && (
            <IconButton onClick={onBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar><PersonIcon /></Avatar>
          <Box>
            <Typography fontWeight={600}>{user.name}</Typography>
            <Typography
              variant="caption"
              color={typing ? "primary" : isOnline ? "green" : "gray"}
            >
              {typing ? "Typing..." : isOnline ? "Online" : "Offline"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            icon={<AccessTimeIcon />}
            label={timeLeft > 0 ? formatTime(timeLeft) : "Ended"}
            color={timeLeft < 30 ? "error" : "primary"}
            sx={{ fontWeight: 600 }}
          />
          <IconButton><CallIcon /></IconButton>
          <IconButton><VideocamIcon /></IconButton>
        </Box>
      </Box>

      {/* CHAT */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
        <div ref={bottomRef} />
      </Box>

      {/* INPUT / PAYMENT */}
      <Box sx={{ p: 2 }}>
        {timeLeft > 0 ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              value={text}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
            />
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </Box>
        ) : (
          <Button fullWidth variant="contained" color="success" onClick={handlePayment}>
            Pay & Continue Chat
          </Button>
        )}
      </Box>
    </Box>
  );
}
