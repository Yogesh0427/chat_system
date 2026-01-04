import { Box, Typography } from "@mui/material";

export default function MessageBubble({ msg }) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const isMe = msg.sender_id === userData?.id;

  // Format created_at to hh:mm
  const createdAt = msg.created_at ? new Date(msg.created_at) : new Date();
  const hours = createdAt.getHours().toString().padStart(2, "0");
  const minutes = createdAt.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  return (
    <Box
      sx={{
        mb: 1,
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          p: 1.2,
          borderRadius: 2,
          bgcolor: isMe ? "#DCF8C6" : "#FFF",
          maxWidth: "60%",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <Typography sx={{ wordBreak: "break-word" }}>{msg.message}</Typography>
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: "#555",
            textAlign: "right",
            mt: 0.3,
          }}
        >
          {timeStr}
        </Typography>
      </Box>
    </Box>
  );
}
