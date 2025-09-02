import { Navigate, useLocation } from "react-router-dom";

// Protekcted routen avulla varmistetaan, ettei kuka tahansa voi mennä esim. etusivulle ilman kirjautumista eli ilman tokenia.

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // Hakee tokenin localmuistista
  const location = useLocation();
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}

export default ProtectedRoute;
