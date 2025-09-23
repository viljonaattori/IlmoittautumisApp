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
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import emailValidator from "../utils/emailValidator";
import logo from "/Images/logo.png";

export default function Register() {
  const [joukkueet, setJoukkueet] = useState([]);
  const [email, setEmail] = useState("");
  const [nimi, setNimi] = useState("");
  const [password, setPassword] = useState("");
  const [joukkueId, setJoukkueId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mode, setMode] = useState("join");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  const navigate = useNavigate();

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
        mode,
        joukkue_id: mode === "join" ? joukkueId : null,
        new_team_name: mode === "create" ? newTeamName : null,
        new_team_kuvaus: mode === "create" ? newTeamDescription : null,
      };

      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Rekisteröinti epäonnistui");
        return;
      }

      // Onnistuminen käyttäjälle ja consoliin
      setSuccess("Luonti onnistui!");
      console.log("REGISTER SUCCESS:", data);

      // Token local storageen
      localStorage.setItem("token", data.token);

      // pieni viive että käyttäjä näkee onnistuneen rekisteröinnin
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("register error", err);
      setError("Palvelimeen ei saatu yhteyttä");
    }
  };

  return (
    <Container maxWidth="sm">
      <IconButton
        onClick={() => navigate("/")}
        sx={{ position: "absolute", top: 16, left: 16, color: "white" }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
        marginTop={5}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: "150px", marginBottom: 20 }}
        />
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

          {/* Valinta: Liity tai Luo uusi */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="mode-label">Valinta</InputLabel>
            <Select
              labelId="mode-label"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <MenuItem value="join">
                Liity olemassa olevaan joukkueeseen
              </MenuItem>
              <MenuItem value="create">Luo uusi joukkue</MenuItem>
            </Select>
          </FormControl>

          {/* Näytetään joukkueen valinta vain jos mode=join */}
          {mode === "join" && (
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
          )}

          {/* Näytetään uuden joukkueen nimi jos mode=create */}
          {mode === "create" && (
            <>
              <TextField
                label="Uuden joukkueen nimi"
                fullWidth
                margin="normal"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />

              <TextField
                label="Uuden joukkueen kuvaus"
                fullWidth
                margin="normal"
                multiline // sallii useamman rivin
                minRows={2} // vähintään kaksi riviä korkeutta
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </>
          )}

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
