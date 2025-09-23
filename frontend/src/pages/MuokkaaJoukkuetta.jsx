import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MuokkaaJoukkuetta() {
  const [data, setData] = useState({ nimi: "", kuvaus: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Haetaan joukkueen nykyiset tiedot
  useEffect(() => {
    fetch(`http://localhost:3001/api/joukkueet/${user.joukkue_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => setData({ nimi: d.nimi || "", kuvaus: d.kuvaus || "" }))
      .catch(() => alert("Joukkueen tietojen haku epäonnistui"))
      .finally(() => setLoading(false));
  }, [token, user.joukkue_id]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // Tietojen päivitys
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:3001/api/joukkueet/${user.joukkue_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (res.ok) {
      alert("Joukkueen tiedot päivitetty!");
      navigate("/etusivu");
    } else {
      alert("Päivitys epäonnistui");
    }
  };

  if (loading) return <Typography>Ladataan...</Typography>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, mx: "auto", maxWidth: 600 }}
    >
      <Button
        sx={{ mb: 3 }}
        variant="outlined"
        onClick={() => navigate("/etusivu")}
      >
        Takaisin etusivulle
      </Button>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Muokkaa joukkueen tietoja
      </Typography>

      <TextField
        label="Joukkueen nimi"
        name="nimi"
        value={data.nimi}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="Joukkueen kuvaus"
        name="kuvaus"
        value={data.kuvaus || ""}
        onChange={handleChange}
        fullWidth
        multiline
        minRows={2}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Tallenna muutokset
      </Button>
    </Box>
  );
}
