import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

// icons
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import MessageBubble from "./MessageBubble";
import { connectSocket } from "../services/socketIo";
import { postData } from "../services/FetchAllServices";

export default function ChatWindow({ user, onBack, isMobile }) {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const socket = useRef(null);
  const userData = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH OLD CHAT ================= */
  const FetchOldChat = async () => {
    if (!userData?.id || !user?.id) return;

    const body = {
      userId: userData.id,
      astrologerId: user.id,
    };

    const conversation = await postData("/api/chat/conversation", body)
    console.log(conversation.id)
    setConversationId(conversation.id);

    const chats = await postData("/api/chat/messages", {
      conversationId: conversation.id,
    });
console.log(chats)
    setMsg(chats || []);
  };

  useEffect(() => {
    FetchOldChat();
  }, [userData?.id, user?.id]);

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    socket.current = connectSocket();

    socket.current.on("connect", () => {
      socket.current.emit("join", userData.id);
    });

    socket.current.on("newMessage", (message) => {
  setMsg((prev) => {
    // Remove optimistic message with same tempId if exists
    const filtered = prev.filter((m) => m.optimistic !== true || m.id !== message.tempId);
    return [...filtered, message];
  });
});


    return () => {
      socket.current.disconnect();
    };
  }, []);

  /* ================= SEND MESSAGE ================= */
  const handleSendMsg = async () => {
  if (!text.trim() || !conversationId) return;

  const messagePayload = {
    conversationId,
    senderId: userData.id,
    receiverId: user.id,
    message: text,
  };

  setText(""); // clear input

  // Emit to server, server will save + emit back
  socket.current.emit("sendMessage", messagePayload);
};


  /* ================= UI ================= */
  if (!user)
    return <Box sx={{ flex: 1, p: 3 }}>Select a chat</Box>;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile && (
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          <Avatar sx={{ width: 40, height: 40, mr: 1 }}>
            <PersonIcon />
          </Avatar>

          <Typography variant="h6">{user.name}</Typography>
        </Box>

        <Box>
          <IconButton color="primary">
            <CallIcon />
          </IconButton>
          <IconButton color="primary">
            <VideocamIcon />
          </IconButton>
        </Box>
      </Box>

      {/* MESSAGES */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        {msg.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
      </Box>

      {/* INPUT */}
      <Box sx={{ display: "flex", p: 2, gap: 1 }}>
        <TextField
  fullWidth
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Type a message"
  onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
/>
<Button variant="contained" onClick={handleSendMsg}>Send</Button>

      </Box>
    </Box>
  );
}
