import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Stack,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

// Tapahtuman tyypit
const Tyypit = [
  { value: "harjoitus", label: "Harjoitus" },
  { value: "peli", label: "Peli" },
  { value: "palaveri", label: "Palaveri" },
  { value: "kokous", label: "Kokous" },
];

export default function TapahtumaForm({ onCreated }) {
  const [tyyppi, setTyyppi] = useState("harjoitus");
  const [paikka, setPaikka] = useState("");
  const [aika, setAika] = useState(""); // yyyy-MM-ddThh:mm
  const [kuvaus, setKuvaus] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const reset = () => {
    setTyyppi("harjoitus");
    setPaikka("");
    setAika("");
    setKuvaus("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const dt = new Date(aika);
    if (dt < new Date()) {
      setError("Aika ei ole kelvollinen.");
      return;
    }

    // Perusvalidoinnit
    if (!tyyppi || !paikka || !aika) {
      setError("Täytä vähintään tyyppi, paikka ja aika.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      // muunnetaan aika sopivaksi sql muotoon
      const dt = new Date(aika);
      const pad = (n) => String(n).padStart(2, "0");
      const mysqlDateTime = `${dt.getFullYear()}-${pad(
        dt.getMonth() + 1
      )}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:00`;

      const res = await fetch("http://localhost:3001/api/tapahtumat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tyyppi,
          paikka,
          aika: mysqlDateTime,
          kuvaus: kuvaus || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tallennus epäonnistui");

      setSuccess("Tapahtuma luotu onnistuneesti!");
      reset();
      onCreated?.(data);
      reset();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardHeader title="Uusi tapahtuma" />
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <CardContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              select
              label="Tapahtuman tyyppi"
              value={tyyppi}
              onChange={(e) => setTyyppi(e.target.value)}
              required
              fullWidth
            >
              {Tyypit.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Paikka"
              value={paikka}
              onChange={(e) => setPaikka(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Aika"
              type="datetime-local"
              value={aika}
              onChange={(e) => setAika(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              inputProps={{
                min: new Date().toISOString().slice(0, 16), // estetää tapahtuman luonti menneeseen aikaan
              }}
            />

            <TextField
              label="Kuvaus (valinnainen)"
              value={kuvaus}
              onChange={(e) => setKuvaus(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={saving}
          >
            Luo tapahtuma
          </Button>
          <Button onClick={reset} disabled={saving}>
            Tyhjennä
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
