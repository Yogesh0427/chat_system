import { Box, useMediaQuery } from "@mui/material";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useEffect, useState } from "react";
import { postData } from "../services/FetchAllServices";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatSugestionList, setChatSugestionList] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const role = userData?.role;

  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchAllChatSugetion = async () => {
    try {
      console.log("Fetching chat users...");
      const res = await postData("/api/chat/fetch_all_chaters", { role });
      console.log(res);
      if (res) setChatSugestionList(res);
    } catch (err) {
      console.error("Fetch chat users error:", err);
    }
  };

  useEffect(() => {
    fetchAllChatSugetion();
  }, [role]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* LEFT: CHAT LIST */}
      {(!isMobile || !selectedUser) && (
        <ChatList
          chatSugestionList={chatSugestionList}
          onSelect={setSelectedUser}
          isMobile={isMobile}
        />
      )}

      {/* RIGHT: CHAT WINDOW */}
      {(!isMobile || selectedUser) && (
        <ChatWindow
          user={selectedUser}
          isMobile={isMobile}
          onBack={() => setSelectedUser(null)}
        />
      )}
    </Box>
  );
}
