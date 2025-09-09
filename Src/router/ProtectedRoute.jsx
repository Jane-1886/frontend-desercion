// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireRole = null }) {
  const token = localStorage.getItem("token");
  const rol = Number(localStorage.getItem("rol")); // tu backend guarda rol numérico

  if (!token) {
    // sin sesión → al login
    return <Navigate to="/login" replace />;
  }
  if (requireRole && rol !== requireRole) {
    // sin permiso → al menú (o a una página 403 si creas una)
    return <Navigate to="/menu" replace />;
  }
  return children;
}
