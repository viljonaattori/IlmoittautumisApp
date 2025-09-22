// components/TapahtumaCard.jsx
import {
  Box,
  Grid,
  Stack,
  Chip,
  Typography,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import BuildIcon from "@mui/icons-material/Build";

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
  canDelete = false,
  onDeleted,
  onEditEvent,
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Poistetaanko tapahtuma?")) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/tapahtumat/${e.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Poisto epäonnistui");
      onDeleted?.(e.id); // ilmoita parentille
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box key={e.id} sx={{ py: 1.25 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={e.tyyppi} color={typeColor(e.tyyppi)} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {e.paikka}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2">{fmt(e.aika)}</Typography>
            </Stack>

            {e.kuvaus && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {e.kuvaus}
              </Typography>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
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
          </Stack>
        </Grid>

        {/* Napit oikealle */}
        <Grid item xs={12} md={4}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            alignItems="center"
            sx={{ height: "100%" }}
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

            {canDelete && (
              <Tooltip title="Poista tapahtuma">
                <span>
                  <IconButton
                    aria-label="poista"
                    color="error"
                    onClick={handleDelete}
                    disabled={deleting}
                    size="small"
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {onEditEvent && (
              <Tooltip title="Muokkaa tapahtumaa">
                <IconButton
                  aria-label="muokkaa"
                  color="primary"
                  onClick={() => onEditEvent(e.id)}
                  size="small"
                >
                  <BuildIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Grid>
      </Grid>

      {idx < total - 1 && <Divider sx={{ mt: 1.25 }} />}
    </Box>
  );
}
