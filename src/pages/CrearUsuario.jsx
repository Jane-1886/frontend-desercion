import React, { useState } from "react";
import "../styles/formulario_creacion_usuarios.css";

const CrearUsuario = ({ setVista }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    const { nombre, email, contrasena, confirmarContrasena } = formData;

    if (!nombre || !email || !contrasena || !confirmarContrasena) {
      document.getElementById("myModal").style.display = "flex";
      return;
    }

    if (contrasena !== confirmarContrasena) {
      alert("⚠️ Las contraseñas no coinciden.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 👇 Forzamos rol: 3 (coordinador)
        body: JSON.stringify({ nombre, email, contrasena, idRol: 3 }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        document.getElementById("successModal").style.display = "flex";
      } else {
        alert(data.mensaje || "❌ Error al crear usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ No se pudo conectar con el servidor");
    }
  };

  const cerrarModal = () => {
    document.getElementById("myModal").style.display = "none";
    document.getElementById("successModal").style.display = "none";
  };

  return (
    <>
      <div className="form-container">
        <h1 className="title">
          <span className="title-black">Registro de </span>
          <span className="title-green">Coordinador</span>
        </h1>
        <form onSubmit={crearUsuario}>
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Usuario"
              value={formData.nombre}
              onChange={manejarCambio}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={manejarCambio}
            />
          </div>
          <div className="form-group password-container">
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={manejarCambio}
              autoComplete="off"
            />
          </div>
          <div className="form-group password-container">
            <input
              type="password"
              name="confirmarContrasena"
              placeholder="Confirmar Contraseña"
              value={formData.confirmarContrasena}
              onChange={manejarCambio}
              autoComplete="off"
            />
          </div>
          <button type="submit">Registrar</button>

          
        </form>
      </div>
      

      {/* Modal de error */}
      <div id="myModal" className="modal">
        <div className="modal-content">
          <img src="/Img/error.png" alt="Error" />
          <h2>ERROR</h2>
          <p>Por favor, llena todos los campos.</p>
          <button className="ok-button" onClick={cerrarModal}>Ok</button>
        </div>
      </div>

      {/* Modal de éxito */}
      <div id="successModal" className="modal">
        <div className="modal-content">
          <img src="/Img/check_circle.png" alt="Éxito" />
          <h2>¡ÉXITOSO!</h2>
          <p>El Coordinador ha sido creado correctamente.</p>
          <button className="ok-button" onClick={cerrarModal}>Ok</button>
        </div>
      </div>

      {/* Botón de regresar */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => setVista("login")}>
          <i className="fas fa-arrow-left"></i> Salir
        </button>
      </div>
    </>
  );
};

export default CrearUsuario;
