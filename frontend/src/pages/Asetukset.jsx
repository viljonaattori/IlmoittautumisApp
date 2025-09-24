import { Box, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserNameForm from "../components/settings/UserNameForm";
import EmailForm from "../components/settings/EmailForm";
import PasswordForm from "../components/settings/PasswordForm";
import DeleteAccountSection from "../components/settings/DeleteAccount";
import TeamImage from "../components/settings/TeamImage";

export default function Asetukset() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Asetukset
      </Typography>

      <UserNameForm token={token} />
      <Divider sx={{ my: 2 }} />

      <EmailForm token={token} />
      <Divider sx={{ my: 2 }} />

      <PasswordForm token={token} />
      <Divider sx={{ my: 2 }} />

      <DeleteAccountSection token={token} />
      <Divider sx={{ my: 2 }} />

      <TeamImage token={token} />

      <Button variant="outlined" onClick={() => navigate("/etusivu")}>
        Takaisin etusivulle
      </Button>
    </Box>
  );
}
