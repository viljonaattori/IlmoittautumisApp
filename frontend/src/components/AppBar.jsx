import * as React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";

import logo from "/Images/logo.png";

const drawerWidth = 240;

// Jokaisella nav-kohdalla on oma label ja path
const navItems = [
  { label: "Etusivu", path: "/etusivu" },
  { label: "Muokkaa joukkuetta", path: "/muokkaaJoukkuetta" },
  { label: "Tapahtumat", path: "/tapahtumat" },
];

function DrawerAppBar({ window, joukkueNimi, onLogout }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false); // suljetaan drawer mobiilissa
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              sx={{ textAlign: "left" }}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Logout myös mobiilivalikkoon */}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "left" }} onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Kirjaudu ulos" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" position="fixed">
        <Toolbar>
          {/* Hampurilainen mobiilille */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Joukkueen nimi vasemmalle */}
          {joukkueNimi && (
            <Typography variant="body1" sx={{ ml: 1 }}>
              Joukkue: {joukkueNimi}
            </Typography>
          )}

          {/* Keskitetty otsikko ja logo desktopilla */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              TeamSign
            </Typography>
            <Box component="img" src={logo} alt="Logo" sx={{ height: 32 }} />
          </Box>

          {/* Desktopin nav-napit */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                sx={{ color: "#fff" }}
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Logout ikoni oikealla */}
          <Tooltip title="Kirjaudu ulos">
            <IconButton
              color="inherit"
              onClick={onLogout}
              sx={{ ml: 1 }}
              aria-label="kirjaudu ulos"
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Drawer mobiilille */}
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
  joukkueNimi: PropTypes.string,
  onLogout: PropTypes.func,
};

export default DrawerAppBar;
