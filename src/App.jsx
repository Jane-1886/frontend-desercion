// src/App.jsx
import { useState, useEffect } from "react";

import Login from "./pages/Login";

// ⬇️ Mantén AMBOS formularios
import CrearUsuario from "./pages/CrearUsuario";     // ➜ Solo para crear COORDINADOR
import CrearUsuario2 from "./pages/CrearUsuario2";   // ➜ Para vincular usuarios de cualquier rol

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
  const [vista, setVista] = useState({ vista: "login" });

  // Cambiador tolerante: acepta (obj) o (string, data)
  const cambiarVista = (arg, data = null) => {
    if (typeof arg === "object" && arg !== null) {
      setVista(arg);
    } else {
      setVista(data ? { vista: arg, ...data } : { vista: arg });
    }
  };

  // Des-anidador defensivo: si por error llega { vista: { vista: "x" } } lo corrige
  useEffect(() => {
    if (
      vista &&
      typeof vista.vista === "object" &&
      vista.vista !== null &&
      "vista" in vista.vista
    ) {
      setVista(vista.vista);
    }
  }, [vista]);

  return (
    <>
      {vista.vista === "login" && <Login setVista={cambiarVista} />}

      {/* ➜ Formulario viejo: SOLO para crear Coordinador */}
      {vista.vista === "crear" && (
        <CrearUsuario setVista={cambiarVista} />
        // Guard ejemplo: {puedeCrearCoordinador ? <CrearUsuario .../> : <NoAutorizado .../>}
      )}

      {/* ➜ Formulario nuevo: para crear Coordinador/Instructor/Bienestar */}
      {vista.vista === "crearUsuario2" && (
        <CrearUsuario2 setVista={cambiarVista} />
        // Guard ejemplo: {puedeVincularUsuarios ? <CrearUsuario2 .../> : <NoAutorizado .../>}
      )}

      {vista.vista === "menu" && (
        <PaginaPrincipalCoordinacion setVista={cambiarVista} />
      )}

      {vista.vista === "listadoFichas" && (
        <ListadoFichas setVista={cambiarVista} />
      )}

      {vista.vista === "reporteGeneral" && (
        <ReporteGeneral setVista={cambiarVista} />
      )}

      {vista.vista === "listadoFichasReportes" && (
        <ListadoFichasReportes
          setVista={cambiarVista}
          fichaId={vista.fichaId}
        />
      )}

      {vista.vista === "listaAprendices" && (
        <ListaAprendices
          setVista={cambiarVista}
          fichaId={vista.fichaId}
          modo={vista.modo}
        />
      )}

      {vista.vista === "notificaciones" && (
        <Notificaciones setVista={cambiarVista} />
      )}

      {vista.vista === "desactivacion" && (
        <Desactivacion setVista={cambiarVista} />
      )}

      {vista.vista === "listadoInstructoresActivar" && (
        <ListadoInstructoresActivar setVista={cambiarVista} />
      )}

      {vista.vista === "listadoFichasDesactivar" && (
        <ListadoFichasDesactivar setVista={cambiarVista} />
      )}

      {vista.vista === "listadoFichasActivar" && (
     <ListadoFichasActivar setVista={cambiarVista} />
      )}

     


      {vista.vista === "desactivarUsuario" && (
        <DesactivarUsuario setVista={cambiarVista} />
      )}
    </>
  );
}

export default App;
