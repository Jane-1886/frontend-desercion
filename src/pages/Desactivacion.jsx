// src/pages/Desactivacion.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Desactivacion.css";
import logoSena from "/img/logoSena.png";
import personOff from "/img/person_off.png";
import folderOff from "/img/folder_off.png";
import personCheck from "/img/person_check.png";
import folderOpen from "/img/folder_open.png";
import { FaArrowLeft } from "react-icons/fa";

const Desactivacion = () => {
  const navigate = useNavigate();

  return (
    <div className="layout-desactivacion">
      {/* CONTENEDOR PADRE DE 2 COLUMNAS */}
      <div className="layout-2col">
        {/* Columna izquierda */}
        <div className="form-container izquierda navegacion">
          <img src={logoSena} alt="Logo SENA" className="imagen-header" />
        </div>

        {/* Columna derecha */}
        <div className="form-container derecha">
          <div className="titulo">
            Te encuentras <span style={{ color: "#00304D" }}>realizando la</span>{" "}
            <span style={{ color: "#39A900" }}>desactivación:</span>
          </div>

          <div className="form-container sub-div">
            <div className="sub-div-titulo">Desactiva usuarios y fichas aquí:</div>
            <hr className="linea-separadora" />

            <div className="espaciado-boton">
              <div className="boton-con-imagen">
                <img src={personOff} alt="Desactivar usuario" className="imagen-boton" />
                <button className="btn" onClick={() => navigate("/desactivar-usuario")}>
                  Desactivar usuarios
                </button>
              </div>
              <div className="boton-con-imagen">
                <img src={folderOff} alt="Desactivar ficha" className="imagen-boton" />
                <button
                  className="boton-desactivar"
                  onClick={() => navigate("/listado-fichas-desactivar")}
                >
                  Desactivar ficha
                </button>
              </div>
            </div>

            <div className="espaciado-boton">
              <div className="boton-con-imagen">
                <img src={personCheck} alt="Activar usuario" className="imagen-boton" />
                <button
                  className="boton-activar"
                  onClick={() => navigate("/listado-instructores-activar")}
                >
                  Activar usuario
                </button>
              </div>
              <div className="boton-con-imagen">
                <img src={folderOpen} alt="Activar ficha" className="imagen-boton" />
                <button
                  className="boton-activar"
                  onClick={() => navigate("/listado-fichas-activar")}
                >
                  Activar ficha
                </button>
              </div>
            </div>
          </div>

          <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
        </div>
      </div>

      {/* Botón salir */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => navigate("/reporte-general")}>
          <FaArrowLeft /> Salir
        </button>
      </div>
    </div>
  );
};

export default Desactivacion;
