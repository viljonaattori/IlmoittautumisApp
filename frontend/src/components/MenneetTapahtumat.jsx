import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function MenneetTapahtumat() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://ilmoittautumisapp.onrender.com/api/tapahtumat/menneet",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Virhe haettaessa menneitä tapahtumia");
        setEvents(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6">Menneet tapahtumat</Typography>
      <List>
        {events.map((e) => (
          <ListItem key={e.id}>
            <ListItemText
              primary={`${e.tyyppi} | ${e.paikka}`}
              secondary={`${new Date(e.aika).toLocaleString()} — ${
                e.kuvaus || ""
              }`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default MenneetTapahtumat;
