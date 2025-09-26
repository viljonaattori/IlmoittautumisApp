import { Box, TextField, FormControlLabel, Checkbox } from "@mui/material";

export default function TapahtumaFilter({
  types,
  selectedTypes,
  setSelectedTypes,
  search,
  setSearch,
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
      </Box>
    </>
  );
}
