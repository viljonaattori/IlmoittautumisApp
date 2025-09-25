import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function ResetoiSalasana() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/auth/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Salasana vaihdettu. Voit kirjautua sisään.");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setMessage(data.error || "Virhe salasanan vaihdossa.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Aseta uusi salasana
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Uusi salasana"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Vaihda salasana
        </Button>
      </form>

      {message && (
        <Typography sx={{ mt: 2 }} color="success.main">
          {message}
        </Typography>
      )}
    </Box>
  );
}
