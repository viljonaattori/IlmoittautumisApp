import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function UserNameForm({ token }) {
  const [nimi, setNimi] = useState("");

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

  return (
    <>
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
    </>
  );
}
