// src/pages/PaginaPrincipalCoordinacion.jsx
import React, { useEffect } from "react";
import "../styles/pagina_principal.css";
import lupaIcono from "/Img/lupa_icono.png";

const PaginaPrincipalCoordinacion = ({ setVista }) => {
  useEffect(() => {
    // 👇 Lógica del buscador
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

  return (
    <div className="form-container principal">
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
    <button
  className="btn btn-ancho"
  id="btn-visualizar"
  onClick={() => setVista("listadoFichas")}
>
  Visualizar listados
</button>

   <button className="btn btn-ancho" id="btn-reporte-general" onClick={() => setVista("reporteGeneral")}>
  Reporte general
</button>

   <button className="btn btn-ancho btn-ajustado" id="btn-roles">
  Creación de roles
</button>

  </div>

  <div className="fila-botones">
    <button className="btn btn-centrado" id="btn-desactivar">
      Desactivar usuarios y fichas
    </button>
  </div>

  <div className="fila-botones">
    <button className="btn btn-ayuda" id="btn-ayuda">¿Necesitas ayuda?</button>
  </div>
</div>

      
      <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>
    </div>
  );
};

export default PaginaPrincipalCoordinacion;
