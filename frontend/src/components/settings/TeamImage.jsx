import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";

export default function TeamImage({ token }) {
  const [joukkueId, setJoukkueId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Hae joukkueen id ja nykyinen kuva
  useEffect(() => {
    const fetchTeamData = async () => {
      const res = await fetch(
        "https://ilmoittautumisapp.onrender.com/api/joukkueet/members",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setJoukkueId(data.joukkue_id);

        // Haetaan nykyinen kuva
        const teamRes = await fetch(
          `https://ilmoittautumisapp.onrender.com/api/joukkueet/${data.joukkue_id}/kuva`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          if (teamData.kuva) {
            setPreviewUrl(
              `https://ilmoittautumisapp.onrender.com${teamData.kuva}`
            );
          }
        }
      }
    };
    fetchTeamData();
  }, [token]);

  // Kun valitaan uusi kuva
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Esikatselu
    }
  };

  // Lähetä uusi kuva palvelimelle
  const handleUpload = async () => {
    if (!selectedImage || !joukkueId) return;
    const formData = new FormData();
    formData.append("kuva", selectedImage);

    const res = await fetch(
      `https://ilmoittautumisapp.onrender.com/api/joukkueet/${joukkueId}/kuva`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (res.ok) {
      const data = await res.json();
      setPreviewUrl(`https://ilmoittautumisapp.onrender.com${data.path}`);
      setSelectedImage(null);
      alert("Joukkueen kuva päivitetty!");
    } else {
      alert("Virhe kuvan tallennuksessa");
    }
  };

  // Poista nykyinen kuva
  const handleDelete = async () => {
    if (!joukkueId) return;
    const res = await fetch(
      `https://ilmoittautumisapp.onrender.com/api/joukkueet/${joukkueId}/kuva`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setPreviewUrl("");
      setSelectedImage(null);
      alert("Kuva poistettu!");
    } else {
      alert("Virhe kuvan poistossa");
    }
  };

  return (
    <>
      <Typography variant="h6">Joukkueen kuva</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <Box
          component="img"
          src={previewUrl || "/no-image.png"}
          alt="Joukkueen kuva"
          sx={{ width: 200, borderRadius: 2, objectFit: "cover" }}
        />
        <Button variant="outlined" component="label">
          Valitse uusi kuva
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedImage}
          >
            Tallenna kuva
          </Button>
          {previewUrl && (
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Poista kuva
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
