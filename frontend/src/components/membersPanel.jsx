import { Paper, Stack, Chip, Typography, Box, Button } from "@mui/material";

export default function membersPanel({
  members = [],
  loading,
  error,
  onReload,
}) {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
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
            label={m.nimi}
            variant={m.is_admin ? "filled" : "outlined"}
            color={m.is_admin ? "secondary" : "default"}
            title={m.email}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>

      <Typography
        variant="caption"
        sx={{ display: "block", mt: 1, opacity: 0.8 }}
      >
        Puuttuuko joku? Lisää adminin kautta.
      </Typography>
    </Paper>
  );
}
