// src/pages/Etusivu.jsx
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
  const [refreshTick, setRefreshTick] = useState(0);
  const navigate = useNavigate();

  // kaikki jäsenlogiikka hoituu hookissa
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

  const isAdmin = user && members.some((m) => m.id === user.id && m.is_admin);

  const handleCreated = () => setRefreshTick((t) => t + 1);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={6} alignItems="flex-start">
        <Grid item xs>
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
