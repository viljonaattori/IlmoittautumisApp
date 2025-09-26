import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import TapahtumaFilter from "../components/TapahtumaFilter";
import TapahtumaList from "../components/TapahtumatList";

export default function Tapahtumat() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/api/tapahtumat/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Virhe tapahtumien haussa");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        alert("Tapahtumien haku epäonnistui");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Suodatettu lista
  const filteredEvents = events.filter((e) => {
    const matchType =
      selectedTypes.length === 0 || selectedTypes.includes(e.tyyppi);
    const matchSearch =
      e.paikka.toLowerCase().includes(search.toLowerCase()) ||
      (e.kuvaus || "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const types = [...new Set(events.map((e) => e.tyyppi))];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Kaikki tapahtumat
      </Typography>

      <TapahtumaFilter
        types={types}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        search={search}
        setSearch={setSearch}
      />

      <TapahtumaList events={filteredEvents} />
    </Box>
  );
}
