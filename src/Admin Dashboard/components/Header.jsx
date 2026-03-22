import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    Menu,
    MenuItem
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/adminlogin");
    };

    return (
        <AppBar position="static" sx={{ px: 3, bgcolor: "#1976d2" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                {/* 🔹 Left - Stylish Title */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        letterSpacing: 1.5,
                        fontFamily: "Poppins, sans-serif"
                    }}
                >
                    Lifescope
                </Typography>

                {/* 🔹 Right - User */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.3}
                    sx={{ cursor: "pointer" }}
                    onClick={handleMenuOpen}
                >
                    {/* 👤 Name */}
                    <Typography
                        sx={{
                            color: "#dbd1cc",
                            fontWeight: 600,
                            fontSize: "18px"
                        }}
                    >
                        {user?.name || "Admin"}
                    </Typography>

                    {/* 🖼 Avatar */}
                    <Avatar src={user?.profile || ""}>
                        {user?.name?.charAt(0)}
                    </Avatar>
                </Box>

                {/* 🔽 Dropdown */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: "bottom",   // 👇 profile ke niche
                        horizontal: "right"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            navigate("/profile");
                        }}
                    >
                        Profile
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            handleLogout();
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>

            </Toolbar>
        </AppBar>
    );
}