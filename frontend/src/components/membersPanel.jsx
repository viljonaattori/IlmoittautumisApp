import { Paper, Stack, Chip, Typography, Box, Button } from "@mui/material";
import { useState } from "react";

export default function MembersPanel({
  members = [],
  loading,
  error,
  onReload,
  isAdmin,
  onDeleteMember,
}) {
  const [copied, setCopied] = useState(false);

  const handleGetInvite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!members[0]) {
        alert("Joukkuetta ei löytynyt");
        return;
      }

      const teamId = members[0].joukkue_id; // käytetään joukkueen id:tä

      const res = await fetch(`http://localhost:3001/api/invite/${teamId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Virhe linkin luonnissa");

      // Kopioidaan leikepöydälle
      await navigator.clipboard.writeText(data.invitelink);

      // Näytetään ilmoitus painikkeessa
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h6">Joukkueen jäsenet</Typography>
        {onReload && (
          <Button size="small" onClick={onReload}>
            Päivitä
          </Button>
        )}
      </Box>

      {loading && <Typography variant="body2">Ladataan jäseniä…</Typography>}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {!loading && !error && members.length === 0 && (
        <Typography variant="body2">Ei jäseniä.</Typography>
      )}

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mt={1}>
        {members.map((m) => (
          <Chip
            key={m.id}
            label={m.is_admin ? `${m.nimi} (admin)` : m.nimi}
            variant={m.is_admin ? "filled" : "outlined"}
            color={m.is_admin ? "secondary" : "default"}
            title={m.email}
            onDelete={
              isAdmin && !m.is_admin ? () => onDeleteMember(m.id) : undefined
            }
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleGetInvite}
        >
          {copied ? "Linkki kopioitu!" : "Kopioi liittymislinkki"}
        </Button>
      </Box>
    </Paper>
  );
}
