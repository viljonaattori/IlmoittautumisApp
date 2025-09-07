import { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Grid } from "@mui/material";
import AppBar from "../components/AppBar";
import MembersPanel from "../components/membersPanel";
import TulevatTapahtumat from "../components/TulevatTapahtumat";
import MenneetTapahtumat from "../components/MenneetTapahtumat";

function Etusivu() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [members, setMembers] = useState([]);
  const [memLoading, setMemLoading] = useState(false);
  const [memError, setMemError] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
      console.log("Token:", token);
    }
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setMemLoading(true);
      setMemError(null);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/joukkueet/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Virhe haussa");
      setMembers(data.members || []);
    } catch (e) {
      setMemError(e.message);
    } finally {
      setMemLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // takaisin login-sivulle
  };

  return (
    <Container maxWidth="lg">
      {/* AppBar koko leveys */}
      <AppBar joukkueNimi={user?.joukkue_nimi} onLogout={handleLogout} />

      {/* Jos AppBar on position="fixed", tämä työntää sisällön alas AppBarin korkeuden verran */}
      <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />

      {/* Jaetaan etusivu kahteen osaan */}
      <Grid
        container
        columnSpacing={12}
        rowSpacing={4}
        alignItems="flex-start"
        mt={2}
      >
        <Grid item xs={12} md={6} sx={{ pr: 6 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              Tervetuloa {user?.nimi ? user.nimi : "!"}
            </Typography>

            <TulevatTapahtumat />
          </Box>
        </Grid>

        {/* Jäsenlista */}
        <Grid item xs={12} md={6} sx={{ pr: 6 }}>
          <Box>
            <MembersPanel
              members={members}
              loading={memLoading}
              error={memError}
              onReload={fetchMembers}
            />
            <MenneetTapahtumat />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Etusivu;
