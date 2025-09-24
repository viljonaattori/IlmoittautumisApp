import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import MembersPanel from "../components/membersPanel";
import TulevatTapahtumat from "../components/TulevatTapahtumat";
import MenneetTapahtumat from "../components/MenneetTapahtumat";
import TapahtumaForm from "../components/TapahtumaForm";
import { useNavigate } from "react-router-dom";
import DeleteTeam from "../components/DeleteTeam";
import useMembers from "../hooks/useMembers";

export default function Etusivu() {
  const [user, setUser] = useState(null);
  const [teamLogo, setTeamLogo] = useState(""); // ✅ joukkueen logo
  const [refreshTick, setRefreshTick] = useState(0);
  const navigate = useNavigate();

  const {
    members,
    loading: memLoading,
    error: memError,
    fetchMembers,
    deleteMember,
  } = useMembers();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  // ✅ Hae joukkueen logo kun käyttäjä on saatu
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user?.joukkue_id) return;

    const fetchLogo = async () => {
      const res = await fetch(
        `http://localhost:3001/api/joukkueet/${user.joukkue_id}/kuva`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.kuva) {
          setTeamLogo(`http://localhost:3001${data.kuva}`);
        } else {
          setTeamLogo(""); // ei kuvaa
        }
      }
    };

    fetchLogo();
  }, [user]);

  const isAdmin = user && members.some((m) => m.id === user.id && m.is_admin);

  const handleCreated = () => setRefreshTick((t) => t + 1);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={6} alignItems="flex-start">
        <Grid item xs>
          {/* Otsikko ja joukkueen logo */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            {teamLogo && (
              <Box
                component="img"
                src={teamLogo}
                alt="Joukkueen logo"
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #444",
                }}
              />
            )}
            <Typography variant="h4">Tervetuloa {user?.nimi ?? "!"}</Typography>
          </Box>

          {isAdmin && (
            <Box sx={{ mb: 3 }}>
              <TapahtumaForm onCreated={handleCreated} />
            </Box>
          )}

          <Box sx={{ mt: 3, maxHeight: 500, overflowY: "auto" }}>
            <TulevatTapahtumat
              canDelete={isAdmin}
              refreshSignal={refreshTick}
              {...(isAdmin && {
                onEditEvent: (tapahtumaId) =>
                  navigate(`/paivitaTapahtuma/${tapahtumaId}`),
              })}
            />
          </Box>
        </Grid>

        <Grid item sx={{ width: 400 }}>
          <MembersPanel
            members={members}
            loading={memLoading}
            error={memError}
            onReload={fetchMembers}
            isAdmin={isAdmin}
            onDeleteMember={deleteMember}
          />

          <Box sx={{ mt: 3, maxHeight: 280, overflowY: "auto" }}>
            <MenneetTapahtumat />
          </Box>

          {isAdmin && (
            <Box sx={{ paddingTop: 5 }}>
              <DeleteTeam
                teamId={user?.joukkue_id}
                token={localStorage.getItem("token")}
                onDeleted={() => navigate("/")}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
