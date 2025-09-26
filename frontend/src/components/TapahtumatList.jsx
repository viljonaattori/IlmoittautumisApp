import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

export default function TapahtumaList({ events }) {
  if (events.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Ei tapahtumia valituilla suodattimilla.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {events.map((event) => (
        <Grid item xs={12} md={6} lg={4} key={event.id}>
          <Card
            sx={{
              height: 250,
              width: 350,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent>
              <Typography variant="h6">{event.tyyppi}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(event.aika).toLocaleString("fi-FI")}
              </Typography>
              <Typography>{event.paikka}</Typography>
              {event.kuvaus && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {event.kuvaus}
                </Typography>
              )}
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                Osallistujia: {event.osallistujat || 0} | Ei osallistu:{" "}
                {event.ei_osallistujat || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
