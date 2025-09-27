import { Box, TextField, FormControlLabel, Checkbox } from "@mui/material";

export default function TapahtumaFilter({
  types,
  selectedTypes,
  setSelectedTypes,
  search,
  setSearch,
  timeFilter,
  setTimeFilter,
}) {
  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <>
      <TextField
        label="Hae tapahtumia (paikka/kuvaus)"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tyyppisuodattimet */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        {types.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
              />
            }
            label={type}
          />
        ))}

        {/* Aikasuodattimet */}
        <FormControlLabel
          control={
            <Checkbox
              checked={timeFilter === "tulevat"}
              onChange={() =>
                setTimeFilter(timeFilter === "tulevat" ? "" : "tulevat")
              }
            />
          }
          label="Tulevat"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={timeFilter === "menneet"}
              onChange={() =>
                setTimeFilter(timeFilter === "menneet" ? "" : "menneet")
              }
            />
          }
          label="Menneet"
        />
      </Box>
    </>
  );
}
