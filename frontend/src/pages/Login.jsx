import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kirjautuminen epäonnistui");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/etusivu");
    } catch (err) {
      console.error("Login error:", err);
      setError("Palvelimeen ei saatu yhteyttä");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          {/* gutterBottom lisää automaattisesti marginaalia alareunan väliin */}
          IlmoittautumisApp
        </Typography>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="Sähköposti"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 5 }}
          >
            Kirjaudu
          </Button>
        </form>

        <Typography variant="h6">Uusi käyttäjä?</Typography>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/register")}
        >
          Rekisteröidy
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
