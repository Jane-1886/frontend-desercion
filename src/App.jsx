// src/App.jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CrearUsuario from "./pages/CrearUsuario";
import CrearUsuario2 from "./pages/CrearUsuario2";
import PaginaPrincipalCoordinacion from "./pages/PaginaPrincipalCoordinacion";
import ListadoFichas from "./pages/ListadoFichas";
import ReporteGeneral from "./pages/ReporteGeneral";
import ListaAprendices from "./pages/ListaAprendices";
import Notificaciones from "./pages/Notificaciones";
import ListadoFichasReportes from "./pages/ListadoFichasReportes";
import Desactivacion from "./pages/Desactivacion";
import ListadoFichasDesactivar from "./pages/ListadoFichasDesactivar";
import DesactivarUsuario from "./pages/DesactivarUsuario";
import ListadoInstructoresActivar from "./pages/ListadoInstructoresActivar";
import ListadoFichasActivar from "./pages/ListadoFichasActivar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/crear" element={<CrearUsuario />} />
        <Route path="/crearUsuario2" element={<CrearUsuario2 />} />
        <Route path="/menu" element={<PaginaPrincipalCoordinacion />} />
        <Route path="/visualizar" element={<ListadoFichas />} />
        <Route path="/reporteGeneral" element={<ReporteGeneral />} />
        <Route path="/listado-fichas-reportes" element={<ListadoFichasReportes />} />
        <Route path="/lista-aprendices/:idFicha" element={<ListaAprendices />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/desactivacion" element={<Desactivacion />} />
        <Route path="/listadoInstructoresActivar" element={<ListadoInstructoresActivar />} />
        <Route path="/listadoFichasDesactivar" element={<ListadoFichasDesactivar />} />
        <Route path="/listadoFichasActivar" element={<ListadoFichasActivar />} />
        <Route path="/desactivarUsuario" element={<DesactivarUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
