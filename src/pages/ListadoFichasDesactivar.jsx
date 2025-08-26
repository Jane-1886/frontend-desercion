import React from "react";
import { useState } from "react";
import "../styles/Listado_fichas_Desactivar.css";
import logoSena from "/Img/logoSena.png";
import lupaIcono from "/Img/lupa_icono.png";
import folderIcon from "/Img/folder_icon.png";
import { FaArrowLeft } from "react-icons/fa";

const ListadoFichasDesactivar = ({ setVista }) => {
  const fichas = ["2617001","2617543","2618129","2614968","2612387","2615014","2618902"];
const [modalAbierto, setModalAbierto] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);

  const abrirConfirmacion = (ficha) => {
    setFichaSeleccionada(ficha);
    setModalAbierto(true);
  };

  const cerrarConfirmacion = () => {
    setModalAbierto(false);
    setFichaSeleccionada(null);
  };

  const confirmarDesactivacion = () => {
    // Aquí podrías llamar a tu API para desactivar la ficha
    // await fetch(...)

    setModalAbierto(false);
    setModalExito(true);
  };

  const cerrarExito = () => {
    setModalExito(false);
    setFichaSeleccionada(null);
    // Si quieres volver a la vista principal de desactivación:
    // setVista("desactivacion");
  };
  return (
    <div className="layout-listado-fichas">
      <div className="layout-2col">
        {/* Izquierda */}
        <div className="form-container izquierda navegacion">
          <img src={logoSena} alt="Logo SENA" className="imagen-header" />
          <div className="busqueda-container">
            <div className="busqueda">
              <input type="text" placeholder="Buscar" />
              <div className="icono-lupa">
                <img src={lupaIcono} alt="Buscar" />
              </div>
            </div>
          </div>
          <div className="botones-container">
            <button className="boton" onClick={() => setVista("notificaciones")}>Notificaciones</button>
            
          </div>
        </div>

        {/* Derecha */}
        <div className="form-container derecha">
          <div className="titulo">
            Te encuentras visualizando <span style={{color:"#00304D"}}>tu listado de</span>{" "}
            <span style={{color:"#39A900"}}>fichas:</span>
          </div>

          <div className="busqueda-fichas">
            <input className="input-busqueda-fichas" placeholder="Buscar ficha" />
          </div>

          <div className="linea"></div>

          <div className="sub-div">
            {fichas.map((f) => (
              <div key={f} className="sub-item">
                <img src={folderIcon} alt="Ficha" className="icono-sub-item" />
                Ficha - {f}
                <button
                  className="seleccionar-boton"
                  onClick={() => abrirConfirmacion(f)}
                >
                  Seleccionar
                </button>
              </div>
            ))}
          </div>

          <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
        </div>
      </div>

      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => setVista("desactivacion")}>
          <FaArrowLeft /> Salir
        </button>
      </div>

     {/* Modal confirmación */}
      {modalAbierto && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="tituloConfirmacion">
          <div className="modal-content">
            <img src="/Img/help_icon.png" alt="Advertencia" />
            <p id="tituloConfirmacion">¿Deseas desactivar la ficha {fichaSeleccionada}?</p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={confirmarDesactivacion}>Sí</button>
              <button className="modal-button" onClick={cerrarConfirmacion}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal éxito */}
      {modalExito && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="tituloExito">
          <div className="modal-content">
            <img src="/Img/check_circle.png" alt="Éxito" style={{ marginBottom: 10 }} />
            <p id="tituloExito" className="confirmation-title">Acción confirmada.</p>
            <p className="confirmation-subtitle">Ficha {fichaSeleccionada} desactivada.</p>
            <button className="modal-button close-button" onClick={cerrarExito}>Ok</button>
          </div>
        </div>
      )}


    </div>
  );
};

export default ListadoFichasDesactivar;
