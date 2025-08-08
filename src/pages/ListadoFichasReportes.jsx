import React, { useState, useEffect } from 'react';
import '../styles/ListadoFichasReportes.css'; // ← usa el nuevo archivo CSS
import logoSena from '/Img/logoSena.png';
import lupaIcono from '/Img/lupa_icono.png';
import folderIcon from '/Img/folder_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ListadoFichasReportes = ({ setVista, setFichaId, fichaId }) => {

  useEffect(() => {
    if (fichaId) {
      console.log("🧾 Recibí ficha desde ReporteGeneral:", fichaId);
    }
  }, [fichaId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [busquedaIzquierda, setBusquedaIzquierda] = useState('');
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [mostrarModalFicha, setMostrarModalFicha] = useState(false);

  const fichas = [2617001, 2617543, 2618129, 2614968, 2612387, 2615014, 2618902];
  const fichasFiltradas = fichas.filter(ficha =>
    ficha.toString().includes(searchTerm)
  );

  const botonesIzquierda = ['Notificaciones', '¿Necesitas ayuda?'].filter(opcion =>
    opcion.toLowerCase().includes(busquedaIzquierda)
  );

  return (
    <div className="layout-listado-fichas-reportes">
      {/* COLUMNA IZQUIERDA */}
      <div className="form-container-reportes izquierda">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />
        <div className="busqueda-container">
          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar"
              className="input-busqueda-fichas"
              value={busquedaIzquierda}
              onChange={(e) => setBusquedaIzquierda(e.target.value.toLowerCase())}
            />
            <div className="icono-lupa">
              <img src={lupaIcono} alt="Icono de lupa" />
            </div>
          </div>
        </div>

        <div className="botones-container">
          {botonesIzquierda.map((opcion, index) => (
            <button className="boton" key={index}>
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="form-container-reportes derecha">
        <div className="titulo">
          Te encuentras visualizando <span style={{ color: '#00304D' }}>tu listado de</span>{' '}
          <span style={{ color: '#39A900' }}>fichas:</span>
        </div>

        <div className="busqueda-fichas" style={{ position: "relative", width: "100%", maxWidth: "1000px" }}>
          <input
            type="text"
            placeholder="Buscar ficha"
            className="input-busqueda-fichas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="icono-lupa"
            onClick={() => {
              if (searchTerm.trim() === "") {
                alert("Por favor escribe un número de ficha");
              } else if (fichasFiltradas.length === 0) {
                alert("No se encontraron coincidencias");
              }
            }}
          >
            <img src={lupaIcono} alt="Buscar" />
          </button>
        </div>

        <div className="linea"></div>

        <div className="sub-div">
          {fichasFiltradas.map((ficha) => (
            <div key={ficha} className="sub-item">
              <img src={folderIcon} alt="Icono Ficha" className="icono-sub-item" />
              Ficha - {ficha}
              <button
  className="seleccionar-boton"
  onClick={() => {
    setVista('listaAprendices');
    setFichaId(ficha);
  }}
>
  Seleccionar
</button>

            </div>
          ))}

          {fichasFiltradas.length === 0 && (
            <p style={{ color: '#aaa', fontWeight: 'bold', marginTop: '20px' }}>
              No se encontraron fichas
            </p>
          )}
        </div>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
      </div>

      {/* MODAL */}
      {mostrarModalFicha && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <p>¿Deseas ver el reporte de asistencia de la Ficha - {fichaSeleccionada}?</p>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={() => {
                  setVista({ vista: 'listaAprendices', fichaId: fichaSeleccionada });
                  setMostrarModalFicha(false);
                }}
              >
                Ver reporte
              </button>
              <button
                className="modal-button"
                onClick={() => setMostrarModalFicha(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón de salir */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => setVista('menu')}>
          <FontAwesomeIcon icon={faArrowLeft} /> Salir
        </button>
      </div>
    </div>
  );
};

export default ListadoFichasReportes;
