import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/rekisteröinti";
import ProtectedRoute from "./components/ProtectedRoute";
import Etusivu from "./pages/Etusivu";
import Layout from "./components/Layout";
import Join from "./pages/Join";
import CookieBanner from "./components/CookieBanner";
import PaivitaTapahtuma from "./pages/paivitaTapahtuma";
import MuokkaaJoukkuetta from "./pages/MuokkaaJoukkuetta";
import Asetukset from "./pages/Asetukset";
import UnohtuikoSalasana from "./pages/UnohtuikoSalasana";
import ResetoiSalasana from "./pages/ResetoiSalasana";
import Tapahtumat from "./pages/Tapahtumat";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
      },
      secondary: {
        main: "#f48fb1",
      },
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Julkiset reitit */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join/:token" element={<Join />} />
          <Route
            path="/paivitaTapahtuma/:tapahtumaId"
            element={<PaivitaTapahtuma />}
          />
          <Route path="/unohtuikoSalasana" element={<UnohtuikoSalasana />} />
          <Route path="/resetoiSalasana" element={<ResetoiSalasana />} />

          {/* Suojatut reitit */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/etusivu" element={<Etusivu />} />
            <Route path="/muokkaaJoukkuetta" element={<MuokkaaJoukkuetta />} />
            <Route path="/asetukset" element={<Asetukset />} />
            <Route path="/tapahtumat" element={<Tapahtumat />} />
          </Route>
        </Routes>
      </Router>
      <CookieBanner />
    </ThemeProvider>
  );
}

export default App;
