import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Grid,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

export default function TulevatTapahtumat() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/tapahtumat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Virhe haettaessa tapahtumia");
      setEvents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRespond = async (id, status) => {
    const token = localStorage.getItem("token");

    // Optimistinen päivitys (näytä valinta heti)
    const prev = events;
    setEvents(
      prev.map((e) => (e.id === id ? { ...e, oma_status: status } : e))
    );
    setSavingId(id);

    try {
      const res = await fetch(
        `http://localhost:3001/api/tapahtumat/${id}/osallistuminen`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tallennus epäonnistui");
    } catch (e) {
      // Rollback jos virhe
      setEvents(prev);
      alert(e.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Tulevat tapahtumat"
        action={
          <IconButton onClick={fetchEvents} aria-label="päivitä">
            <RefreshIcon />
          </IconButton>
        }
        sx={{ pb: 0.5 }}
      />
      <CardContent sx={{ pt: 1 }}>
        {loading && <CircularProgress size={24} />}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && events.length === 0 && (
          <Typography sx={{ opacity: 0.8 }}>Ei tulevia tapahtumia.</Typography>
        )}

        {!loading && !error && events.length > 0 && (
          <Box>
            {events.map((e, idx) => (
              <Box key={e.id} sx={{ py: 1.25 }}>
                <Grid container spacing={2} alignItems="stretch">
                  {/* Vasemman laidan tiedot */}
                  <Grid item xs={12} md={8}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Chip
                        size="small"
                        label={e.tyyppi}
                        color={typeColor(e.tyyppi)}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {e.paikka}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2">{fmt(e.aika)}</Typography>
                    </Stack>

                    {e.kuvaus && (
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {e.kuvaus}
                      </Typography>
                    )}
                  </Grid>

                  {/* Oikean laidan napit */}
                  <Grid item xs={12} md={4}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent={{ xs: "flex-start", md: "flex-end" }}
                    >
                      <Button
                        size="small"
                        variant={
                          e.oma_status === "osallistun"
                            ? "contained"
                            : "outlined"
                        }
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={() => handleRespond(e.id, "osallistun")}
                        disabled={savingId === e.id}
                        sx={{
                          ...(e.oma_status === "osallistun" && {
                            backgroundColor: "success.main",
                            color: "white",
                            "&:hover": { backgroundColor: "success.dark" },
                          }),
                        }}
                      >
                        Osallistun
                      </Button>
                      <Button
                        size="small"
                        variant={
                          e.oma_status === "en_osallistu"
                            ? "contained"
                            : "outlined"
                        }
                        color="error"
                        startIcon={<CloseIcon />}
                        onClick={() => handleRespond(e.id, "en_osallistu")}
                        disabled={savingId === e.id}
                        sx={{
                          ...(e.oma_status === "en_osallistu" && {
                            backgroundColor: "error.main",
                            color: "white",
                            "&:hover": { backgroundColor: "error.dark" },
                          }),
                        }}
                      >
                        En osallistu
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>

                {idx < events.length - 1 && <Divider sx={{ mt: 1.25 }} />}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
