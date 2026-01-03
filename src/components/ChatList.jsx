import {
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { users } from "../data/users";
import { useState } from "react";

export default function ChatList({ onSelect, isMobile,chatSugestionList}) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: {
          xs: "100%",   // mobile
          sm: 280,      // tablet
          md: 320,      // desktop
        },
        borderRight: "1px solid #ddd",
        height: "100vh",
      }}
    >
      {/* 🔍 Search */}
      <Box sx={{ p: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* 👥 User List */}
      <List>
        {chatSugestionList?.map((u) => (
          <ListItem
            button
            key={u.id}
            onClick={() => onSelect(u)}
            sx={{ gap: 1 }}
          >
            {/* 👤 Avatar / Icon */}
            <Avatar src={u.avatar || ""}>
              {!u.avatar && <PersonIcon />}
            </Avatar>

            <ListItemText
              primary={u.name}
              secondary={u.online ? "Online" : "Offline"}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
