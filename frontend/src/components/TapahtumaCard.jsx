// components/TapahtumaCard.jsx
import {
  Box,
  Grid,
  Stack,
  Chip,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// Värit eri tapahtumille
const typeColor = (t) => {
  switch (t) {
    case "peli":
      return "primary";
    case "harjoitus":
      return "success";
    case "palaveri":
      return "info";
    case "kokous":
      return "warning";
    default:
      return "default";
  }
};

const fmt = (isoLike) =>
  new Date(isoLike).toLocaleString("fi-FI", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TapahtumaCard({
  e,
  idx,
  total,
  savingId,
  handleRespond,
}) {
  return (
    <Box key={e.id} sx={{ py: 1.25 }}>
      <Grid container spacing={2} alignItems="stretch">
        {/* Tiedot */}
        <Grid item xs={12} md={8}>
          <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
            <Chip size="small" label={e.tyyppi} color={typeColor(e.tyyppi)} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {e.paikka}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">{fmt(e.aika)}</Typography>
          </Stack>

          {e.kuvaus && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {e.kuvaus}
            </Typography>
          )}
        </Grid>

        {/* Nappulat */}
        <Grid item xs={12} md={4}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
          >
            <Button
              size="small"
              variant={e.oma_status === "osallistun" ? "contained" : "outlined"}
              color="success"
              startIcon={<CheckIcon />}
              onClick={() => handleRespond(e.id, "osallistun")}
              disabled={savingId === e.id}
            >
              Osallistun
            </Button>
            <Button
              size="small"
              variant={
                e.oma_status === "en_osallistu" ? "contained" : "outlined"
              }
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => handleRespond(e.id, "en_osallistu")}
              disabled={savingId === e.id}
            >
              En osallistu
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Tilastot */}
      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Chip
          size="small"
          color="success"
          label={`Osallistujia: ${e.osallistujat || 0}`}
        />
        <Chip
          size="small"
          color="error"
          label={`Ei osallistu: ${e.ei_osallistujat || 0}`}
        />
      </Stack>

      {idx < total - 1 && <Divider sx={{ mt: 1.25 }} />}
    </Box>
  );
}
