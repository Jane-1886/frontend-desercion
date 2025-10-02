// src/App.jsx
import { Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import MenuAyuda from "./pages/MenuAyuda";

// Páginas
import Login from "./pages/Login";
import PaginaPrincipalCoordinacion from "./pages/PaginaPrincipalCoordinacion";
import ListadoFichas from "./pages/ListadoFichas";
import ReporteGeneral from "./pages/ReporteGeneral";
import ListadoFichasReportes from "./pages/ListadoFichasReportes";
import ListaAprendices from "./pages/ListaAprendices";
import Notificaciones from "./pages/Notificaciones";
import Desactivacion from "./pages/Desactivacion";
import ListadoFichasDesactivar from "./pages/ListadoFichasDesactivar";
import DesactivarUsuario from "./pages/DesactivarUsuario";
import ListadoInstructoresActivar from "./pages/ListadoInstructoresActivar";
import ListadoFichasActivar from "./pages/ListadoFichasActivar";
import CrearUsuario from "./pages/CrearUsuario";
import CrearUsuario2 from "./pages/CrearUsuario2";

/* --------- Guardias --------- */
function RutaPrivadaCoordinador() {
  const token = localStorage.getItem("token");
  const rol = Number(localStorage.getItem("rol"));
  if (!token) return <Navigate to="/login" replace />;
  if (rol !== 3) return <Navigate to="/no-autorizado" replace />;
  return <Outlet />;
}
function RutaPublicaSoloSiNoLogueado() {
  const token = localStorage.getItem("token");
  const rol = Number(localStorage.getItem("rol"));
  if (token && rol === 3) return <Navigate to="/menu" replace />;
  return <Outlet />;
}

/* --------- Utilidades --------- */
function NoAutorizado() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>No autorizado</h1>
      <p>Tu usuario no tiene permisos para esta sección.</p>
      <Link to="/login">Volver al login</Link>
    </div>
  );
}
function PaginaNoEncontrada() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>404 — Página no encontrada</h1>
      <p>La ruta que intentaste abrir no existe.</p>
      <Link to="/login">Ir al login</Link>
    </div>
  );
}

/* --------- Aliases (compat) --------- */
const AliasMenu = () => <Navigate to="/menu" replace />;
const AliasListadoFichas = () => <Navigate to="/listado-fichas" replace />;
const AliasReporteGeneral = () => <Navigate to="/reporte-general" replace />;
const AliasListInstrActivar = () => (
  <Navigate to="/listado-instructores-activar" replace />
);
const AliasListFichasDesactivar = () => (
  <Navigate to="/listado-fichas-desactivar" replace />
);
const AliasListFichasActivar = () => (
  <Navigate to="/listado-fichas-activar" replace />
);
const AliasDesactivarUsuario = () => <Navigate to="/desactivar-usuario" replace />;
const AliasCrearUsuario2 = () => <Navigate to="/crear-usuario2" replace />;

/* --------- App --------- */
export default function App() {
  return (
    <Routes>
      {/* Raíz → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Públicas (solo si NO estás logueado) */}
      <Route element={<RutaPublicaSoloSiNoLogueado />}>
        <Route path="/login" element={<Login />} />
        {/* 👉 HAZ PÚBLICA ESTA RUTA para que funcione desde el Login */}
  <Route path="/crearUsuario" element={<CrearUsuario />} />
      </Route>


      {/* Privadas (rol 3) */}
      <Route element={<RutaPrivadaCoordinador />}>
        <Route path="/menu" element={<PaginaPrincipalCoordinacion />} />
        <Route path="/listado-fichas" element={<ListadoFichas />} />
        <Route path="/reporte-general" element={<ReporteGeneral />} />
        <Route path="/listado-fichas-reportes" element={<ListadoFichasReportes />} />
        <Route path="/lista-aprendices/:idFicha" element={<ListaAprendices />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/desactivacion" element={<Desactivacion />} />
        <Route path="/listado-fichas-desactivar" element={<ListadoFichasDesactivar />} />
        <Route path="/desactivar-usuario" element={<DesactivarUsuario />} />
        <Route path="/listado-instructores-activar" element={<ListadoInstructoresActivar />} />
        <Route path="/listado-fichas-activar" element={<ListadoFichasActivar />} />
        <Route path="/crear-usuario2" element={<CrearUsuario2 />} />

        {/* 🎯 Nueva ruta de página de ayuda */}
        <Route path="/menu-ayuda" element={<MenuAyuda />} />

        {/* Crear usuario (privado) */}
        <Route path="/crear-usuario" element={<CrearUsuario />} />
      </Route>

      {/* Aliases rutas antiguas */}
      <Route path="/visualizar" element={<AliasListadoFichas />} />
      <Route path="/reporteGeneral" element={<AliasReporteGeneral />} />
      <Route path="/PaginaPrincipalCoordinacion" element={<AliasMenu />} />
      <Route path="/menu-coordinador" element={<AliasMenu />} />
      <Route path="/coordinador" element={<AliasMenu />} />
      <Route path="/listadoInstructoresActivar" element={<AliasListInstrActivar />} />
      <Route path="/listadoFichasDesactivar" element={<AliasListFichasDesactivar />} />
      <Route path="/listadoFichasActivar" element={<AliasListFichasActivar />} />
      <Route path="/desactivarUsuario" element={<AliasDesactivarUsuario />} />
      <Route path="/crearUsuario2" element={<AliasCrearUsuario2 />} />

      {/* Alias cómodo: /crear → /crear-usuario */}
      <Route path="/crear" element={<Navigate to="/crear-usuario" replace />} />

      {/* Estados especiales y 404 */}
      <Route path="/no-autorizado" element={<NoAutorizado />} />
      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  );
}
