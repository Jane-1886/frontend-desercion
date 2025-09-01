// frontend/src/controlador/auth.js
import api from "./api.js";

/**
 * Inicia sesión contra tu backend.
 * El backend espera { email, contrasena } en /api/auth/login
 */
export async function login(email, contrasena) {
  const { data } = await api.post("/api/auth/login", { email, contrasena });
  // Espera { token, usuario } del backend
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.usuario));
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
