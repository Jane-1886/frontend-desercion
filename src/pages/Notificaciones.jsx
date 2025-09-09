// src/pages/Notificaciones.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/notificaciones.css";
import logoSena from "/img/logoSena.png";
import notiIcon from "/img/notifications.png";

const Notificaciones = () => {
  const navigate = useNavigate();

  return (
    <div className="layout-notificaciones">
      {/* Columna izquierda */}
      <div className="form-container izquierda navegacion">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />
        <div className="busqueda-container">{/* (vacío por ahora) */}</div>
      </div>

      {/* Columna derecha */}
      <div className="form-container derecha">
        <div className="titulo">
          Te encuentras <span style={{ color: "#00304D" }}>visualizando tu listado de</span>{" "}
          <span style={{ color: "#39A900" }}>notificaciones:</span>
        </div>

        <div className="subtitulo-notificaciones">Notificaciones más recientes:</div>
        <div className="linea"></div>

        <div className="scrollable-recent-notifications">
          <div className="sub-div">
            {/* Notificación reciente 1 */}
            <div className="sub-div-item">
              <div className="sub-div-image">
                <img src={notiIcon} alt="Imagen" className="imagen-sub-div" />
              </div>
              <div className="sub-div-content">
                <div className="sub-div-title">Solicitud de desactivación de ficha</div>
                <div className="sub-div-date">Fecha: 20/11/2024</div>
                <div className="sub-div-status">Estado: Pendiente</div>
                <div className="sub-div-time">Hora de la solicitud: 09:30 AM</div>
                <div className="sub-div-description">
                  Solicitud para desactivar la ficha 2617543 con formación terminada en etapa lectiva.
                </div>
              </div>
            </div>

            {/* Notificación reciente 2 */}
            <div className="sub-div-item">
              <div className="sub-div-image">
                <img src={notiIcon} alt="Imagen" className="imagen-sub-div" />
              </div>
              <div className="sub-div-content">
                <div className="sub-div-title">Solicitud de retiro de aprendiz</div>
                <div className="sub-div-date">Fecha: 21/11/2024</div>
                <div className="sub-div-status">Estado: Pendiente</div>
                <div className="sub-div-time">Hora de la solicitud: 02:00 PM</div>
                <div className="sub-div-description">
                  Solicitud para retirar a un aprendiz debido a motivos personales.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="subtitulo-notificaciones">Notificaciones antiguas:</div>
        <div className="linea"></div>

        <div className="scrollable-old-notifications">
          <div className="sub-div">
            <div className="sub-div-item">
              <div className="sub-div-image">
                <img src={notiIcon} alt="Imagen" className="imagen-sub-div" />
              </div>
              <div className="sub-div-content">
                <div className="sub-div-title">Solicitud de desactivación de ficha</div>
                <div className="sub-div-date">Fecha: 15/11/2024</div>
                <div className="sub-div-status">Estado: Aprobada</div>
                <div className="sub-div-time">Hora de la solicitud: 03:00 PM</div>
                <div className="sub-div-description">
                  Solicitud para desactivar la ficha 2615014 con formación terminada en etapa lectiva.
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="boton volver" onClick={() => navigate("/reporte-general")}>
          ← Volver a Reporte General
        </button>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>
      </div>
    </div>
  );
};

export default Notificaciones;
