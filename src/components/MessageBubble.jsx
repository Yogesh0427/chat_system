import { Box } from "@mui/material";

export default function MessageBubble({ msg }) {
  return (
    <Box
      sx={{
        mb: 1,
        display: "flex",
        justifyContent: msg.from === "me" ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: msg.from === "me" ? "#DCF8C6" : "#FFF",
          maxWidth: "60%",
        }}
      >
        {msg.text}
      </Box>
    </Box>
  );
}
