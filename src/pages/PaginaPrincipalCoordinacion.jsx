// src/pages/PaginaPrincipalCoordinacion.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pagina_principal.css";
import lupaIcono from "/img/lupa_icono.png";

const PaginaPrincipalCoordinacion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const input = document.getElementById("busqueda");
    const botonesContainer = document.getElementById("botones-container");

    const filtrarBotones = () => {
      const filtro = input.value.toLowerCase();
      const botones = botonesContainer.querySelectorAll(".btn");

      botones.forEach((btn) => {
        const texto = btn.textContent.toLowerCase();
        btn.classList.toggle("hidden", !texto.includes(filtro));
      });
    };

    input?.addEventListener("input", filtrarBotones);
    return () => input?.removeEventListener("input", filtrarBotones);
  }, []);

  // 👉 función para cerrar sesión
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="form-container principal">
      {/* 🔹 Botón pequeño de logout (margen izquierdo) */}
      <div className="logout-container">
        <button className="btn-logout" onClick={handleLogout}>
          ⬅ salir
        </button>
      </div>

      <div className="titulo">
        Bienvenido de nuevo,{" "}
        <strong style={{ color: "#00304D" }}>(</strong>
        <strong style={{ color: "#39A900" }}>
          {localStorage.getItem("nombreUsuario") || "Nombre de usuario"}
        </strong>
        <strong style={{ color: "#00304D" }}>)</strong>. ¿Qué deseas realizar el día de{" "}
        <strong style={{ color: "#39A900" }}>hoy</strong>?
      </div>

      <div className="busqueda">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar..."
            className="input-busqueda"
            id="busqueda"
          />
          <img src={lupaIcono} alt="Buscar" className="icono-busqueda" />
        </div>
      </div>

      <div className="botones" id="botones-container">
        <div className="fila-botones">
          <button className="btn btn-ancho" onClick={() => navigate("/visualizar")}>
            Visualizar listados
          </button>

          <button className="btn btn-ancho" onClick={() => navigate("/reporte-general")}>
            Reporte general
          </button>

          <button className="boton" onClick={() => navigate("/crearUsuario2")}>
            Crear usuario
          </button>
        </div>

        <div className="fila-botones">
          <button className="boton" onClick={() => navigate("/desactivacion")}>
            Desactivar fichas y usuarios
          </button>
        </div>

        <div className="fila-botones">
          <button className="btn btn-ayuda" id="btn-ayuda">
            ¿Necesitas ayuda?
          </button>
        </div>
      </div>

      <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>
    </div>
  );
};

export default PaginaPrincipalCoordinacion;
