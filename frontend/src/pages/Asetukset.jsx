import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Asetukset() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [nimi, setNimi] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Nimen päivitys
  const handleUpdateName = async () => {
    const res = await fetch("http://localhost:3001/api/users/me/name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nimi }),
    });
    alert(res.ok ? "Nimi päivitetty!" : "Virhe nimen päivityksessä");
  };

  // Sähköpostin päivitys
  const handleUpdateEmail = async () => {
    const res = await fetch("http://localhost:3001/api/users/me/email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    alert(
      res.ok ? "Sähköposti päivitetty!" : "Virhe sähköpostin päivityksessä"
    );
  };

  // Salasanan vaihto
  const handleUpdatePassword = async () => {
    const res = await fetch("http://localhost:3001/api/users/me/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    alert(res.ok ? "Salasana vaihdettu!" : "Virhe salasanan vaihdossa");
  };

  // Tilin poisto
  const handleDeleteAccount = async () => {
    const res = await fetch("http://localhost:3001/api/users/me", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      localStorage.clear();
      alert("Käyttäjätili poistettu");
      navigate("/");
    } else {
      alert("Virhe tilin poistossa");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Asetukset
      </Typography>

      {/* Nimen päivitys */}
      <Typography variant="h6">Muuta nimeä</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Uusi nimi"
          value={nimi}
          onChange={(e) => setNimi(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleUpdateName}>
          Tallenna
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sähköpostin päivitys */}
      <Typography variant="h6">Muuta sähköpostia</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Uusi sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleUpdateEmail}>
          Tallenna
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Salasanan vaihto */}
      <Typography variant="h6">Vaihda salasana</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          label="Vanha salasana"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="Uusi salasana"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleUpdatePassword}>
          Vaihda salasana
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tilin poisto */}
      <Typography variant="h6" color="error">
        Poista käyttäjätili
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={() => setConfirmDelete(true)}
        sx={{ mt: 1 }}
      >
        Poista tili pysyvästi
      </Button>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Vahvista tilin poisto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Haluatko varmasti poistaa käyttäjätilisi? Tätä toimintoa ei voi
            peruuttaa.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Peruuta</Button>
          <Button color="error" onClick={handleDeleteAccount}>
            Poista
          </Button>
        </DialogActions>
      </Dialog>

      <Divider sx={{ my: 2 }} />

      <Button variant="outlined" onClick={() => navigate("/etusivu")}>
        Takaisin etusivulle
      </Button>
    </Box>
  );
}
