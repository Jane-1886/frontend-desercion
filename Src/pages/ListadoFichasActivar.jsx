// src/pages/ListadoFichasActivar.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Listado_fichas_Activar.css";
import logoSena from "/img/logoSena.png";
import lupaIcono from "/img/lupa_icono.png";
import folderIcon from "/img/folder_icon.png";
import helpIcon from "/img/help_icon.png";
import checkIcon from "/img/check_circle.png";
import { FaArrowLeft } from "react-icons/fa";

const ListadoFichasActivar = () => {
  const navigate = useNavigate();

  const [busquedaIzquierda, setBusquedaIzquierda] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [fichas, setFichas] = useState([]); // [{id, code}]
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [fichaSeleccionada, setFichaSeleccionada] = useState(null); // {id, code}
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const API_BASE = (import.meta.env.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, "")
    : "");
  const url = (path) => (API_BASE ? `${API_BASE}${path}` : path);

  const authHeaders = () => {
    const token = localStorage.getItem("token") || "";
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Normaliza distintas respuestas a [{id, code}]
  const toItems = (raw) => {
    const arr = Array.isArray(raw) ? raw
      : Array.isArray(raw?.fichas) ? raw.fichas
      : Array.isArray(raw?.data) ? raw.data
      : [];

    return arr
      .map((x) => {
        const id = x?.idFicha ?? x?.ID_Ficha ?? x?.id ?? x?.ID ?? x?.codigo ?? x?.Codigo ?? x?.numero ?? x?.Numero ?? x;
        const code = x?.codigo ?? x?.Codigo ?? x?.numero ?? x?.Numero ?? id;
        return { id: String(id), code: String(code) };
      })
      .filter((o) => o.id && o.code);
  };

  // Cargar inactivas intentando varias rutas
  const cargarInactivas = useCallback(async () => {
    setCargando(true);
    setError("");

    const endpoints = [
      "/api/fichas?estado=inactivas",
      "/api/fichas/inactivas",
      "/api/fichas/estado/inactivas", // si usas router de estados
      "/api/estados-fichas/inactivas", // alias opcional
      "/api/estados-fichas/por-estado?estado=Inactivo",
    ];

    for (const ep of endpoints) {
      try {
        const resp = await fetch(url(ep), { headers: authHeaders() });
        if (!resp.ok) {
          if (resp.status === 401 || resp.status === 403) {
            const body = await resp.json().catch(() => ({}));
            setError(body?.mensaje || body?.message || "No autorizado.");
            setCargando(false);
            return;
          }
          continue;
        }
        const data = await resp.json().catch(() => ({}));
        const items = toItems(data);
        if (items.length > 0) {
          setFichas(items);
          setCargando(false);
          return;
        }
      } catch {
        // intenta siguiente
      }
    }

    setError("No se pudieron obtener fichas inactivas.");
    setCargando(false);
  }, []);

  useEffect(() => { cargarInactivas(); }, [cargarInactivas]);

  const botonesIzquierda = useMemo(
    () => ["Notificaciones"].filter((txt) =>
      txt.toLowerCase().includes(busquedaIzquierda.trim().toLowerCase())
    ),
    [busquedaIzquierda]
  );

  const fichasFiltradas = useMemo(
    () => fichas.filter((f) => f.code.toString().includes(searchTerm.trim())),
    [fichas, searchTerm]
  );

  const abrirModalConfirmacion = (ficha) => {
    setFichaSeleccionada(ficha); // {id, code}
    setMostrarConfirmacion(true);
  };
  const cerrarModalConfirmacion = () => {
    setMostrarConfirmacion(false);
    setFichaSeleccionada(null);
  };
  const cerrarExito = () => {
    setMostrarExito(false);
    setFichaSeleccionada(null);
  };

  const confirmarActivacion = async () => {
    if (!fichaSeleccionada?.id) return;
    try {
      const resp = await fetch(url(`/api/fichas/${encodeURIComponent(fichaSeleccionada.id)}/estado`), {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ estado: "Activo" }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        alert("No se pudo activar la ficha. " + (body?.mensaje || body?.message || `HTTP ${resp.status}`));
        return;
      }

      setMostrarConfirmacion(false);
      setMostrarExito(true);
      setFichas((prev) => prev.filter((x) => x.id !== fichaSeleccionada.id));
    } catch (e) {
      alert("No se pudo activar la ficha. " + (e?.message || "Error de red"));
    }
  };

  return (
    <div className="layout-listado-fichas-activar">
      {/* IZQUIERDA */}
      <div className="form-container izquierda navegacion">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />

        <div className="busqueda-container">
          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar"
              onChange={(e) => setBusquedaIzquierda(e.target.value)}
            />
            <img src={lupaIcono} alt="Buscar" className="icono-lupa" />
          </div>
        </div>

        <div className="botones-container" id="button-container">
          {botonesIzquierda.map((txt, i) => (
            <button
              className="boton"
              key={i}
              onClick={() => navigate("/notificaciones")}
            >
              {txt}
            </button>
          ))}
        </div>
      </div>

      {/* DERECHA */}
      <div className="form-container derecha">
        <div className="titulo">
          Te encuentras visualizando{" "}
          <span style={{ color: "#00304D" }}>tu listado de</span>{" "}
          <span style={{ color: "#39A900" }}>fichas (inactivas):</span>
        </div>

        <div className="info-pequeña">
          <input
            type="text"
            placeholder="Buscar ficha"
            className="input-busqueda-fichas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="linea" />

        {cargando && <p style={{ color: "#666", fontWeight: "bold" }}>Cargando…</p>}
        {!cargando && error && (
          <div style={{ color: "#c00", fontWeight: "bold", marginBottom: 8 }}>
            {error} <button className="seleccionar-boton" onClick={cargarInactivas}>Reintentar</button>
          </div>
        )}

        <div className="sub-div" id="ficha-container">
          {fichasFiltradas.map((ficha) => (
            <div className="sub-item" key={`${ficha.id}::${ficha.code}`}>
              <img src={folderIcon} alt="Icono Ficha" className="icono-sub-item" />
              Ficha - {ficha.code}
              <button
                className="seleccionar-boton"
                onClick={() => abrirModalConfirmacion(ficha)}
              >
                Seleccionar
              </button>
            </div>
          ))}

          {!cargando && !error && fichasFiltradas.length === 0 && (
            <p style={{ color: "#999", fontWeight: "bold" }}>
              No se encontraron fichas.
            </p>
          )}
        </div>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>
      </div>

      {/* MODAL CONFIRMACIÓN */}
      {mostrarConfirmacion && (
        <div className="modal" role="dialog" aria-modal="true" style={{ display: "flex" }}>
          <div className="modal-content">
            <img src={helpIcon} alt="Confirmación" className="modal-image" />
            <p className="modal-question">¿Está seguro de activar la ficha {fichaSeleccionada?.code}?</p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={confirmarActivacion}>Sí</button>
              <button className="modal-button" onClick={cerrarModalConfirmacion}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ÉXITO */}
      {mostrarExito && (
        <div className="modal" role="dialog" aria-modal="true" style={{ display: "flex" }}>
          <div className="modal-content">
            <img src={checkIcon} alt="Confirmado" className="modal-image" />
            <p className="confirmation-title">Acción confirmada.</p>
            <p className="confirmation-subtitle">Ficha {fichaSeleccionada?.code} activada.</p>
            <button className="modal-button close-button" onClick={cerrarExito}>Ok</button>
          </div>
        </div>
      )}

      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => navigate("/desactivacion")}>
          <FaArrowLeft /> Salir
        </button>
      </div>
    </div>
  );
};

export default ListadoFichasActivar;
