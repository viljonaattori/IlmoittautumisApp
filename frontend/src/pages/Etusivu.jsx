// src/pages/Etusivu.jsx
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import MembersPanel from "../components/membersPanel";
import TulevatTapahtumat from "../components/TulevatTapahtumat";
import MenneetTapahtumat from "../components/MenneetTapahtumat";

export default function Etusivu() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [memLoading, setMemLoading] = useState(false);
  const [memError, setMemError] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
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

  // Tarkistetaan onko käyttäjä YP
  const isAdmin = user && members.some((m) => m.id === user.id && m.is_admin);

  return (
    <Box>
      <Grid container columnSpacing={8} rowSpacing={4} alignItems="flex-start">
        <Grid item xs={12} md={7}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Tervetuloa {user?.nimi ?? "!"}
          </Typography>
          {/* Välitä canDelete vain ylläpitäjälle */}
          <TulevatTapahtumat canDelete={isAdmin} />
        </Grid>

        <Grid item xs={12} md={5}>
          <MembersPanel
            members={members}
            loading={memLoading}
            error={memError}
            onReload={fetchMembers}
          />
          <Box sx={{ mt: 3 }}>
            <MenneetTapahtumat />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
