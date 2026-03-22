import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postData } from "../../services/FetchAllServices";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState(""); // success | error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        setMessage("");

        try {
            setLoading(true);

            const res = await postData("/api/adminLogin", formData);

            // ✅ SUCCESS
            setType("success");
            setMessage(res.message);

            localStorage.setItem("user", JSON.stringify(res.user));

            setTimeout(() => {
                navigate("/header");
            }, 1000);

        } catch (err) {
            console.log("FULL ERROR:", err);

            const data = err?.response?.data;

            // ❌ ERROR
            setType("error");
            setMessage(data?.message || "Network / Server issue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 380, mx: "auto", mt: 10, p: 4, boxShadow: 4, borderRadius: 3 }}>
            
            <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
                Admin Login
            </Typography>

            {/* ✅ Message */}
            {message && (
                <Alert severity={type} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            <TextField
                fullWidth
                label="Email or Mobile"
                name="email"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
            />

            <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
            />

            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? "Logging..." : "Login"}
            </Button>

        </Box>
    );
}