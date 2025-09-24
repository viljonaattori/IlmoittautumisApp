import { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountSection({ token }) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    <>
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
    </>
  );
}
