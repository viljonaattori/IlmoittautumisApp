import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import AppBar from "./AppBar";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar joukkueNimi={user?.joukkue_nimi} onLogout={handleLogout} />

      <Box sx={(t) => ({ ...t.mixins.toolbar })} />

      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
