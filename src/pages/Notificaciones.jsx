// src/pages/Notificaciones.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/notificaciones.css";
import logoSena from "/img/logoSena.png";
import notiIcon from "/img/notifications.png";
import api from "../controlador/api.js"; // axios con baseURL y token

export default function Notificaciones() {
  const navigate = useNavigate();
  const rol = Number(localStorage.getItem("rol") || "0"); // 2 = Bienestar, 3 = Coordinador

  // UI/estado general
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);

  // Feedback UX
  const [toast, setToast] = useState(null); // {tipo:'ok'|'error', texto:string}
  const [accionandoId, setAccionandoId] = useState(null); // id en proceso
  const [accionActual, setAccionActual] = useState(null); // 'Atendida'|'Rechazada'|'Eliminar'

  // Form (solo rol 2)
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [hora, setHora] = useState("");

  const mostrarToast = (tipo, texto) => {
    setToast({ tipo, texto });
    setTimeout(() => setToast(null), 2500);
  };

  const cargar = async () => {
    if (rol !== 3) return; // solo coordinador lista
    try {
      setCargando(true);
      setError("");
      const { data } = await api.get("/notificaciones");
      // Ordena por fecha desc si viene 'fecha'
      const ordenadas = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        : [];
      setNotificaciones(ordenadas);
    } catch (e) {
      setError(e?.response?.data?.mensaje || "Error al cargar notificaciones");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rol]);

  // ---- Acciones ----
  const enviarNotificacion = async () => {
    if (!tipo || !descripcion || !hora) {
      mostrarToast("error", "Completa tipo, descripción y hora.");
      return;
    }
    try {
      await api.post("/notificaciones", {
        tipo,
        descripcion,
        hora,
        // 'estado' puede omitirse (default 'Pendiente' en el backend)
      });
      setTipo("");
      setDescripcion("");
      setHora("");
      mostrarToast("ok", "Solicitud enviada.");
    } catch (e) {
      mostrarToast("error", e?.response?.data?.mensaje || "Error al enviar solicitud.");
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    setAccionandoId(id);
    setAccionActual(nuevoEstado);
    try {
      await api.patch(`/notificaciones/${id}`, { estado: nuevoEstado });
      // Actualización optimista en memoria
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, estado: nuevoEstado } : n))
      );
      mostrarToast("ok", `Solicitud marcada como ${nuevoEstado}.`);
    } catch (e) {
      mostrarToast("error", e?.response?.data?.mensaje || "Error al actualizar.");
    } finally {
      setAccionandoId(null);
      setAccionActual(null);
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta notificación?")) return;
    setAccionandoId(id);
    setAccionActual("Eliminar");
    try {
      await api.delete(`/notificaciones/${id}`);
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      mostrarToast("ok", "Notificación eliminada.");
    } catch (e) {
      mostrarToast("error", e?.response?.data?.mensaje || "Error al eliminar.");
    } finally {
      setAccionandoId(null);
      setAccionActual(null);
    }
  };

  return (
    <div className="layout-notificaciones">
      {/* Columna izquierda */}
      <div className="form-container izquierda navegacion">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />
        <div className="busqueda-container">{/* (vacío por ahora) */}</div>
      </div>

      {/* Columna derecha */}
      <div className="form-container derecha">
        {/* Toast */}
        {toast && <div className={`toast ${toast.tipo}`}>{toast.texto}</div>}

        <div className="titulo">
          Te encuentras <span style={{ color: "#00304D" }}>visualizando tu listado de</span>{" "}
          <span style={{ color: "#39A900" }}>notificaciones:</span>
        </div>

        {/* Formulario para Rol 2 (Bienestar) */}
        {rol === 2 && (
          <>
            <div className="subtitulo-notificaciones">Enviar nueva solicitud (Bienestar)</div>
            <div className="linea"></div>
            <div className="sub-div" style={{ gap: 12 }}>
              <div className="fila">
                <label style={{ width: 180 }}>Tipo:</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input">
                  <option value="">Seleccione...</option>
                  <option value="desactivacion_ficha">Desactivación de ficha</option>
                  <option value="retiro_aprendiz">Retiro de aprendiz</option>
                  <option value="retiro_instructor">Retiro de instructor</option>
                  <option value="desactivacion_usuario">Desactivación de usuario</option>
                </select>
              </div>

              <div className="fila">
                <label style={{ width: 180 }}>Hora (ej: 09:30 AM):</label>
                <input
                  className="input"
                  placeholder="09:30 AM"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
              </div>

              <div className="fila">
                <label style={{ width: 180 }}>Descripción:</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Detalle de la solicitud…"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="boton" onClick={enviarNotificacion}>
                  Enviar solicitud
                </button>
              </div>
            </div>
          </>
        )}

        {/* Lista para Rol 3 (Coordinador) */}
        {rol === 3 && (
          <>
            <div className="subtitulo-notificaciones">Notificaciones más recientes:</div>
            <div className="linea"></div>

            {cargando && <p>Cargando…</p>}
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <div className="scrollable-recent-notifications">
              <div className="sub-div">
                {notificaciones.length === 0 && !cargando && <p>No hay notificaciones.</p>}

                {notificaciones.map((n) => (
                  <div className="sub-div-item" key={n.id}>
                    <div className="sub-div-image">
                      <img src={notiIcon} alt="Imagen" className="imagen-sub-div" />
                    </div>
                    <div className="sub-div-content">
                      <div className="sub-div-title">
                        {n.tipo ? n.tipo.replaceAll("_", " ") : "—"}
                      </div>
                      <div className="sub-div-date">
                        Fecha:{" "}
                        {n.fecha
                          ? new Date(n.fecha).toLocaleDateString("es-CO", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : "—"}
                      </div>
                      <div className="sub-div-status">
                        Estado: <span className={`badge ${n.estado}`}>{n.estado}</span>
                      </div>
                      <div className="sub-div-time">Hora de la solicitud: {n.hora || "—"}</div>
                      <div className="sub-div-description">{n.descripcion || "—"}</div>

                      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          className="boton"
                          onClick={() => actualizarEstado(n.id, "Atendida")}
                          disabled={accionandoId === n.id || n.estado === "Atendida"}
                        >
                          {accionandoId === n.id && accionActual === "Atendida"
                            ? "Guardando..."
                            : "Marcar como Atendida"}
                        </button>

                        <button
                          className="boton"
                          onClick={() => actualizarEstado(n.id, "Rechazada")}
                          disabled={accionandoId === n.id || n.estado === "Rechazada"}
                        >
                          {accionandoId === n.id && accionActual === "Rechazada"
                            ? "Guardando..."
                            : "Rechazar"}
                        </button>

                        <button
                          className="boton danger"
                          onClick={() => eliminar(n.id)}
                          disabled={accionandoId === n.id}
                        >
                          {accionandoId === n.id && accionActual === "Eliminar"
                            ? "Eliminando..."
                            : "Eliminar"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="boton" onClick={cargar} disabled={cargando}>
                ↻ Actualizar lista
              </button>
            </div>
          </>
        )}

        <button className="boton volver" onClick={() => navigate("/reporte-general")}>
          ← Volver a Reporte General
        </button>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
      </div>
    </div>
  );
}
