import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

function DeleteTeam({ teamId, token, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Haluatko varmasti poistaa joukkueen?")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/joukkueet/${teamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Poisto epäonnistui");
        setLoading(false);
        return;
      }

      if (onDeleted) onDeleted();
    } catch (err) {
      console.error("Poistovirhe: ", err);
      alert("Virhe palvelinyhteydessä");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      disabled={loading}
      onClick={handleDelete}
    >
      {loading ? <CircularProgress size={24} /> : "Poista joukkue"}
    </Button>
  );
}

export default DeleteTeam;
