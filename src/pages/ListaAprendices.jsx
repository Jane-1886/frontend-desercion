// src/pages/ListaAprendices.jsx
import React, { useState } from "react";
import "../styles/listado_aprendices.css";
import logoSena from "/Img/logoSena.png";
import lupaIcono from "/Img/lupa_icono.png";
import folderIcon from "/Img/folder_icon.png";
import personIcon from "/Img/person_icon.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ListaAprendices = ({ setVista, fichaId }) => {
  const [busqueda, setBusqueda] = useState("");
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModalHistorial = (aprendiz) => {
    setAprendizSeleccionado(aprendiz);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setAprendizSeleccionado(null);
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text(`Historial de Asistencia`, 10, 10);
    doc.text(`Nombre: ${aprendizSeleccionado.nombre}`, 10, 20);
    doc.text(`ID: ${aprendizSeleccionado.id}`, 10, 30);

    doc.autoTable({
      startY: 40,
      head: [["Día", "Estado"]],
      body: [
        ["Lunes", "Asistió"],
        ["Martes", "No asistió"],
        ["Miércoles", "Asistió"],
      ],
    });

    doc.save("historial_aprendiz.pdf");
  };

  // Datos de ejemplo
  const aprendices = [
    { id: "001", nombre: "Aprendiz 1", instructor: "Instructor 1" },
    { id: "002", nombre: "Aprendiz 2", instructor: "Instructor 1" },
    { id: "003", nombre: "Aprendiz 3", instructor: "Instructor 2" },
    { id: "004", nombre: "Aprendiz 4", instructor: "Instructor 2" },
  ];

  return (
    <div className="body-listado-aprendices">
      <div className="contenedor-principal">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="form-container izquierda navegacion">
          <img src={logoSena} alt="Logo SENA" className="imagen-header" />
          <div className="busqueda-container">
            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar"
                aria-label="Buscar"
                className="input-busqueda"
              />
              <img
                src={lupaIcono}
                alt="Icono de búsqueda"
                className="icono-lupa"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="botones-container">
            <button className="boton btn">Notificaciones</button>
            <button className="boton btn">¿Necesitas ayuda?</button>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="form-container derecha">

          {/* Botón fijo para regresar */}
          <button
            className="volver-btn-fijo"
            onClick={() => setVista("listadoFichas")}
          >
            ⬅ Volver
          </button>

          <h1 className="titulo">
            Te encuentras en el{" "}
            <span style={{ color: "#00304D" }}>listado de</span>{" "}
            <span style={{ color: "#39A900" }}>aprendices:</span>
          </h1>

          <div className="sub-div">
            <div className="ficha-container">
              <img src={folderIcon} alt="Icono de ficha" className="ficha-imagen" />
              <div className="ficha">Ficha: {fichaId}</div>
            </div>

            <div className="linea"></div>

            <div className="info-pequeña">
              <div className="campo-busqueda">
                <input
                  type="text"
                  placeholder="Escribe el nombre del aprendiz..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <p className="lista-titulo">Lista de aprendices:</p>

            <div className="lista-aprendices">
              {["Instructor 1", "Instructor 2"].map((instructor) => (
                <div className="bloque-instructor" key={instructor}>
                  <h3>{instructor}</h3>
                  {aprendices
                    .filter((a) => a.instructor === instructor)
                    .filter((a) =>
                      a.nombre.toLowerCase().includes(busqueda.toLowerCase())
                    )
                    .map((aprendiz) => (
                      <div className="aprendiz-div" key={aprendiz.id}>
                        <img
                          src={personIcon}
                          alt="Aprendiz"
                          className="imagen-aprendiz"
                        />
                        {aprendiz.nombre}
                       
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <p className="pie-de-pagina">
            2024 - Servicio Nacional de Aprendizaje Sena
          </p>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal-historial">
          <div className="modal-contenido">
            <h2>Historial de Asistencia</h2>
            <p>
              <strong>Nombre:</strong> {aprendizSeleccionado.nombre}
            </p>
            <p>
              <strong>ID:</strong> {aprendizSeleccionado.id}
            </p>

            <table>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lunes</td>
                  <td>Asistió</td>
                </tr>
                <tr>
                  <td>Martes</td>
                  <td>No asistió</td>
                </tr>
                <tr>
                  <td>Miércoles</td>
                  <td>Asistió</td>
                </tr>
              </tbody>
            </table>

            <button onClick={generarPDF}>Descargar PDF</button>
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaAprendices;
