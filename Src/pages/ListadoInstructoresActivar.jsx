import React, { useMemo, useState } from "react";
import "../styles/Listado_instructores_activar.css";
import logoSena from "/Img/logoSena.png";
import lupaIcono from "/Img/lupa_icono.png";
import personIcon from "/Img/person_icon.png";
import helpIcon from "/Img/help_icon.png";
import checkIcon from "/Img/check_circle.png";
import { FaArrowLeft } from "react-icons/fa";

const ListadoInstructoresActivar = ({ setVista }) => {
  const [busquedaIzquierda, setBusquedaIzquierda] = useState("");
  const [busquedaInstructores, setBusquedaInstructores] = useState("");
  const [instructorSeleccionado, setInstructorSeleccionado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const botonesIzquierda = useMemo(
    () =>
      ["Notificaciones"].filter((txt) =>
        txt.toLowerCase().includes(busquedaIzquierda.trim().toLowerCase())
      ),
    [busquedaIzquierda]
  );

  const instructores = useMemo(
    () => [
      "Instructor 1",
      "Instructor 2",
      "Instructor 3",
      "Instructor 4",
      "Instructor 5",
      "Instructor 6",
    ],
    []
  );

  const instructoresFiltrados = useMemo(
    () =>
      instructores.filter((i) =>
        i.toLowerCase().includes(busquedaInstructores.trim().toLowerCase())
      ),
    [instructores, busquedaInstructores]
  );

  const abrirModalConfirmacion = (nombre) => {
    setInstructorSeleccionado(nombre);
    setMostrarConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setMostrarConfirmacion(false);
    setInstructorSeleccionado(null);
  };

  const confirmarAccion = () => {
    // Aquí podrías llamar a tu API para activar el usuario
    // await fetch(`${API_URL}/instructores/activar`, { ... })
    setMostrarConfirmacion(false);
    setMostrarExito(true);
  };

  const cerrarExito = () => {
    setMostrarExito(false);
    setInstructorSeleccionado(null);
  };

  return (
    <div className="layout-listado-instructores-activar">
      {/* COLUMNA IZQUIERDA */}
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

        <div className="botones-container">
          {botonesIzquierda.map((txt, idx) => (
            <button className="boton" key={idx}>
              {txt}
            </button>
          ))}
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="form-container derecha">
        <div className="titulo">
          Te encuentras visualizando{" "}
          <span style={{ color: "#00304D" }}>el listado de</span>{" "}
          <span style={{ color: "#39A900" }}>instructores:</span>
        </div>

        <div className="sub-div">
          <input
            type="text"
            className="busqueda-instructores"
            placeholder="Buscar instructores"
            value={busquedaInstructores}
            onChange={(e) => setBusquedaInstructores(e.target.value)}
          />

          <div className="linea" />

          <div className="texto-lista">Lista de instructores:</div>

          <div className="instructor-container">
            {instructoresFiltrados.map((nombre, i) => (
              <div className="instructor" key={i}>
                <img
                  src={personIcon}
                  alt={nombre}
                  className="instructor-imagen"
                />
                {nombre}
                <button
                  className="seleccionar-boton"
                  onClick={() => abrirModalConfirmacion(nombre)}
                >
                  Seleccionar
                </button>
              </div>
            ))}

            {instructoresFiltrados.length === 0 && (
              <p style={{ color: "#999", fontWeight: "bold" }}>
                No se encontraron instructores
              </p>
            )}
          </div>
        </div>

        <p className="pie-de-pagina">
          2024 - Servicio Nacional de Aprendizaje Sena
        </p>
      </div>

      {/* MODAL CONFIRMACIÓN */}
      {mostrarConfirmacion && (
        <div className="modal" role="dialog" aria-modal="true" style={{ display: "flex" }}>
    <div className="modal-content"> 
            <img src={helpIcon} alt="Ayuda" className="modal-image" />
            <p className="modal-question">
              ¿Está seguro de activar al usuario <strong>{instructorSeleccionado}</strong>?
            </p>
            <div>
              <button className="modal-button" onClick={confirmarAccion}>
                Sí
              </button>
              <button className="modal-button" onClick={cerrarModalConfirmacion}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ÉXITO */}
      {mostrarExito && (
         <div className="modal" role="dialog" aria-modal="true" style={{ display: "flex" }}>
    <div className="modal-content"> 
            <img src={checkIcon} alt="Éxito" className="modal-image" />
            <p className="modal-text">Acción confirmada.</p>
            <p className="modal-subtext">Usuario Activado.</p>
            <button className="modal-button" onClick={cerrarExito}>
              Ok
            </button>
          </div>
        </div>
      )}

      {/* Botón de salir */}
      <div className="flecha-container">
        <button
          className="boton-flecha"
          onClick={() => setVista("desactivacion")}
        >
          <FaArrowLeft /> Salir
        </button>
      </div>
    </div>
  );
};

export default ListadoInstructoresActivar;
