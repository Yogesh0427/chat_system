import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Chat System/pages/Login"
import Signup from "./Chat System/pages/Signup";
import Chat from "./Chat System/pages/Chat";
import AdminLogin from "./Admin Dashboard/pages/AdminLogin";
import Header from "./Admin Dashboard/components/Header";

export default function App() {
  const isLoggedIn = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/header" element={<Header />} />
        <Route path="/chatlogin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
