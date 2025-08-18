// src/pages/ListadoFichas.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Listado_fichas_Activar.css';
import logoSena from '/Img/logoSena.png';
import lupaIcono from '/Img/lupa_icono.png';
import folderIcon from '/Img/folder_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ListadoFichas = ({ setVista }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [busquedaIzquierda, setBusquedaIzquierda] = useState('');

  const fichas = [2617001, 2617543, 2618129, 2614968, 2612387, 2615014, 2618902];
  const fichasFiltradas = fichas.filter(ficha =>
    ficha.toString().includes(searchTerm)
  );

  const botonesIzquierda = ['Notificaciones', '¿Necesitas ayuda?'].filter(opcion =>
    opcion.toLowerCase().includes(busquedaIzquierda)
  );

  return (
    <div className="layout-listado-fichas">
      {/* COLUMNA IZQUIERDA */}
      <div className="form-container izquierda navegacion">
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
      <div className="form-container derecha">
        <div className="titulo">
          Te encuentras visualizando <span style={{ color: '#00304D' }}>tu listado de</span>{' '}
          <span style={{ color: '#39A900' }}>fichas:</span>
        </div>

        <div className="busqueda-fichas">
          <input
            type="text"
            placeholder="Buscar ficha"
            className="input-busqueda-fichas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
    console.log('➡️ Navegando a listaAprendices con ficha:', ficha);
    setVista('listaAprendices', { fichaId: ficha,  modo: 'visualizar' });
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

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>

        {/* Botón de salir */}
        <div className="flecha-container">
          <button className="boton-flecha" onClick={() => setVista('menu')}>
            <FontAwesomeIcon icon={faArrowLeft} /> Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListadoFichas;
