import {
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postData } from "../services/FetchAllServices";

export default function Login() {
  const navigate = useNavigate();

  // ✅ controlled state
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ login submit
  const handleLogin = async () => {

    try {
  setLoading(true);

  const res = await postData("/api/login", formData);

  // ✅ backend returns { message, user }
  const user = res.user;

  if (!user) {
    alert(res.message || "Login failed");
    return;
  }

  // ✅ save user
  localStorage.setItem("user", JSON.stringify(user));

  // ✅ navigate to chat
  navigate("/chat");

} catch (error) {
  console.error(error);
  alert(error.response?.data?.message || "Login failed");
} finally {
  setLoading(false);
}
}

  return (
    <Box
      sx={{
        maxWidth: 380,
        mx: "auto",
        mt: 10,
        p: 3,
        borderRadius: 3,
        boxShadow: 3
      }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate("/signup")}
      >
        Signup
      </Button>
    </Box>
  );
}
