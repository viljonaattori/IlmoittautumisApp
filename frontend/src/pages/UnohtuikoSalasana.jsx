import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function UnohtuikoSalasana() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      "https://ilmoittautumisapp.onrender.com/api/auth/passwordReset",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Unohtuiko salasana?
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Sähköposti"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Lähetä palautuslinkki
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
