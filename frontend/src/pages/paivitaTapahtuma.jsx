import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";

export default function PaivitaTapahtuma() {
  const { tapahtumaId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [data, setData] = useState({
    tyyppi: "",
    paikka: "",
    aika: "",
    kuvaus: "",
  });

  // Tapahtuman tyypit
  const Tyypit = [
    { value: "harjoitus", label: "Harjoitus" },
    { value: "peli", label: "Peli" },
    { value: "palaveri", label: "Palaveri" },
    { value: "kokous", label: "Kokous" },
  ];

  // Haetaan olemassa olevat tiedot
  useEffect(() => {
    fetch(`http://localhost:3001/api/tapahtumat/${tapahtumaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Virhe haettaessa tapahtumaa");
        return r.json();
      })
      .then((d) =>
        setData({
          tyyppi: d.tyyppi || "",
          paikka: d.paikka || "",
          aika: d.aika || "",
          kuvaus: d.kuvaus || "",
        })
      )
      .catch((err) => alert(err.message));
  }, [tapahtumaId, token]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...data,
      // Muunnetaan aika tietokannan haluamaan muotoon
      aika: new Date(data.aika).toISOString().slice(0, 19).replace("T", " "),
    };

    const res = await fetch(
      `http://localhost:3001/api/tapahtumat/${tapahtumaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      }
    );
    if (res.ok) {
      navigate("/etusivu");
    } else {
      alert("Tapahtuman päivitys epäonnistui");
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        mx: { xs: 2, sm: 5, md: "auto" }, // responsiiviset marginaalit
        maxWidth: 600,
      }}
    >
      <Button
        sx={{ mb: 4 }}
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/etusivu")}
      >
        Takaisin etusivulle
      </Button>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Muokkaa tapahtumaa
      </Typography>

      <TextField
        select
        label="Tyyppi"
        name="tyyppi"
        value={data.tyyppi}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        {Tyypit.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Paikka"
        name="paikka"
        value={data.paikka}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Aika"
        name="aika"
        type="datetime-local"
        value={data.aika}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        label="Kuvaus"
        name="kuvaus"
        value={data.kuvaus || ""}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Tallenna muutokset
      </Button>
    </Box>
  );
}
