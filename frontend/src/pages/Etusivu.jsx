// src/pages/Etusivu.jsx
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import MembersPanel from "../components/membersPanel";
import TulevatTapahtumat from "../components/TulevatTapahtumat";
import MenneetTapahtumat from "../components/MenneetTapahtumat";
import TapahtumaForm from "../components/TapahtumaForm";

export default function Etusivu() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [memLoading, setMemLoading] = useState(false);
  const [memError, setMemError] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);

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
      const res = await fetch(
        "https://ilmoittautumisapp.onrender.com/api/joukkueet/members",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Virhe haussa");
      setMembers(data.members || []);
    } catch (e) {
      setMemError(e.message);
    } finally {
      setMemLoading(false);
    }
  };

  const isAdmin = user && members.some((m) => m.id === user.id && m.is_admin);

  const handleCreated = () => setRefreshTick((t) => t + 1);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={6} alignItems="flex-start">
        <Grid item xs>
          {/* vasen sisältö */}
          <Typography variant="h4" sx={{ mb: 3 }}>
            Tervetuloa {user?.nimi ?? "!"}
          </Typography>
          {isAdmin && (
            <Box sx={{ mb: 3 }}>
              <TapahtumaForm onCreated={handleCreated} />
            </Box>
          )}
          <Box sx={{ mt: 3, maxHeight: 500, overflowY: "auto" }}>
            <TulevatTapahtumat
              canDelete={isAdmin}
              refreshSignal={refreshTick}
            />
          </Box>
        </Grid>

        <Grid item sx={{ width: 400 }}>
          <MembersPanel
            members={members}
            loading={memLoading}
            error={memError}
            onReload={fetchMembers}
          />
          <Box sx={{ mt: 3, maxHeight: 300, overflowY: "auto" }}>
            <MenneetTapahtumat />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
