export function getToken() {
  return localStorage.getItem("token");
}

export function getUsuario() {
  const raw = localStorage.getItem("usuario");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function isLoggedIn() {
  return !!getToken();
}

export function hasRole(rolRequerido) {
  const u = getUsuario();
  const rol = u?.rol ?? u?.idRol ?? u?.ID_Rol ?? u?.role ?? u?.roleId;
  return String(rol) === String(rolRequerido);
}

export function login({ token, usuario }) {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}
