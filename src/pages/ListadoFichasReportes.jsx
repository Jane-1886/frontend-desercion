// src/pages/ListadoFichasReportes.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListadoFichasReportes.css";
import logoSena from "/img/logoSena.png";
import lupaIcono from "/img/lupa_icono.png";
import folderIcon from "/img/folder_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import api from "../controlador/api.js"; // ✅ usamos axios con token de api.js

const ListadoFichasReportes = ({ fichaId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (fichaId) console.log("🧾 Recibí ficha desde ReporteGeneral:", fichaId);
  }, [fichaId]);

  const [searchTerm, setSearchTerm] = useState("");
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [mostrarModalFicha, setMostrarModalFicha] = useState(false);

  // Estados de preview
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [errorReporte, setErrorReporte] = useState(null);
  const [reporte, setReporte] = useState(null);

  const fetchCtrlRef = useRef(null);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") cerrarModal();
    };
    if (mostrarModalFicha) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mostrarModalFicha]);

  // TODO: Reemplazar por datos reales del backend si quieres listar desde /api/fichas
  const fichas = [2617001, 2617543, 2618129, 2614968, 2612387, 2615014, 2618902];
  const fichasFiltradas = fichas.filter((f) => f.toString().includes(searchTerm.trim()));

  const abrirModal = async (ficha) => {
    setFichaSeleccionada(ficha);
    setMostrarModalFicha(true);
    setReporte(null);
    setErrorReporte(null);
    setLoadingReporte(true);

    // cancelar “request” previo si existía
    if (fetchCtrlRef.current) fetchCtrlRef.current.abort();
    const ctrl = new AbortController();
    fetchCtrlRef.current = ctrl;

    try {
      // ✅ Opción A: api.js sin /api en baseURL -> aquí incluimos /api
      const resp = await api.get(`/api/reportes/asistencia/${ficha}`, {
        signal: ctrl.signal,
      });
      setReporte(resp.data);
    } catch (err) {
      // Si axios recibe Abort, err.name puede no venir, pero signal.aborted ayuda
      if (!ctrl.signal.aborted) {
        console.error(err);
        // Fallback mock para visualizar mientras conectas backend
        setReporte({
          resumen: {
            totalSesiones: 12,
            presentes: 10,
            ausentes: 2,
            porcentajeAsistencia: 83.3,
          },
          detalle: [
            { fecha: "2025-08-01", presentes: 15, ausentes: 5, porcentaje: "75%" },
            { fecha: "2025-08-05", presentes: 18, ausentes: 2, porcentaje: "90%" },
            { fecha: "2025-08-08", presentes: 19, ausentes: 1, porcentaje: "95%" },
          ],
        });
        setErrorReporte("No se pudo cargar desde el servidor. Mostrando datos de ejemplo.");
      }
    } finally {
      setLoadingReporte(false);
    }
  };

  const cerrarModal = () => {
    if (fetchCtrlRef.current) fetchCtrlRef.current.abort();
    setMostrarModalFicha(false);
    setFichaSeleccionada(null);
    setReporte(null);
    setErrorReporte(null);
  };

  const extraerNombreArchivo = (headers) => {
    const disp =
      headers?.["content-disposition"] ||
      headers?.get?.("content-disposition") ||
      headers?.get?.("Content-Disposition") ||
      null;

    if (!disp) return null;
    const match = /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i.exec(disp);
    return decodeURIComponent(match?.[1] || match?.[2] || "");
  };

  const generarPDF = async () => {
    if (!fichaSeleccionada) return;
    try {
      // ✅ Pedimos blob con axios
      const resp = await api.get(`/api/reportes/asistencia/${fichaSeleccionada}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([resp.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const nombre =
        extraerNombreArchivo(resp.headers) || `reporte_ficha_${fichaSeleccionada}.pdf`;

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("No se pudo generar/descargar el PDF.");
    }
  };

  return (
    <div className="layout-listado-fichas-reportes fondo-listados">
      {/* IZQUIERDA: solo logo */}
      <div className="form-container-reportes izquierda">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />
      </div>

      {/* DERECHA */}
      <div className="form-container-reportes derecha">
        <div className="titulo">
          Te encuentras visualizando <span style={{ color: "#00304D" }}>tu listado de</span>{" "}
          <span style={{ color: "#39A900" }}>fichas:</span>
        </div>

        {/* Buscador debajo del título, a la derecha */}
        <div className="busqueda-fichas" style={{ position: "relative", width: "100%", maxWidth: "1000px" }}>
          <input
            type="text"
            placeholder="Buscar ficha"
            className="input-busqueda-fichas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            className="icono-lupa"
            onClick={() => {
              if (searchTerm.trim() === "") {
                alert("Por favor escribe un número de ficha");
              } else if (fichasFiltradas.length === 0) {
                alert("No se encontraron coincidencias");
              }
            }}
            aria-label="Buscar ficha"
          >
            <img src={lupaIcono} alt="Buscar" />
          </button>
        </div>

        <div className="linea" />

        {/* Listado de fichas */}
        <div className="sub-div">
          {fichasFiltradas.map((ficha) => (
            <div key={ficha} className="sub-item">
              <img src={folderIcon} alt="Icono Ficha" className="icono-sub-item" />
              Ficha - {ficha}
              <button type="button" className="seleccionar-boton" onClick={() => abrirModal(ficha)}>
                Seleccionar
              </button>
            </div>
          ))}

          {fichasFiltradas.length === 0 && <p className="estado-vacio">No se encontraron fichas</p>}
        </div>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
      </div>

      {/* MODAL: PREVIEW + GENERAR PDF */}
      <div
        className={`modal ${mostrarModalFicha ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-confirmacion-titulo"
        onClick={(e) => {
          if (e.target.classList.contains("modal")) cerrarModal();
        }}
      >
        <div className="modal-content">
          <p id="modal-confirmacion-titulo" className="modal-title">
            {fichaSeleccionada ? `Reporte de asistencia — Ficha ${fichaSeleccionada}` : "Reporte"}
          </p>

          {loadingReporte && <p className="estado-cargando">Cargando reporte...</p>}
          {errorReporte && <p className="estado-error">{errorReporte}</p>}

          {!loadingReporte && reporte && (
            <div className="preview-reporte">
              {reporte.resumen && (
                <div className="preview-resumen">
                  <div>
                    <strong>Total sesiones:</strong> {reporte.resumen.totalSesiones ?? "-"}
                  </div>
                  <div>
                    <strong>Presentes:</strong> {reporte.resumen.presentes ?? "-"}
                  </div>
                  <div>
                    <strong>Ausentes:</strong> {reporte.resumen.ausentes ?? "-"}
                  </div>
                  <div>
                    <strong>Asistencia:</strong> {reporte.resumen.porcentajeAsistencia ?? "-"}%
                  </div>
                </div>
              )}

              {Array.isArray(reporte.detalle) && reporte.detalle.length > 0 ? (
                <div className="tabla-wrapper">
                  <table className="tabla-reporte">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Presentes</th>
                        <th>Ausentes</th>
                        <th>% Asistencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporte.detalle.map((d, i) => (
                        <tr key={i}>
                          <td>{d.fecha ?? "-"}</td>
                          <td>{d.presentes ?? "-"}</td>
                          <td>{d.ausentes ?? "-"}</td>
                          <td>{d.porcentaje ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                !loadingReporte && <p className="estado-vacio">No hay información para mostrar.</p>
              )}
            </div>
          )}

          <div className="modal-buttons">
            <button type="button" className="modal-button" onClick={generarPDF} disabled={loadingReporte}>
              Generar PDF
            </button>
            <button type="button" className="modal-button" onClick={cerrarModal}>
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Salir */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => navigate("/menu")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Salir
        </button>
      </div>
    </div>
  );
};

export default ListadoFichasReportes;
