import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/rekisteröinti";
import ProtectedRoute from "./components/ProtectedRoute";
import Etusivu from "./pages/Etusivu";

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
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/etusivu" element={<Etusivu />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
