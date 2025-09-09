// src/pages/ListaAprendices.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/listado_aprendices.css";
import logoSena from "/img/logoSena.png";
import folderIcon from "/img/folder_icon.png";
import personIcon from "/img/person_icon.png";
import api from "../controlador/api.js";

const ListaAprendices = () => {
  const { idFicha } = useParams();       // /lista-aprendices/:idFicha
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [aprendices, setAprendices] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Helpers súper defensivos
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
    // Construye nombre de forma segura con cualquier combinación posible
    const n1 = coalesce(row?.nombre, row?.Nombre);
    if (n1) return n1;

    const n = coalesce(row?.nombres, row?.Nombres);
    const a = coalesce(row?.apellidos, row?.Apellidos);
    const full = [n, a].filter(nonEmpty).join(" ").trim();
    if (full) return full;

    // Otros campos que a veces llegan
    const alt = coalesce(row?.fullName, row?.FullName, row?.NOMBRE_COMPLETO);
    return alt || "(Sin nombre)";
  };

  const buildInstructor = (row) => {
    return (
      coalesce(row?.instructor, row?.Instructor, row?.nombreInstructor, row?.NOMBRE_INSTRUCTOR) ||
      "Sin instructor"
    );
  };

  const buildId = (row) => {
    // Acepta varias claves y convierte a string
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
        // Opción A: api.js sin /api => aquí sí incluimos /api
        const { data } = await api.get(`/api/aprendices`, { params: { ficha: idFicha } });

        // Aceptar varios formatos: array directo, {rows:[...]}, {data:[...]} o {aprendices:[...]}
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
          .filter((x) => nonEmpty(x.id)); // filtra solo válidos

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
    return () => { cancel = true; };
  }, [idFicha]);

  // Filtrado por nombre (insensible a mayúsculas)
  const listaFiltrada = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return t
      ? aprendices.filter((a) => toStr(a.nombre).toLowerCase().includes(t))
      : aprendices;
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
                          <div className="aprendiz-div" key={aprendiz.id}>
                            <img src={personIcon} alt="Aprendiz" className="imagen-aprendiz" />
                            <span>{aprendiz.nombre}</span>
                          </div>
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
    </div>
  );
};

export default ListaAprendices;
