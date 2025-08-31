import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function Register() {
  const [joukkueet, setJoukkueet] = useState([]);
  const [email, setEmail] = useState("");
  const [nimi, setNimi] = useState("");
  const [password, setPassword] = useState("");
  const [joukkueId, setJoukkueId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // Haetaan joukkueet backista kun komponentti lataa
  useEffect(() => {
    fetch("http://localhost:3001/api/joukkueet")
      .then((res) => res.json())
      .then((data) => setJoukkueet(data))
      .catch((err) => console.error("joukkueet fetch error", err));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const body = { email, password, nimi, joukkue_id: joukkueId };

      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend palautti virheen
        setError(data.error || "Rekisteröinti epäonnistui");
        return;
      }

      // Onnistuminen käyttäjälle ja consoliin
      setSuccess("Käyttäjä luotu onnistuneesti!");
      console.log("REGISTER SUCCESS:", data);

      // Token local storageen
      localStorage.setItem("token", data.token);

      // Ohjataan käyttäjä takaisin kirjautumis sivulle
      window.location.href = "/";
    } catch (err) {
      console.error("register error", err);
      setError("Palvelimeen ei saatu yhteyttä");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Rekisteröidy
        </Typography>

        <form onSubmit={handleRegister} style={{ width: "100%" }}>
          <TextField
            label="Sähköposti"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Nimi"
            fullWidth
            margin="normal"
            value={nimi}
            onChange={(e) => setNimi(e.target.value)}
          />
          <TextField
            label="Salasana"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="joukkue-label">Joukkue</InputLabel>
            <Select
              labelId="joukkue-label"
              value={joukkueId}
              onChange={(e) => setJoukkueId(e.target.value)}
            >
              {joukkueet.map((j) => (
                <MenuItem key={j.id} value={j.id}>
                  {j.nimi}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
              {success}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Rekisteröidy
          </Button>
        </form>
      </Box>
    </Container>
  );
}
