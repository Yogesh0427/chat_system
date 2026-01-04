import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postData } from '../services/FetchAllServices';

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Signup submit
  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await postData("/api/signup", formData);
      const user = res.user; // backend returns { message, user }

      // ✅ Save user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      alert(res.message || "Signup successful");

      // ✅ Redirect based on role (optional)
      navigate("/chat");

    } catch (error) {
      // console.error(error);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

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
        Signup
      </Typography>

      {/* Name */}
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
      />

      {/* Mobile */}
      <TextField
        fullWidth
        label="Mobile"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        margin="normal"
      />

      {/* Email */}
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
      />

      {/* Password */}
      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
      />

      {/* Role */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="astrologer">Astrologer</MenuItem>
        </Select>
      </FormControl>

      {/* Submit */}
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Signing up..." : "Signup"}
      </Button>
    </Box>
  );
}
