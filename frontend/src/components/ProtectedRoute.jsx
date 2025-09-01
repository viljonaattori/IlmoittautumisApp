import { Children } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ Children }) {
  const token = localStorage.getItem("token"); // Hakee tokenin localmuistista
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return Children;
}

export default ProtectedRoute;
