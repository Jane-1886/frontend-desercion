// src/pages/CrearUsuario.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/formulario_creacion_usuarios.css";
import eyeOn from "/img/eye_on.png";
import eyeOff from "/img/eye_off.png";
import errorimg from "/img/error.png";
import okimg from "/img/check_circle.png";
import api from "../controlador/api.js"; // ✅ axios con baseURL + token

export default function CrearUsuario() {
  const navigate = useNavigate();

  // Form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // UI
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modales
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Por favor, llena todos los campos.");
  const [successOpen, setSuccessOpen] = useState(false);

  // 🔒 Coordinador fijo (ID 3)
  const COORDINADOR_ID = 3;

  useEffect(() => {
    setErrorOpen(false);
    setSuccessOpen(false);
  }, []);

  const validar = () => {
    if (!username.trim() || !email.trim() || !password || !confirm) {
      setErrorMsg("Por favor, llena todos los campos.");
      return false;
    }
    const correoOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!correoOK) {
      setErrorMsg("El correo electrónico no es válido.");
      return false;
    }
    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    if (password !== confirm) {
      setErrorMsg("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) {
      setErrorOpen(true);
      return;
    }

    setLoading(true);
    try {
      // 👇 NOMBRES EXACTOS QUE PIDE TU BACKEND:
      // { nombre, contrasena, idRol, email }
      const payload = {
        nombre: username,
        contrasena: password,   // sin ñ
        idRol: COORDINADOR_ID,  // 3
        email: email,
      };

      await api.post("/api/usuarios", payload);

      // Éxito
      setSuccessOpen(true);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      const msg =
        err?.response?.data?.mensaje ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo crear el coordinador.";
      setErrorMsg(`No se pudo crear el coordinador. ${msg ? `Detalles: ${msg}` : ""}`);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-container" style={{ position: "relative" }}>
        <h1 className="title">
          <span className="title-black">Crear </span>
          <span className="title-green">Coordinador</span>
        </h1>

        <form id="roleForm" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nombre Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group password-container">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Contraseña"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              className="toggle-eye"
              src={showPass ? eyeOff : eyeOn}
              alt={showPass ? "Ocultar Contraseña" : "Mostrar Contraseña"}
              onClick={() => setShowPass((v) => !v)}
              role="button"
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="form-group password-container">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar Contraseña"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <img
              className="toggle-eye"
              src={showConfirm ? eyeOff : eyeOn}
              alt={showConfirm ? "Ocultar Contraseña" : "Mostrar Contraseña"}
              onClick={() => setShowConfirm((v) => !v)}
              role="button"
              style={{ cursor: "pointer" }}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Coordinador"}
          </button>
        </form>

        {/* Botón Salir */}
        <div className="flecha-container">
          <button className="boton-flecha" type="button" onClick={() => navigate("/menu")}>
            ← Salir
          </button>
        </div>
      </div>

      {/* Modales */}
      {errorOpen && (
        <div className="modal" onClick={() => setErrorOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={errorimg} alt="Error" />
            <h2>ERROR</h2>
            <p>{errorMsg}</p>
            <button className="ok-button" onClick={() => setErrorOpen(false)}>
              Ok
            </button>
          </div>
        </div>
      )}

      {successOpen && (
        <div className="modal" onClick={() => setSuccessOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={okimg} alt="Éxito" />
            <h2>¡ÉXITOSO!</h2>
            <p>El coordinador ha sido creado con éxito.</p>
            <button
              className="ok-button"
              onClick={() => {
                setSuccessOpen(false);
                navigate("/menu");
              }}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
}
