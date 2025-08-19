
// src/pages/ReporteGeneral.jsx
import React, { useState } from "react";
import "../styles/Reporte_general.css";
import logoSena from "/Img/logoSena.png";
import folderIcon from "/Img/folder_icon.png";
import lupaIcono from "/Img/lupa_icono.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ReporteGeneral = ({ setVista }) => {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(null);

  const fichas = ["2615800", "2621934", "2635721", "2648105", "2653749", "2668192", "2674953"];

  const fichasFiltradas = fichas.filter((ficha) =>
    ficha.includes(busqueda.trim())
  );

  const abrirModal = (idFicha) => {
    setModalAbierto(idFicha);
  };

  const cerrarModal = () => {
    setModalAbierto(null);
  };

  // ✅ Navega a ListaAprendices con la forma que espera App:
  // setVista('listaAprendices', { fichaId, modo: 'reportes' })
  const generarReporte = (ficha) => {
    setVista("listaAprendices", { fichaId: ficha, modo: "reportes" });
    setModalAbierto(null);
  };

  return (
    <div className="layout-dos-columnas">
      {/* COLUMNA IZQUIERDA */}
      <div className="form-container izquierda navegacion">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />

        <div className="busqueda-container">
          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <img src={lupaIcono} alt="Buscar" className="icono-lupa" />
          </div>
        </div>

        <div className="botones-container">
          <button className="boton" onClick={() => setVista("listadoFichasReportes")}>
            Visualizar listados
          </button>

          {/* ✅ Botón que pediste: lleva a la vista Desactivacion.jsx */}
          <button className="boton" onClick={() => setVista("desactivacion")}>
            Desactivar usuarios y fichas
          </button>

          <button className="boton" onClick={() => setVista("notificaciones")}>
            Notificaciones
          </button>

          <button className="boton" onClick={() => setVista("menuAyuda")}>
            ¿Necesitas ayuda?
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

        <div className="fichas-container">
          {fichasFiltradas.map((ficha, index) => (
            <div className="ficha" key={ficha}>
              <img src={folderIcon} className="imagen-ficha" alt={`Ficha ${index}`} />
              <span className="texto-ficha">Ficha - {ficha}</span>

              {/* Puedes abrir el modal de confirmación... */}
              <button className="boton-ficha" onClick={() => abrirModal(ficha)}>
                Seleccionar
              </button>

              {/* ...o navegar directo sin modal:
              <button
                className="boton-ficha"
                onClick={() => setVista("listaAprendices", { fichaId: ficha, modo: "reportes" })}
              >
                Seleccionar
              </button>
              */}
            </div>
          ))}
        </div>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>

        {/* Botón de regresar */}
        <div className="flecha-container">
          <button className="boton-flecha" onClick={() => setVista("menu")}>
            <FontAwesomeIcon icon={faArrowLeft} /> Regresar
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN PARA GENERAR REPORTE */}
      {modalAbierto && (
        <div className="modal">
          <div className="modal-content">
            <p>
              ¿Deseas generar el <strong>reporte de asistencia</strong> de los aprendices de la
              ficha <strong>{modalAbierto}</strong>?
            </p>
            <div className="botones-modal">
              <button className="boton-generar-modal" onClick={() => generarReporte(modalAbierto)}>
                Generar reporte
              </button>
              <button className="boton-generar-modal cerrar" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteGeneral;
