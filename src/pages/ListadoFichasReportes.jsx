// src/pages/ListadoFichasReportes.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListadoFichasReportes.css";
import logoSena from "/img/logoSena.png";
import lupaIcono from "/img/lupa_icono.png";
import folderIcon from "/img/folder_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import api from "../controlador/api.js";

const ListadoFichasReportes = ({ fichaId }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [fichas, setFichas] = useState([]);
  const [cargandoFichas, setCargandoFichas] = useState(true);
  const [errorFichas, setErrorFichas] = useState("");

  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [mostrarModalFicha, setMostrarModalFicha] = useState(false);

  const [loadingReporte, setLoadingReporte] = useState(false);
  const [errorReporte, setErrorReporte] = useState(null);
  const [reporte, setReporte] = useState(null);

  const fetchCtrlRef = useRef(null);

  // 🔧 Helper: normaliza payload del backend al formato que pinta la UI
  // - totalSesiones ⟵ totalSesiones | totalSemanas
  // - detalle[i].fecha ⟵ fecha | semana
  const normalizarInforme = (data) => {
    const resumenSrc = data?.resumen || {};
    const detalleSrc = Array.isArray(data?.detalle) ? data.detalle : [];

    const resumen = {
      totalSesiones: resumenSrc.totalSesiones ?? resumenSrc.totalSemanas ?? 0,
      presentes: resumenSrc.presentes ?? 0,
      ausentes: resumenSrc.ausentes ?? 0,
      porcentajeAsistencia: resumenSrc.porcentajeAsistencia ?? 0,
    };

    const detalle = detalleSrc.map((d) => ({
      fecha: d.fecha ?? d.semana ?? "-",
      presentes: d.presentes ?? "-",
      ausentes: d.ausentes ?? "-",
      porcentaje:
        typeof d.porcentaje === "number" ? `${d.porcentaje}%` : (d.porcentaje ?? "-"),
    }));

    return { resumen, detalle };
  };

  // Cargar fichas desde backend
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setCargandoFichas(true);
        setErrorFichas("");
        const { data } = await api.get("/api/fichas");
        if (cancel) return;
        const normalizadas = (Array.isArray(data) ? data : []).map((f) => ({
          id: f.ID_Ficha ?? f.id ?? f.codigo ?? f.numero ?? String(f),
          display:
            f.codigo ??
            f.numero ??
            f.ID_Ficha ??
            f.id ??
            f.nombre ??
            String(f),
          raw: f,
        }));
        setFichas(normalizadas);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          setErrorFichas("Sesión expirada. Inicia sesión nuevamente.");
          navigate("/login");
          return;
        }
        setErrorFichas("No se pudieron cargar las fichas.");
      } finally {
        if (!cancel) setCargandoFichas(false);
      }
    })();
    return () => { cancel = true; };
  }, [navigate]);

  // Preselección si viene fichaId
  useEffect(() => {
    if (!fichaId || fichas.length === 0) return;
    const match = fichas.find(
      (f) => String(f.id) === String(fichaId) || String(f.display).includes(String(fichaId))
    );
    if (match) abrirModal(match);
  }, [fichaId, fichas]);

  // ESC para cerrar modal
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && cerrarModal();
    if (mostrarModalFicha) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mostrarModalFicha]);

  // Filtrado
  const fichasFiltradas = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return fichas;
    return fichas.filter((f) => {
      const r = f.raw || {};
      return (
        String(f.id).toLowerCase().includes(t) ||
        String(f.display).toLowerCase().includes(t) ||
        String(r.programa ?? "").toLowerCase().includes(t) ||
        String(r.jornada ?? "").toLowerCase().includes(t) ||
        String(r.nombre ?? "").toLowerCase().includes(t)
      );
    });
  }, [searchTerm, fichas]);

  // Abrir modal y cargar preview real
  const abrirModal = async (ficha) => {
    setFichaSeleccionada(ficha);
    setMostrarModalFicha(true);
    setReporte(null);
    setErrorReporte(null);
    setLoadingReporte(true);

    if (fetchCtrlRef.current) fetchCtrlRef.current.abort();
    const ctrl = new AbortController();
    fetchCtrlRef.current = ctrl;

    try {
      const { data } = await api.get(
        `/api/informes/ficha/${encodeURIComponent(ficha.id)}/preview`,
        { signal: ctrl.signal }
      );

      if (data && (data.resumen || data.detalle)) {
        const normalizado = normalizarInforme(data);
        setReporte(normalizado);
      } else {
        setErrorReporte(
          "Sin datos de preview. Puedes generar el PDF para ver el informe completo."
        );
      }
    } catch (err) {
      if (!ctrl.signal.aborted) {
        console.error(err);
        const msg =
          err?.response?.status === 404
            ? "El servidor no tiene /preview para esta ficha. Genera el PDF para ver el informe."
            : "No se pudo cargar el preview. Genera el PDF para ver el informe.";
        setErrorReporte(msg);
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

  // Nombre de archivo desde Content-Disposition
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

  // Botón: Generar PDF real (blob)
  const generarPDF = async () => {
    if (!fichaSeleccionada) return;
    try {
      const resp = await api.get(
        `/api/informes/ficha/${encodeURIComponent(fichaSeleccionada.id)}`,
        { responseType: "blob" }
      );
      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const nombre =
        extraerNombreArchivo(resp.headers) || `reporte_ficha_${fichaSeleccionada.id}.pdf`;
      const a = document.createElement("a");
      a.href = url;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        navigate("/login");
        return;
      }
      alert("No se pudo generar/descargar el PDF.");
    }
  };

  return (
    <div className="layout-listado-fichas-reportes fondo-listados">
      {/* IZQUIERDA */}
      <div className="form-container-reportes izquierda">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />
      </div>

      {/* DERECHA */}
      <div className="form-container-reportes derecha">
        <div className="titulo">
          Te encuentras visualizando <span style={{ color: "#00304D" }}>tu listado de</span>{" "}
          <span style={{ color: "#39A900" }}>fichas:</span>
        </div>

        <div className="busqueda-fichas" style={{ position: "relative", width: "100%", maxWidth: "1000px" }}>
          <input
            type="text"
            placeholder="Buscar por número, programa o jornada"
            className="input-busqueda-fichas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            className="icono-lupa"
            onClick={() => {
              if (searchTerm.trim() !== "" && fichasFiltradas.length === 0) {
                alert("No se encontraron coincidencias.");
              }
            }}
            aria-label="Buscar ficha"
          >
            <img src={lupaIcono} alt="Buscar" />
          </button>
        </div>

        <div className="linea" />

        {cargandoFichas && <p className="estado-cargando">Cargando fichas...</p>}
        {errorFichas && !cargandoFichas && <p className="estado-error">{errorFichas}</p>}

        {!cargandoFichas && !errorFichas && (
          <div className="sub-div">
            {fichasFiltradas.map((f) => (
              <div key={f.id} className="sub-item">
                <img src={folderIcon} alt="Icono Ficha" className="icono-sub-item" />
                Ficha - {f.display}
                <button type="button" className="seleccionar-boton" onClick={() => abrirModal(f)}>
                  Seleccionar
                </button>
              </div>
            ))}
            {fichasFiltradas.length === 0 && <p className="estado-vacio">No se encontraron fichas</p>}
          </div>
        )}

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
      </div>

      {/* MODAL */}
      <div
        className={`modal ${mostrarModalFicha ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-confirmacion-titulo"
        onClick={(e) => e.target.classList.contains("modal") && cerrarModal()}
      >
        <div className="modal-content">
          <p id="modal-confirmacion-titulo" className="modal-title">
            {fichaSeleccionada ? `Reporte de asistencia — Ficha ${fichaSeleccionada.display}` : "Reporte"}
          </p>

          {loadingReporte && <p className="estado-cargando">Cargando reporte...</p>}
          {errorReporte && <p className="estado-error">{errorReporte}</p>}

          {!loadingReporte && reporte && (
            <div className="preview-reporte">
              {reporte.resumen && (
                <div className="preview-resumen">
                  <div><strong>Total sesiones:</strong> {reporte.resumen.totalSesiones ?? "-"}</div>
                  <div><strong>Presentes:</strong> {reporte.resumen.presentes ?? "-"}</div>
                  <div><strong>Ausentes:</strong> {reporte.resumen.ausentes ?? "-"}</div>
                  <div><strong>Asistencia:</strong> {reporte.resumen.porcentajeAsistencia ?? "-"}%</div>
                </div>
              )}

              {Array.isArray(reporte.detalle) && reporte.detalle.length > 0 ? (
                <div className="tabla-wrapper">
                  <table className="tabla-reporte">
                    <thead>
                      <tr>
                        {/* Etiqueta dinámica opcional: muestra "Semana" si el backend envió "Semana N" */}
                        <th>{reporte.detalle[0]?.fecha?.toString?.().startsWith("Semana") ? "Semana" : "Fecha"}</th>
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
