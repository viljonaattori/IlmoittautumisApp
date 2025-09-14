import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import emailValidator from "../utils/emailValidator";

export default function Join() {
  const { token } = useParams(); // Otetaan joukkueid parametreista
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joukkue, setJoukkue] = useState(null);
  const [email, setEmail] = useState("");
  const [nimi, setNimi] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);

  // Haetaan kutsun tiedot kun sivu avautuu
  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/invite/bytoken/${token}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Virhe kutsun haussa");
        setJoukkue(data.joukkue);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [token]);

  // Rekisteröinti linkin kautta
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // ääkkösten validointi
    if (!emailValidator(email)) {
      setError("Sähköpostiosoite ei saa sisältää ääkkösiä");
      return;
    }
    try {
      const body = {
        email,
        password,
        nimi,
        joukkue_id: joukkue.id,
      };

      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rekisteröinti epäonnistui");

      // Merkitään kutsu käytetyksi
      await fetch(`http://localhost:3001/api/invite/use/${token}`, {
        method: "POST",
      });

      setSuccess("Liittyminen onnistui!");
      localStorage.setItem("token", data.token);

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!joukkue) {
    return <Typography>Joukkuetta ei löytynyt.</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Sinut on kutsuttu liittymään joukkueeseen {joukkue.nimi}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Luo tunnukset ja liity mukaan!
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
            Liity joukkueeseen
          </Button>
        </form>
      </Box>
    </Container>
  );
}
