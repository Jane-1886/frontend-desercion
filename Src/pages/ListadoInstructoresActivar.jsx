// src/pages/ListadoInstructoresActivar.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Listado_instructores_activar.css";
import logoSena from "/img/logoSena.png";
import lupaIcono from "/img/lupa_icono.png";
import personIcon from "/img/person_icon.png";
import helpIcon from "/img/help_icon.png";
import checkIcon from "/img/check_circle.png";
import { FaArrowLeft } from "react-icons/fa";
import api from "../controlador/api.js"; // ✅ axios con baseURL y token

const ListadoInstructoresActivar = () => {
  const navigate = useNavigate();

  const [busquedaIzquierda, setBusquedaIzquierda] = useState("");
  const [busquedaInstructores, setBusquedaInstructores] = useState("");

  const [instructores, setInstructores] = useState([]); // [{id, nombre, email, estado}]
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [instructorSeleccionado, setInstructorSeleccionado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const botonesIzquierda = useMemo(
    () => ["Notificaciones"].filter((txt) =>
      txt.toLowerCase().includes(busquedaIzquierda.trim().toLowerCase())
    ),
    [busquedaIzquierda]
  );

  // Carga instructores INACTIVOS desde el backend (varias rutas tolerantes)
  const cargarInstructores = useCallback(async () => {
    setCargando(true);
    setError("");

    const endpoints = [
      "/api/usuarios/instructores/inactivos",
      "/api/usuarios/instructores?estado=INACTIVO",
    ];

    for (const ep of endpoints) {
      try {
        const { data } = await api.get(ep);
        if (Array.isArray(data) && data.length) {
          // Normaliza
          const items = data.map((u) => ({
            id: u?.id ?? u?.ID_Usuario ?? u?.ID ?? null,
            nombre: u?.nombre ?? u?.Nombre_Usuario ?? u?.Nombre ?? "(Sin nombre)",
            email: u?.email ?? u?.Email ?? "",
            estado: (u?.estado ?? u?.Estado ?? "").toString().toUpperCase(),
          })).filter(x => x.id);
          setInstructores(items);
          setCargando(false);
          return;
        }
      } catch {
        // prueba el siguiente endpoint
      }
    }

    setError("No se pudieron obtener instructores inactivos.");
    setCargando(false);
  }, []);

  useEffect(() => { cargarInstructores(); }, [cargarInstructores]);

  const instructoresFiltrados = useMemo(
    () =>
      instructores.filter((i) =>
        [i.nombre, i.email].join(" ").toLowerCase().includes(busquedaInstructores.trim().toLowerCase())
      ),
    [instructores, busquedaInstructores]
  );

  const abrirModalConfirmacion = (inst) => {
    setInstructorSeleccionado(inst);
    setMostrarConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setMostrarConfirmacion(false);
    setInstructorSeleccionado(null);
  };

  // PATCH /api/usuarios/:id/estado  { estado: "ACTIVO" }
  const confirmarAccion = async () => {
    if (!instructorSeleccionado?.id) return;
    try {
      await api.patch(`/api/usuarios/${instructorSeleccionado.id}/estado`, { estado: "ACTIVO" });
      setMostrarConfirmacion(false);
      setMostrarExito(true);
      setInstructores((prev) => prev.filter((x) => x.id !== instructorSeleccionado.id));
    } catch (e) {
      const msg =
        e?.response?.data?.mensaje ||
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo activar el instructor.";
      setError(msg);
    }
  };

  const cerrarExito = () => {
    setMostrarExito(false);
    setInstructorSeleccionado(null);
  };

  return (
    <div className="layout-listado-instructores-activar">
      {/* COLUMNA IZQUIERDA */}
      <div className="form-container izquierda navegacion">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />

        <div className="busqueda-container">
          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar"
              value={busquedaIzquierda}
              onChange={(e) => setBusquedaIzquierda(e.target.value)}
            />
            <img src={lupaIcono} alt="Buscar" className="icono-lupa" />
          </div>
        </div>

        <div className="botones-container">
          {botonesIzquierda.map((txt, idx) => (
            <button
              className="boton"
              key={idx}
              onClick={() => txt === "Notificaciones" && navigate("/notificaciones")}
            >
              {txt}
            </button>
          ))}
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="form-container derecha">
        <div className="titulo">
          Te encuentras visualizando{" "}
          <span style={{ color: "#00304D" }}>el listado de</span>{" "}
          <span style={{ color: "#39A900" }}>instructores (inactivos):</span>
        </div>

        <div className="sub-div">
          <input
            type="text"
            className="busqueda-instructores"
            placeholder="Buscar instructores por nombre o email"
            value={busquedaInstructores}
            onChange={(e) => setBusquedaInstructores(e.target.value)}
          />

          <div className="linea" />

          {cargando && <p style={{ color: "#666", fontWeight: "bold" }}>Cargando…</p>}
          {!cargando && error && (
            <div style={{ color: "#c00", fontWeight: "bold", marginBottom: 8 }}>
              {error} <button className="seleccionar-boton" onClick={cargarInstructores}>Reintentar</button>
            </div>
          )}

          <div className="texto-lista">Lista de instructores:</div>

          <div className="instructor-container">
            {instructoresFiltrados.map((inst) => (
              <div className="instructor" key={inst.id}>
                <img src={personIcon} alt={inst.nombre} className="instructor-imagen" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{inst.nombre}</span>
                  <small style={{ color: "#555" }}>{inst.email}</small>
                </div>
                <button
                  className="seleccionar-boton"
                  onClick={() => abrirModalConfirmacion(inst)}
                >
                  Seleccionar
                </button>
              </div>
            ))}

            {!cargando && !error && instructoresFiltrados.length === 0 && (
              <p style={{ color: "#999", fontWeight: "bold" }}>
                No se encontraron instructores
              </p>
            )}
          </div>
        </div>

        <p className="pie-de-pagina">
          2024 - Servicio Nacional de Aprendizaje Sena
        </p>
      </div>

      {/* MODAL CONFIRMACIÓN */}
      {mostrarConfirmacion && (
        <div className="modal" role="dialog" aria-modal="true" style={{ display: "flex" }}>
          <div className="modal-content">
            <img src={helpIcon} alt="Ayuda" className="modal-image" />
            <p className="modal-question">
              ¿Está seguro de activar al usuario <strong>{instructorSeleccionado?.nombre}</strong>?
            </p>
            <div>
              <button className="modal-button" onClick={confirmarAccion}>Sí</button>
              <button className="modal-button" onClick={cerrarModalConfirmacion}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ÉXITO */}
      {mostrarExito && (
        <div className="modal" role="dialog" aria-modal="true" style={{ display: "flex" }}>
          <div className="modal-content">
            <img src={checkIcon} alt="Éxito" className="modal-image" />
            <p className="modal-text">Acción confirmada.</p>
            <p className="modal-subtext">Usuario Activado.</p>
            <button className="modal-button" onClick={cerrarExito}>Ok</button>
          </div>
        </div>
      )}

      {/* Botón salir */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => navigate("/desactivacion")}>
          <FaArrowLeft /> Salir
        </button>
      </div>
    </div>
  );
};

export default ListadoInstructoresActivar;
