// src/pages/ListaAprendices.jsx
import React, { useEffect, useState } from "react";
import "../styles/listado_aprendices.css";
import logoSena from "/Img/logoSena.png";
import lupaIcono from "/Img/lupa_icono.png";
import folderIcon from "/Img/folder_icon.png";
import personIcon from "/Img/person_icon.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

// 🔧 Cambia esta función si tu backend usa otra ruta/nombre de parámetros
const HISTORIAL_URL = (aprendizId, fichaId) =>
  `http://localhost:3000/api/asistencia/aprendiz/${aprendizId}?fichaId=${encodeURIComponent(
    fichaId
  )}`;

export default function ListaAprendices({ setVista, fichaId, modo = "visualizar" }) {
  const [busqueda, setBusqueda] = useState("");
  const [aprendices, setAprendices] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const esModoReportes = modo === "reportes";

  // Carga de aprendices por ficha (si ya tienes endpoint real, úsalo aquí)
  useEffect(() => {
    let cancel = false;

    (async () => {
      try {
        // 👉 Si ya tienes este endpoint real, descomenta y úsalo:
        // const token = localStorage.getItem("token");
        // const res = await fetch(`http://localhost:3000/api/aprendices/${fichaId}`, {
        //   headers: token ? { Authorization: `Bearer ${token}` } : {},
        // });
        // const data = await res.json();
        // const arr = Array.isArray(data) ? data : Array.isArray(data?.rows) ? data.rows : [];

        // DEMO: datos de ejemplo (borra esto cuando conectes el fetch real)
        const arr = [
          { id: "001", nombre: "Aprendiz 1", instructor: "Instructor 1" },
          { id: "002", nombre: "Aprendiz 2", instructor: "Instructor 1" },
          { id: "003", nombre: "Aprendiz 3", instructor: "Instructor 2" },
          { id: "004", nombre: "Aprendiz 4", instructor: "Instructor 2" },
        ];

        // Normaliza por si cambian nombres de campos en el backend
        const normalizados = arr.map((row) => {
          const id =
            row?.id ?? row?.ID ?? row?.ID_Aprendiz ?? row?.id_aprendiz ?? row?.idAprendiz ?? "";
          const nombre =
            row?.nombre ??
            row?.Nombre ??
            [row?.nombres, row?.apellidos].filter(Boolean).join(" ").trim();
        const instructor = row?.instructor ?? row?.Instructor ?? "Sin instructor";
          return { ...row, id: String(id), nombre: nombre || "(Sin nombre)", instructor };
        });

        if (!cancel) setAprendices(normalizados);
      } catch (e) {
        console.error("Error cargando aprendices:", e);
        if (!cancel) setAprendices([]);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [fichaId]);

  // Buscar por nombre
  const filtrar = (lista, term) => {
    const t = term.trim().toLowerCase();
    if (!t) return lista;
    return lista.filter((a) => (a?.nombre || "").toLowerCase().includes(t));
  };

  // Abrir modal y cargar historial desde el backend
  const abrirModalHistorial = async (aprendiz) => {
    if (!esModoReportes) return; // seguridad: solo en modo reportes
    setAprendizSeleccionado(aprendiz);
    setMostrarModal(true);
    setCargandoHistorial(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(HISTORIAL_URL(aprendiz.id, fichaId), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      let data = [];
      if (res.ok) {
        data = await res.json();
        // Esperado: array de { fecha | dia, estado, justificacion? }
      } else {
        console.warn("No se pudo obtener historial, res:", res.status);
      }

      // DEMO fallback si el backend aún no está listo
      if (!Array.isArray(data) || data.length === 0) {
        data = [
          { fecha: "2025-08-04", estado: "Asistió", justificacion: "" },
          { fecha: "2025-08-05", estado: "No asistió", justificacion: "Cita médica" },
          { fecha: "2025-08-06", estado: "Asistió", justificacion: "" },
        ];
      }

      setHistorial(data);
    } catch (e) {
      console.error("Error cargando historial:", e);
      // Fallback demo
      setHistorial([
        { fecha: "2025-08-04", estado: "Asistió", justificacion: "" },
        { fecha: "2025-08-05", estado: "No asistió", justificacion: "Cita médica" },
        { fecha: "2025-08-06", estado: "Asistió", justificacion: "" },
      ]);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setAprendizSeleccionado(null);
    setHistorial([]);
  };

  // Generar PDF con el historial cargado
  const generarPDF = () => {
    if (!aprendizSeleccionado) return;
    const doc = new jsPDF();

    const titulo = "Historial de Asistencia";
    doc.text(titulo, 14, 14);
    doc.text(`Ficha: ${fichaId}`, 14, 22);
    doc.text(`Aprendiz: ${aprendizSeleccionado.nombre}`, 14, 30);
    doc.text(`ID: ${aprendizSeleccionado.id}`, 14, 38);

    // Encabezados y cuerpo para autotable
    const head = [["Fecha", "Estado", "Justificación"]];
    const body = (historial || []).map((h) => [
      h.fecha || h.dia || "",
      h.estado || "",
      h.justificacion || "",
    ]);

    doc.autoTable({
      startY: 46,
      head,
      body,
      styles: { fontSize: 10 },
      headStyles: { fontStyle: "bold" },
      margin: { left: 14, right: 14 },
    });

    // Nombre de archivo
    const nombreArchivo = `historial_${(aprendizSeleccionado.nombre || "aprendiz")
      .replace(/\s+/g, "_")
      .toLowerCase()}_ficha_${String(fichaId).toLowerCase()}.pdf`;

    doc.save(nombreArchivo);
  };

  // Agrupar por instructor para mantener tu diseño
  const instructores = Array.from(new Set(aprendices.map((a) => a.instructor || "Sin instructor")));

  return (
    <div className="body-listado-aprendices">
      <div className="contenedor-principal">
        {/* COLUMNA IZQUIERDA */}
        <div className="form-container izquierda navegacion">
          <img src={logoSena} alt="Logo SENA" className="imagen-header" />
          <div className="busqueda-container">
            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar"
                aria-label="Buscar"
                className="input-busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <img src={lupaIcono} alt="Icono de búsqueda" className="icono-lupa" aria-hidden="true" />
            </div>
          </div>
          <div className="botones-container">
            <button className="boton btn">Notificaciones</button>
            <button className="boton btn">¿Necesitas ayuda?</button>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="form-container derecha">
          {/* Botón fijo para regresar */}
          {typeof setVista === "function" && (
            <button className="volver-btn-fijo" onClick={() => setVista("listadoFichasReportes")}>
              ⬅ Volver
            </button>
          )}

          <h1 className="titulo">
            Te encuentras en el <span style={{ color: "#00304D" }}>listado de</span>{" "}
            <span style={{ color: "#39A900" }}>aprendices:</span>
          </h1>

          <div className="sub-div">
            <div className="ficha-container">
              <img src={folderIcon} alt="Icono de ficha" className="ficha-imagen" />
              <div className="ficha">Ficha: {fichaId}</div>
            </div>

            <div className="linea"></div>

            <div className="info-pequeña">
              <div className="campo-busqueda">
                <input
                  type="text"
                  placeholder="Escribe el nombre del aprendiz..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <p className="lista-titulo">Lista de aprendices:</p>

            <div className="lista-aprendices">
              {instructores.map((instructor) => {
                const lista = filtrar(
                  aprendices.filter((a) => (a.instructor || "Sin instructor") === instructor),
                  busqueda
                );
                if (lista.length === 0) return null;

                return (
                  <div className="bloque-instructor" key={instructor}>
                    <h3>{instructor}</h3>
                    {lista.map((aprendiz) => (
                      <div className="aprendiz-div" key={aprendiz.id}>
                        <img src={personIcon} alt="Aprendiz" className="imagen-aprendiz" />
                        <span>{aprendiz.nombre}</span>

                        {/* Solo en modo reportes se permite abrir modal y generar PDF */}
                        {esModoReportes && (
                          <button
                            className="btn-historial"
                            onClick={() => abrirModalHistorial(aprendiz)}
                          >
                            Ver historial
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>
        </div>
      </div>

      {/* Modal (solo en modo reportes) */}
      {esModoReportes && mostrarModal && (
        <div className="modal-historial" role="dialog" aria-modal="true">
          <div className="modal-contenido">
            <h2>Historial de Asistencia</h2>

            {aprendizSeleccionado && (
              <>
                <p>
                  <strong>Nombre:</strong> {aprendizSeleccionado.nombre}
                </p>
                <p>
                  <strong>ID:</strong> {aprendizSeleccionado.id}
                </p>
              </>
            )}

            {/* Tabla de historial */}
            <div className="tabla-wrapper">
              <table className="tabla-historial">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Justificación</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoHistorial ? (
                    <tr>
                      <td colSpan="3">Cargando historial…</td>
                    </tr>
                  ) : (historial || []).length === 0 ? (
                    <tr>
                      <td colSpan="3">Sin registros</td>
                    </tr>
                  ) : (
                    historial.map((h, idx) => (
                      <tr key={idx}>
                        <td>{h.fecha || h.dia || ""}</td>
                        <td>{h.estado || ""}</td>
                        <td>{h.justificacion || ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="acciones-modal">
              <button className="btn" onClick={generarPDF} disabled={cargandoHistorial || historial.length === 0}>
                Descargar PDF
              </button>
              <button className="btn btn-secundario" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
