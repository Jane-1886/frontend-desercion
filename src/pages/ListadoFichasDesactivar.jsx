// src/pages/ListadoFichasDesactivar.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Listado_fichas_Desactivar.css";
import logoSena from "/img/logoSena.png";
import lupaIcono from "/img/lupa_icono.png";
import folderIcon from "/img/folder_icon.png";
import { FaArrowLeft } from "react-icons/fa";

const ListadoFichasDesactivar = () => {
  const navigate = useNavigate();

  // Demo: reemplaza luego con datos reales del backend
  const fichas = useMemo(
    () => ["2617001", "2617543", "2618129", "2614968", "2612387", "2615014", "2618902"],
    []
  );

  // Estados
  const [busquedaIzquierda, setBusquedaIzquierda] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);

  // Filtro derecha (por número de ficha)
  const fichasFiltradas = useMemo(() => {
    const t = searchTerm.trim();
    return t ? fichas.filter((f) => f.includes(t)) : fichas;
  }, [fichas, searchTerm]);

  const abrirConfirmacion = (ficha) => {
    setFichaSeleccionada(ficha);
    setModalAbierto(true);
  };

  const cerrarConfirmacion = () => {
    setModalAbierto(false);
    setFichaSeleccionada(null);
  };

  const confirmarDesactivacion = async () => {
    try {
      // Cuando conectes backend (Opción A: /api/...):
      // await api.post("/api/fichas/desactivar", { fichaId: fichaSeleccionada });

      setModalAbierto(false);
      setModalExito(true);
    } catch (e) {
      console.error(e);
      alert("No se pudo desactivar la ficha. Intenta nuevamente.");
    }
  };

  const cerrarExito = () => {
    setModalExito(false);
    setFichaSeleccionada(null);
  };

  return (
    <div className="layout-listado-fichas">
      <div className="layout-2col">
        {/* Izquierda (logo + botones) */}
        <div className="form-container izquierda navegacion">
          <img src={logoSena} alt="Logo SENA" className="imagen-header" />

          <div className="busqueda-container">
            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar"
                value={busquedaIzquierda}
                onChange={(e) => setBusquedaIzquierda(e.target.value)}
              />
              <div className="icono-lupa">
                <img src={lupaIcono} alt="Buscar" />
              </div>
            </div>
          </div>

          <div className="botones-container">
            <button className="boton" onClick={() => navigate("/notificaciones")}>
              Notificaciones
            </button>
          </div>
        </div>

        {/* Derecha (título + buscador + lista) */}
        <div className="form-container derecha">
          <div className="titulo">
            Te encuentras visualizando <span style={{ color: "#00304D" }}>tu listado de</span>{" "}
            <span style={{ color: "#39A900" }}>fichas:</span>
          </div>

          {/* Buscador a la derecha */}
          <div className="busqueda-fichas">
            <input
              className="input-busqueda-fichas"
              placeholder="Buscar ficha"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="linea"></div>

          <div className="sub-div">
            {fichasFiltradas.map((f) => (
              <div key={f} className="sub-item">
                <img src={folderIcon} alt="Ficha" className="icono-sub-item" />
                Ficha - {f}
                <button className="seleccionar-boton" onClick={() => abrirConfirmacion(f)}>
                  Seleccionar
                </button>
              </div>
            ))}
            {fichasFiltradas.length === 0 && (
              <p className="estado-vacio" style={{ color: "#999", fontWeight: "bold" }}>
                No se encontraron fichas.
              </p>
            )}
          </div>

          <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
        </div>
      </div>

      {/* Botón salir */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => navigate("/desactivacion")}>
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
              <button className="modal-button" onClick={confirmarDesactivacion}>
                Sí
              </button>
              <button className="modal-button" onClick={cerrarConfirmacion}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal éxito */}
      {modalExito && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="tituloExito">
          <div className="modal-content">
            <img src="/img/check_circle.png" alt="Éxito" style={{ marginBottom: 10 }} />
            <p id="tituloExito" className="confirmation-title">
              Acción confirmada.
            </p>
            <p className="confirmation-subtitle">Ficha {fichaSeleccionada} desactivada.</p>
            <button className="modal-button close-button" onClick={cerrarExito}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListadoFichasDesactivar;
