import { Box, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
export default function MessageBubble({ msg }) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const isMe = msg.sender_id === userData?.id;

  // 🕒 time format
  const createdAt = msg.created_at ? new Date(msg.created_at) : new Date();
  const hours = createdAt.getHours().toString().padStart(2, "0");
  const minutes = createdAt.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  /* ================= MESSAGE STATUS ICON ================= */
  const renderStatus = () => {
    if (!isMe) return null; // receiver side pe tick nahi

    if (msg.status === "pending") {
      return <AccessTimeIcon sx={{ fontSize: 16, color: "#888" }} />
    }

    if (msg.status === "sent") {
      return <DoneIcon sx={{ fontSize: 16, color: "#888" }} />;
    }

    if (msg.status === "delivered") {
      return <DoneAllIcon sx={{ fontSize: 16, color: "#888" }} />;
    }

    if (msg.status === "seen") {
      return <DoneAllIcon sx={{ fontSize: 16, color: "#1e88e5" }} />;
    }

    return null;
  };

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
        }}
      >
        {/* MESSAGE */}
        <Typography sx={{ wordBreak: "break-word" }}>
          {msg.message}
        </Typography>

        {/* TIME + STATUS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 0.5,
            mt: 0.3,
          }}
        >
          <Typography sx={{ fontSize: "0.7rem", color: "#555" }}>
            {timeStr}
          </Typography>

          {renderStatus()}
        </Box>
      </Box>
    </Box>
  );
}
