import { useEffect, useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import AppBar from "../components/AppBar";

function Etusivu() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
      console.log("Token:", token);
    }
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // takaisin login-sivulle
  };

  return (
    <Container maxWidth="md">
      <Box py={6}>
        <AppBar joukkueNimi={user?.joukkue_nimi} /> {/* väliteteään propsina */}
        <Typography variant="h4" gutterBottom>
          Tervetuloa {user?.nimi ? user.nimi : "!"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Tämä on etusivu. Tänne voidaan listata esim. oman joukkueesi tulevat
          tapahtumat tai pikalinkit.
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Kirjaudu ulos
        </Button>
      </Box>
    </Container>
  );
}

export default Etusivu;
