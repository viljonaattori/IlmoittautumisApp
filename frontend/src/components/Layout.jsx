import { Box, Container } from "@mui/material";
import AppBar from "./components/AppBar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Ylävalikko */}
      <AppBar />

      {/* Sivun sisältö */}
      <Container sx={{ flex: 1, mt: 2 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
