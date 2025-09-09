// src/pages/ReporteGeneral.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Reporte_general.css";
import logoSena from "/img/logoSena.png";
import folderIcon from "/img/folder_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// ✅ tu cliente axios (con interceptor de token)
import api from "../controlador/api";

const ReporteGeneral = () => {
  const navigate = useNavigate();

  // UI state
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(null); // objeto ficha seleccionado
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Datos reales
  const [fichas, setFichas] = useState([]);

  // Helper: id/código de ficha consistente (prioriza ID_Ficha según tu SQL)
  const getId = (f = {}) =>
    f.ID_Ficha ??
    f.id ??
    f.idFicha ??
    f.ID ??
    f.codigo ??
    f.codigoFicha ??
    f.Codigo ??
    f.Codigo_Ficha ??
    f.codigo_ficha ??
    null;

  // 🔌 Cargar fichas reales
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setCargando(true);
        setError("");
        // Tu backend: GET /api/fichas  → array
        const { data } = await api.get("/api/fichas");
        const list = Array.isArray(data) ? data : data?.fichas ?? [];
        if (alive) setFichas(list);
      } catch (e) {
        console.error(e);
        if (alive) setError("No se pudo cargar el listado de fichas.");
      } finally {
        if (alive) setCargando(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Búsqueda
  const fichasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return fichas;
    return fichas.filter((f) =>
      [
        getId(f),
        f?.nombreFicha,
        f?.tipoPrograma,
        f?.estado,
        f?.descripcion,
        f?.fechaInicio,
        f?.fechaFin,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [busqueda, fichas]);

  const abrirModal = (ficha) => setModalAbierto(ficha); // pasa el objeto completo
  const cerrarModal = () => setModalAbierto(null);

  // Descargar Blob helper
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Generar PDF (usa TU ruta protegida: /api/informes/ficha/:id)
  const generarPDF = async () => {
    if (!modalAbierto) return;
    const id = getId(modalAbierto);
    if (!id) {
      console.error("[PDF] No pude determinar el id de la ficha:", modalAbierto);
      alert("No se pudo determinar el ID de la ficha (revisa las columnas del backend).");
      return;
    }

    try {
      console.log("%c[PDF] Intentando:", "color:#39A900", `/api/informes/ficha/${id}`);
      const res = await api.get(`/api/informes/ficha/${id}`, { responseType: "blob" });
      const type = res?.data?.type || "";

      if (!type.includes("pdf")) {
        try {
          const txt = await res.data.text();
          console.error("[PDF] Respuesta NO PDF:", txt);
          alert(`El servidor no devolvió PDF.\nTipo: ${type}\nMensaje: ${txt.slice(0, 300)}...`);
        } catch {
          alert(`El servidor no devolvió PDF.\nTipo: ${type}`);
        }
        return;
      }

      downloadBlob(res.data, `informe-ficha-${id}.pdf`);
      cerrarModal();
    } catch (e) {
      console.error("[PDF] Error llamando /api/informes/ficha/:id", e);
      const status = e?.response?.status;
      if (status === 401) {
        alert("Tu sesión expiró o no hay token. Inicia sesión nuevamente.");
      } else if (status === 403) {
        alert("No tienes permisos para generar este informe.");
      } else if (status === 404) {
        alert("No se encontró la ficha o la ruta del informe.");
      } else {
        // intenta leer el body de error si vino como blob
        const blob = e?.response?.data;
        if (blob && typeof blob.text === "function") {
          try {
            const txt = await blob.text();
            console.error("[PDF] Body de error:", txt);
          } catch {}
        }
        alert("No se pudo generar el PDF del reporte.");
      }
    }
  };

  // Cerrar modal con ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") cerrarModal();
    };
    if (modalAbierto) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalAbierto]);

  return (
    <div className="layout-dos-columnas">
      {/* COLUMNA IZQUIERDA */}
      <div className="form-container izquierda navegacion">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />

        <div className="botones-container">
          <button className="boton" onClick={() => navigate("/listado-fichas-reportes")}>
            Visualizar listados
          </button>
          <button className="boton" onClick={() => navigate("/desactivacion")}>
            Desactivar usuarios y fichas
          </button>
          <button className="boton" onClick={() => navigate("/notificaciones")}>
            Notificaciones
          </button>
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="form-container derecha">
        <div className="titulo">
          Te encuentras <span style={{ color: "#00304D" }}>realizando un</span>{" "}
          <span style={{ color: "#39A900" }}>reporte general:</span>
        </div>

        <div className="nuevo-titulo-container">
          <div className="nuevo-titulo">Por favor, selecciona las fichas a generar reporte:</div>
        </div>

        <hr className="linea-titulo" />

        {/* Buscador */}
        <div className="busqueda-fichas">
          <input
            type="text"
            className="input-busqueda-fichas"
            placeholder="Buscar por código, nombre, programa, estado…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <p style={{ marginTop: 16 }}>Cargando fichas…</p>
        ) : error ? (
          <p style={{ color: "#b00020", marginTop: 16 }}>{error}</p>
        ) : (
          <div className="fichas-container">
            {fichasFiltradas.map((ficha, index) => {
              const id = getId(ficha) ?? `f-${index}`;
              return (
                <div className="ficha" key={id}>
                  <img src={folderIcon} className="imagen-ficha" alt={`Ficha ${id}`} />
                  <span className="texto-ficha">
                    Ficha - {id}
                    {ficha?.nombreFicha ? ` · ${ficha.nombreFicha}` : ""}
                    {ficha?.tipoPrograma ? ` · ${ficha.tipoPrograma}` : ""}
                    {ficha?.estado ? ` · ${ficha.estado}` : ""}
                  </span>
                  <button type="button" className="boton-ficha" onClick={() => abrirModal(ficha)}>
                    Seleccionar
                  </button>
                </div>
              );
            })}
            {fichasFiltradas.length === 0 && (
              <p style={{ opacity: 0.7, marginTop: 16 }}>No hay resultados</p>
            )}
          </div>
        )}

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>

        {/* Botón de regresar */}
        <div className="flecha-container">
          <button className="boton-flecha" onClick={() => navigate("/menu")}>
            <FontAwesomeIcon icon={faArrowLeft} /> Regresar
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN PARA GENERAR REPORTE */}
      <div
        className={`modal ${modalAbierto ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo-reporte"
        onClick={(e) => {
          if (e.target.classList.contains("modal")) cerrarModal();
        }}
      >
        <div className="modal-content">
          <p id="modal-titulo-reporte">
            ¿Deseas generar el <strong>reporte</strong> de la ficha{" "}
            <strong>{modalAbierto ? getId(modalAbierto) ?? "—" : ""}</strong>?
          </p>
          <div className="botones-modal">
            <button type="button" className="boton-generar-modal" onClick={generarPDF}>
              Generar reporte
            </button>
            <button type="button" className="boton-generar-modal cerrar" onClick={cerrarModal}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteGeneral;
