import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import TapahtumaCard from "./TapahtumaCard";

export default function TulevatTapahtumat({
  canDelete = false,
  refreshSignal,
  onEditEvent,
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/tapahtumat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Virhe haettaessa tapahtumia");
      setEvents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshSignal]);

  const handleRespond = async (id, status) => {
    const token = localStorage.getItem("token");
    const prev = events;
    setEvents(
      prev.map((e) => (e.id === id ? { ...e, oma_status: status } : e))
    );
    setSavingId(id);

    try {
      const res = await fetch(
        `http://localhost:3001/api/tapahtumat/${id}/osallistuminen`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tallennus epäonnistui");

      // Haetaan päivittynyt data
      await fetchEvents();
    } catch (e) {
      setEvents(prev);
      alert(e.message);
    } finally {
      setSavingId(null);
    }
  };

  // Tapahtumakortin poistaminen
  const handleDeleted = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, minWidth: 500 }}>
      <CardHeader title="Tulevat tapahtumat" />
      <CardContent>
        {loading && <CircularProgress size={24} />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && events.length === 0 && (
          <Typography sx={{ opacity: 0.8 }}>Ei tulevia tapahtumia.</Typography>
        )}
        {!loading && !error && events.length > 0 && (
          <Box>
            {events.map((e, idx) => (
              <TapahtumaCard
                key={e.id}
                e={e}
                idx={idx}
                total={events.length}
                savingId={savingId}
                handleRespond={handleRespond}
                canDelete={canDelete}
                onDeleted={handleDeleted}
                onEditEvent={onEditEvent}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
