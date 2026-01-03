import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { messages } from "../data/messages";
import MessageBubble from "./MessageBubble";
import { useState } from "react";

// icons
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ChatWindow({ user,onBack,isMobile }) {
  const [text, setText] = useState("");

  if (!user)
    return <Box sx={{ flex: 1, p: 3 }}>Select a chat</Box>;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      
      {/* 🟢 CHAT HEADER */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Back + DP + Name */}
  <Box sx={{ display: "flex", alignItems: "center" }}>
    
    {/* 🔙 BACK ARROW (mobile only) */}
    {isMobile && (
      <IconButton onClick={onBack} sx={{ mr: 1 }}>
        <ArrowBackIcon />
      </IconButton>
    )}

    <Avatar
      src={user.avatar || ""}
      sx={{ width: 40, height: 40, mr: 1 }}
    >
      {!user.avatar && <PersonIcon />}
    </Avatar>

    <Typography variant="h6">{user.name}</Typography>
  </Box>

        {/* Right: Call Icons */}
        <Box>
          <IconButton
            color="primary"
            onClick={() => {
              // 🔴 AUDIO CALL API / WEBRTC connect here
              console.log("Audio call");
            }}
          >
            <CallIcon />
          </IconButton>

          <IconButton
            color="primary"
            onClick={() => {
              // 🔴 VIDEO CALL API / WEBRTC connect here
              console.log("Video call");
            }}
          >
            <VideocamIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 💬 CHAT MESSAGES */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        {messages[user.id]?.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
      </Box>

      {/* ✍️ MESSAGE INPUT */}
      <Box sx={{ display: "flex", p: 2, gap: 1 }}>
        <TextField
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <Button
          variant="contained"
          onClick={() => {
            // 🔴 SEND MESSAGE API / SOCKET connect here
            console.log("Send message:", text);
            setText("");
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
