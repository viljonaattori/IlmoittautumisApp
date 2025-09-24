import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function PasswordForm({ token }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  return (
    <>
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
    </>
  );
}
