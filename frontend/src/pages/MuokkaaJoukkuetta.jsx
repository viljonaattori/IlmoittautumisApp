import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteTeam from "../components/DeleteTeam";
import useMembers from "../hooks/useMembers";

export default function MuokkaaJoukkuetta() {
  const [data, setData] = useState({ nimi: "", kuvaus: "" });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Haetaan joukkueen jäsenet ja tarkistetaan admin-oikeus
  const { members, fetchMembers } = useMembers();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    if (user && members.some((m) => m.id === user.id && m.is_admin)) {
      setIsAdmin(true);
    }
  }, [members, user]);

  // Haetaan joukkueen nykyiset tiedot
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/joukkueet/${user.joukkue_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Haku epäonnistui");
        const d = await res.json();
        setData({ nimi: d.nimi || "", kuvaus: d.kuvaus || "" });
      } catch {
        alert("Joukkueen tietojen haku epäonnistui");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

      {isAdmin && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Poista joukkue
          </Typography>
          <DeleteTeam
            teamId={user.joukkue_id}
            token={token}
            onDeleted={() => navigate("/")}
          />
        </>
      )}
    </Box>
  );
}
