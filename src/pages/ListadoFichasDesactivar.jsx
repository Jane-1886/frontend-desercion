import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Listado_fichas_Desactivar.css";
import logoSena from "/img/logoSena.png";
import lupaIcono from "/img/lupa_icono.png";
import folderIcon from "/img/folder_icon.png";
import { FaArrowLeft } from "react-icons/fa";

/**
 * ListadoFichasDesactivar
 * - Carga fichas (intenta varias rutas)
 * - Mapea a objetos { id, code } para usar id en el backend y code para mostrar
 * - Desactiva vía PATCH /api/fichas/:id/estado  { estado: "Inactivo" }
 * - Corrige visibilidad de modales (usa clase `open`)
 */
const ListadoFichasDesactivar = () => {
  const navigate = useNavigate();

  // Datos
  const [fichas, setFichas] = useState([]); // [{id, code}]
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // UI
  const [busquedaIzquierda, setBusquedaIzquierda] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [seleccion, setSeleccion] = useState(null); // {id, code}

  // Helpers API
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

  /**
   * Normaliza distintas respuestas a [{id, code}]
   * Filtra por estado Activo si viene.
   */
  const extraerFichas = (raw) => {
    const arr = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.fichas)
      ? raw.fichas
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    const out = arr
      .filter((x) => {
        const est = (x?.estado ?? x?.Estado ?? "Activo").toString().toLowerCase();
        return est === "activo" || !x?.estado; // si trae estado, sólo activas
      })
      .map((x) => {
        // intentamos tomar el id "real" si existe
        const id =
          x?.idFicha ??
          x?.ID_Ficha ??
          x?.id ??
          x?.ID ??
          x?.codigo ??
          x?.Codigo ??
          x?.numero ??
          x?.Numero ??
          (typeof x === "string" || typeof x === "number" ? x : "");

        const code =
          x?.codigo ??
          x?.Codigo ??
          x?.numero ??
          x?.Numero ??
          (typeof x === "string" || typeof x === "number" ? x : id);

        return { id: String(id), code: String(code) };
      })
      .filter((o) => o.id || o.code);

    // elimina duplicados por id o code
    const seen = new Set();
    const unique = [];
    for (const f of out) {
      const key = `${f.id}::${f.code}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(f);
      }
    }
    return unique;
  };

  // Cargar fichas intentando varias rutas
  const cargarFichas = useCallback(async () => {
    setCargando(true);
    setError("");

    const endpoints = [
      "/api/fichas?estado=activas",
      "/api/fichas/activas",
      "/api/fichas",
      "/api/listado-fichas",
    ];

    for (const ep of endpoints) {
      try {
        const resp = await fetch(url(ep), { headers: authHeaders() });
        if (!resp.ok) {
          if (resp.status === 401 || resp.status === 403) {
            const body = await resp.json().catch(() => ({}));
            setError(body?.mensaje || body?.message || "No autorizado. Inicia sesión otra vez.");
            setCargando(false);
            return;
          }
          continue; // prueba siguiente endpoint
        }
        const data = await resp.json().catch(() => ({}));
        const parsed = extraerFichas(data);
        if (parsed.length > 0) {
          setFichas(parsed);
          setCargando(false);
          return;
        }
      } catch (e) {
        // intenta siguiente
        continue;
      }
    }

    setError("No se pudieron obtener las fichas del servidor.");
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarFichas();
  }, [cargarFichas]);

  // Filtro por código visible
  const fichasFiltradas = useMemo(() => {
    const t = searchTerm.trim();
    return t ? fichas.filter((f) => f.code.includes(t)) : fichas;
  }, [fichas, searchTerm]);

  const abrirConfirmacion = (ficha) => {
    setSeleccion(ficha); // {id, code}
    setModalAbierto(true);
  };

  const cerrarConfirmacion = () => {
    setModalAbierto(false);
    setSeleccion(null);
  };

  const cerrarExito = () => {
    setModalExito(false);
    setSeleccion(null);
  };

  // PATCH /api/fichas/:id/estado  { estado: "Inactivo" }
  const confirmarDesactivacion = async () => {
    if (!seleccion?.id) return;

    try {
      const resp = await fetch(url(`/api/fichas/${encodeURIComponent(seleccion.id)}/estado`), {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ estado: "Inactivo" }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        const msg = body?.mensaje || body?.message || `HTTP ${resp.status}`;
        alert("No se pudo desactivar la ficha. " + msg);
        return;
      }

      // Éxito
      setModalAbierto(false);
      setModalExito(true);
      setFichas((prev) => prev.filter((x) => x.id !== seleccion.id));
    } catch (e) {
      alert("No se pudo desactivar la ficha. " + (e?.message || "Error de red"));
    }
  };

  return (
    <div className="layout-listado-fichas">
      <div className="layout-2col">
        {/* Izquierda (logo + botones) */}
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
              <div className="icono-lupa">
                <img src={lupaIcono} alt="Buscar" />
              </div>
            </div>
          </div>

          <div className="botones-container">
            <button className="boton" onClick={() => navigate("/notificaciones")}>
              Notificaciones
            </button>
          </div>
        </div>

        {/* Derecha */}
        <div className="form-container derecha">
          <div className="titulo">
            Te encuentras visualizando <span style={{ color: "#00304D" }}>tu listado de</span>{" "}
            <span style={{ color: "#39A900" }}>fichas:</span>
          </div>

          <div className="busqueda-fichas">
            <input
              className="input-busqueda-fichas"
              placeholder="Buscar ficha"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="linea"></div>

          {/* Estados */}
          {cargando && <p style={{ color: "#666", fontWeight: "bold" }}>Cargando fichas…</p>}
          {!cargando && error && (
            <div style={{ color: "#c00", fontWeight: "bold", marginBottom: 8 }}>
              {error}{" "}
              <button className="seleccionar-boton" onClick={cargarFichas}>
                Reintentar
              </button>
            </div>
          )}

          <div className="sub-div">
            {fichasFiltradas.map((f) => (
              <div key={`${f.id}::${f.code}`} className="sub-item">
                <img src={folderIcon} alt="Ficha" className="icono-sub-item" />
                Ficha - {f.code}
                <button className="seleccionar-boton" onClick={() => abrirConfirmacion(f)}>
                  Seleccionar
                </button>
              </div>
            ))}
            {!cargando && !error && fichasFiltradas.length === 0 && (
              <p className="estado-vacio" style={{ color: "#999", fontWeight: "bold" }}>
                No se encontraron fichas.
              </p>
            )}
          </div>

          <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
        </div>
      </div>

      {/* Botón salir */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => navigate("/desactivacion")}>
          <FaArrowLeft /> Salir
        </button>
      </div>

      {/* Modal confirmación */}
      {modalAbierto && (
        <div className="modal open" role="dialog" aria-modal="true" aria-labelledby="tituloConfirmacion">
          <div className="modal-content">
            <img src="/img/help_icon.png" alt="Advertencia" />
            <p id="tituloConfirmacion">¿Deseas desactivar la ficha {seleccion?.code}?</p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={confirmarDesactivacion}>
                Sí
              </button>
              <button className="modal-button" onClick={cerrarConfirmacion}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal éxito */}
      {modalExito && (
        <div className="modal open" role="dialog" aria-modal="true" aria-labelledby="tituloExito">
          <div className="modal-content">
            <img src="/img/check_circle.png" alt="Éxito" style={{ marginBottom: 10 }} />
            <p id="tituloExito" className="confirmation-title">
              Acción confirmada.
            </p>
            <p className="confirmation-subtitle">Ficha {seleccion?.code} desactivada.</p>
            <button className="modal-button close-button" onClick={cerrarExito}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListadoFichasDesactivar;
