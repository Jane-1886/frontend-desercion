// src/pages/ListaAprendices.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/listado_aprendices.css";
import logoSena from "/img/logoSena.png";
import folderIcon from "/img/folder_icon.png";
import personIcon from "/img/person_icon.png";
import api from "../controlador/api.js";

const ListaAprendices = () => {
  const { idFicha } = useParams(); // /lista-aprendices/:idFicha
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [aprendices, setAprendices] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Modal Historial
  const [modalOpen, setModalOpen] = useState(false);
  const [aprendizSel, setAprendizSel] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState("");

  // Helpers
  const toStr = (v) => (v == null ? "" : String(v));
  const nonEmpty = (s) => toStr(s).trim().length > 0;
  const coalesce = (...vals) => {
    for (const v of vals) {
      const s = toStr(v).trim();
      if (s) return s;
    }
    return "";
  };
  const buildNombre = (row) => {
    const n1 = coalesce(row?.nombre, row?.Nombre);
    if (n1) return n1;
    const n = coalesce(row?.nombres, row?.Nombres);
    const a = coalesce(row?.apellidos, row?.Apellidos);
    const full = [n, a].filter(nonEmpty).join(" ").trim();
    if (full) return full;
    const alt = coalesce(row?.fullName, row?.FullName, row?.NOMBRE_COMPLETO);
    return alt || "(Sin nombre)";
  };
  const buildInstructor = (row) =>
    coalesce(row?.instructor, row?.Instructor, row?.nombreInstructor, row?.NOMBRE_INSTRUCTOR) ||
    "Sin instructor";

  const buildId = (row) => {
    const idRaw =
      row?.id ??
      row?.ID ??
      row?.ID_Aprendiz ??
      row?.id_aprendiz ??
      row?.idAprendiz ??
      row?.documento ??
      row?.Documento ??
      row?.doc ??
      row?.DOC ??
      "";
    return toStr(idRaw);
  };

  useEffect(() => {
    let cancel = false;

    const cargarAprendices = async () => {
      setCargando(true);
      setError("");
      try {
        const { data } = await api.get(`/api/aprendices`, { params: { ficha: idFicha } });

        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.rows)
          ? data.rows
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.aprendices)
          ? data.aprendices
          : [];

        const normalizados = arr
          .map((row) => {
            const id = buildId(row);
            const nombre = buildNombre(row);
            const instructor = buildInstructor(row);
            return { ...row, id, nombre, instructor };
          })
          .filter((x) => nonEmpty(x.id));

        if (!cancel) setAprendices(normalizados);
      } catch (e) {
        if (!cancel) {
          if (e?.response?.status === 401) setError("No estás autenticada. Inicia sesión.");
          else if (e?.response?.status === 403) setError("No tienes permisos para ver aprendices.");
          else setError("No se pudieron cargar los aprendices. Verifica el backend.");
        }
      } finally {
        if (!cancel) setCargando(false);
      }
    };

    cargarAprendices();
    return () => {
      cancel = true;
    };
  }, [idFicha]);

  // Filtrado por nombre
  const listaFiltrada = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return t ? aprendices.filter((a) => toStr(a.nombre).toLowerCase().includes(t)) : aprendices;
  }, [aprendices, busqueda]);

  // Agrupar por instructor
  const grupos = useMemo(() => {
    const map = new Map();
    for (const a of listaFiltrada) {
      const key = a.instructor || "Sin instructor";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(a);
    }
    return Array.from(map.entries()); // [ [instructor, [...aprendices]] ]
  }, [listaFiltrada]);

  // Abrir modal y traer historial del backend
  const abrirHistorial = async (aprendiz) => {
    setAprendizSel(aprendiz);
    setHistorial([]);
    setErrorHistorial("");
    setModalOpen(true);
    setCargandoHistorial(true);
    try {
      // Ruta que ajustamos en el router: /api/asistencias/por-aprendiz/:id
      const url = `/api/asistencias/por-aprendiz/${encodeURIComponent(aprendiz.id)}`;
      const { data } = await api.get(url);

      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.rows)
        ? data.rows
        : [];

      setHistorial(lista);
    } catch (e) {
      console.error("[Historial] error:", e);
      // 👇 Este es el catch que te comenté: mensaje claro por status
      let msg = "No se pudo cargar el historial de asistencia.";
      if (e?.response?.status === 401) msg = "No estás autenticada. Inicia sesión.";
      else if (e?.response?.status === 403) msg = "No tienes permisos para ver el historial.";
      setErrorHistorial(msg);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const cerrarHistorial = () => {
    setModalOpen(false);
    setAprendizSel(null);
    setHistorial([]);
    setErrorHistorial("");
  };

  // Estilos inline simples para modal
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };
  const modalStyle = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "95%",
    maxWidth: 900,
    maxHeight: "85vh",
    overflow: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
  };
  const headStyle = { marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" };
  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const thtd = { border: "1px solid #e5e7eb", padding: "8px", fontSize: 13, textAlign: "center" };

  const cuenta = (r) => {
    const v = [r.Lunes, r.Martes, r["Miércoles"], r.Jueves, r.Viernes];
    let pres = 0,
      aus = 0;
    v.forEach((d) => {
      if (d === "Sí asistió" || d === "Justificada") pres++;
      else if (d === "No asistió" || d === "No justificada") aus++;
    });
    return { pres, aus };
  };

  return (
    <div className="body-listado-aprendices">
      <div className="contenedor-principal">
        {/* IZQUIERDA */}
        <div className="form-container izquierda navegacion">
          <img src={logoSena} alt="Logo SENA" className="imagen-header" />
        </div>

        {/* DERECHA */}
        <div className="form-container derecha">
          <button className="volver-btn-fijo" onClick={() => navigate(-1)}>
            ⬅ Volver
          </button>

          <h1 className="titulo">
            Te encuentras en el <span style={{ color: "#00304D" }}>listado de</span>{" "}
            <span style={{ color: "#39A900" }}>aprendices</span>
          </h1>

          <div className="sub-div">
            {/* Cabecera con ficha */}
            <div className="ficha-container">
              <img src={folderIcon} alt="Icono de ficha" className="ficha-imagen" />
              <div className="ficha">Ficha: {idFicha}</div>
            </div>

            <div className="linea" />

            {/* Buscador */}
            <div className="info-pequeña">
              <input
                type="text"
                placeholder="Buscar aprendiz por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Estados */}
            {cargando && <p className="cargando">Cargando aprendices...</p>}
            {error && <p className="error">{error}</p>}

            {/* Lista */}
            {!cargando && !error && (
              <>
                <p className="lista-titulo">Lista de aprendices:</p>
                <div className="lista-aprendices">
                  {grupos.length === 0 ? (
                    <p className="sin-resultados">No hay aprendices para esta ficha.</p>
                  ) : (
                    grupos.map(([instructor, lista]) => (
                      <div className="bloque-instructor" key={instructor}>
                        <h3>{instructor}</h3>
                        {lista.map((aprendiz) => (
                          <button
                            type="button"
                            className="aprendiz-div"
                            key={aprendiz.id}
                            onClick={() => abrirHistorial(aprendiz)}
                            style={{ cursor: "pointer" }}
                            title="Ver historial de asistencia"
                          >
                            <img src={personIcon} alt="Aprendiz" className="imagen-aprendiz" />
                            <span>{aprendiz.nombre}</span>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
        </div>
      </div>

      {/* MODAL HISTORIAL */}
      {modalOpen && (
        <div style={overlayStyle} onClick={cerrarHistorial}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headStyle}>
              <h2 style={{ margin: 0 }}>
                Historial de asistencia — {aprendizSel?.nombre} (ID: {aprendizSel?.id})
              </h2>
              <button onClick={cerrarHistorial} style={{ padding: "6px 10px" }}>
                Cerrar ✖
              </button>
            </div>

            {cargandoHistorial && <p>Cargando historial…</p>}
            {errorHistorial && <p style={{ color: "#b00020" }}>{errorHistorial}</p>}

            {!cargandoHistorial && !errorHistorial && (
              <>
                {historial.length === 0 ? (
                  <p>No hay registros de asistencia.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thtd}>#</th>
                          <th style={thtd}>Semana / Fecha</th>
                          <th style={thtd}>Lunes</th>
                          <th style={thtd}>Martes</th>
                          <th style={thtd}>Miércoles</th>
                          <th style={thtd}>Jueves</th>
                          <th style={thtd}>Viernes</th>
                          <th style={thtd}>Pres</th>
                          <th style={thtd}>Aus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historial.map((r, i) => {
                          const { pres, aus } = cuenta(r);
                          const fecha = r.Fecha_Semana || r.Fecha || r.fecha || "";
                          return (
                            <tr key={r.ID_Asistencia || i}>
                              <td style={thtd}>{i + 1}</td>
                              <td style={thtd}>{fecha ? String(fecha).slice(0, 10) : `Semana ${i + 1}`}</td>
                              <td style={thtd}>{r.Lunes ?? "-"}</td>
                              <td style={thtd}>{r.Martes ?? "-"}</td>
                              <td style={thtd}>{r["Miércoles"] ?? "-"}</td>
                              <td style={thtd}>{r.Jueves ?? "-"}</td>
                              <td style={thtd}>{r.Viernes ?? "-"}</td>
                              <td style={thtd}>{pres}</td>
                              <td
                                style={{
                                  ...thtd,
                                  color: aus >= 3 ? "#b00020" : "inherit",
                                  fontWeight: aus >= 3 ? 700 : 400,
                                }}
                              >
                                {aus}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaAprendices;
