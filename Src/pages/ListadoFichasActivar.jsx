import React, { useMemo, useState } from "react";
import "../styles/Listado_fichas_Activar.css";
import logoSena from "/Img/logoSena.png";
import lupaIcono from "/Img/lupa_icono.png";
import folderIcon from "/Img/folder_icon.png";
import helpIcon from "/Img/help_icon.png";
import checkIcon from "/Img/check_circle.png";
import { FaArrowLeft } from "react-icons/fa";

const ListadoFichasActivar = ({ setVista }) => {
  const [busquedaIzquierda, setBusquedaIzquierda] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const botonesIzquierda = useMemo(
    () =>
      ["Notificaciones"].filter((txt) =>
        txt.toLowerCase().includes(busquedaIzquierda.trim().toLowerCase())
      ),
    [busquedaIzquierda]
  );

  const fichas = useMemo(
    () => [2617001, 2617543, 2618129, 2614968, 2612387, 2615014, 2618902],
    []
  );

  const fichasFiltradas = useMemo(
    () =>
      fichas.filter((f) => f.toString().includes(searchTerm.trim())),
    [fichas, searchTerm]
  );

  const abrirModalConfirmacion = (ficha) => {
    setFichaSeleccionada(ficha);
    setMostrarConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setMostrarConfirmacion(false);
    setFichaSeleccionada(null);
  };

  const confirmarActivacion = async () => {
    try {
      // 🔗 Aquí puedes llamar a tu backend si lo deseas:
      // await fetch(`${import.meta.env.VITE_API_URL}/fichas/activar`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ fichaId: fichaSeleccionada }),
      // });

      setMostrarConfirmacion(false);
      setMostrarExito(true);
    } catch (e) {
      console.error(e);
      alert("No se pudo activar la ficha. Intenta nuevamente.");
    }
  };

  const cerrarExito = () => {
    setMostrarExito(false);
    setFichaSeleccionada(null);
  };

  return (
    <div className="layout-listado-fichas-activar">
      {/* IZQUIERDA */}
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

        <div className="botones-container" id="button-container">
          {botonesIzquierda.map((txt, i) => (
            <button className="boton" key={i}>
              {txt}
            </button>
          ))}
        </div>
      </div>

      {/* DERECHA */}
      <div className="form-container derecha">
        <div className="titulo">
          Te encuentras visualizando{" "}
          <span style={{ color: "#00304D" }}>tu listado de</span>{" "}
          <span style={{ color: "#39A900" }}>fichas:</span>
        </div>

        <div className="busqueda-fichas" style={{ width: "100%", maxWidth: 1000 }}>
          <input
            type="text"
            placeholder="Buscar ficha"
            className="input-busqueda-fichas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div className="linea" />

        <div className="sub-div" id="ficha-container">
          {fichasFiltradas.map((ficha) => (
            <div className="sub-item" key={ficha}>
              <img src={folderIcon} alt="Icono Ficha" className="icono-sub-item" />
              Ficha - {ficha}
              <button
                className="seleccionar-boton"
                onClick={() => abrirModalConfirmacion(ficha)}
              >
                Seleccionar
              </button>
            </div>
          ))}

          {fichasFiltradas.length === 0 && (
            <p style={{ color: "#999", fontWeight: "bold" }}>
              No se encontraron fichas.
            </p>
          )}
        </div>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>
      </div>

      {/* MODAL CONFIRMACIÓN */}
      {mostrarConfirmacion && (
        <div className="modal" role="dialog" aria-modal="true" style={{ display: "flex" }}>
          <div className="modal-content">
            <img src={helpIcon} alt="Confirmación" className="modal-image" />
            <p className="modal-question">
              ¿Está seguro de realizar esta acción?
            </p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={confirmarActivacion}>Sí</button>
              <button className="modal-button" onClick={cerrarModalConfirmacion}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ÉXITO */}
      {mostrarExito && (
        <div className="modal" role="dialog" aria-modal="true" style={{ display: "flex" }}>
          <div className="modal-content">
            <img src={checkIcon} alt="Confirmado" className="modal-image" />
            <p className="confirmation-title">Acción confirmada.</p>
            <p className="confirmation-subtitle">Ficha activada.</p>
            <button className="modal-button close-button" onClick={cerrarExito}>Ok</button>
          </div>
        </div>
      )}

      {/* Botón Salir */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => setVista("desactivacion")}>
          <FaArrowLeft /> Salir
        </button>
      </div>
    </div>
  );
};

export default ListadoFichasActivar;
