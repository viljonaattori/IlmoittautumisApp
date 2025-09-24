import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function EmailForm({ token }) {
  const [email, setEmail] = useState("");

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

  return (
    <>
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
    </>
  );
}
