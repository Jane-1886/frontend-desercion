// src/pages/CrearUsuario2.jsx
import React, { useEffect, useState } from "react";
import "../styles/formulario_creacion_usuarios.css";
import eyeOn from "/Img/eye_on.png";
import eyeOff from "/Img/eye_off.png";
import errorImg from "/Img/error.png";
import okImg from "/Img/check_circle.png";

export default function CrearUsuario2({ setVista }) {
  // Form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(""); // 1 | 2 | 3
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

  useEffect(() => {
    setErrorOpen(false);
    setSuccessOpen(false);
  }, []);

  const validar = () => {
    if (!username.trim() || !email.trim() || !roleId || !password || !confirm) {
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
    const n = Number(roleId);
    if (!Number.isInteger(n) || n <= 0) {
      setErrorMsg("ID de rol inválido.");
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
      const token = localStorage.getItem("token");

      // 👇 Claves EXACTAS que requiere tu backend:
      // { nombre, contrasena, idRol, email }
      const payload = {
        nombre: username,
        contrasena: password,    // sin ñ
        idRol: Number(roleId),   // 1 | 2 | 3
        email: email,
      };

      const res = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        const msg = data?.mensaje || data?.message || `Error ${res.status}`;
        throw new Error(msg);
      }

      // Éxito
      setSuccessOpen(true);
      setUsername("");
      setEmail("");
      setRoleId("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setErrorMsg(
        `No se pudo crear el usuario. ${err?.message ? `Detalles: ${err.message}` : ""}`
      );
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-container" style={{ position: "relative" }}>
        <h1 className="title">
          <span className="title-black">Creación de </span>
          <span className="title-green">Usuarios</span>
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

          {/* Selector por ID numérico (ajusta etiquetas si tu mapeo es distinto) */}
          <div className="form-group">
            <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="" disabled hidden>Rol (ID)</option>
              <option value="1">1 - Instructor</option>
              <option value="2">2 - Bienestar al Aprendiz</option>
              <option value="3">3 - Coordinación</option>
            </select>
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
            {loading ? "Creando..." : "Crear Usuario"}
          </button>
        </form>

        {/* Botón Salir */}
        <div className="flecha-container">
          <button
            className="boton-flecha"
            type="button"
            onClick={() => setVista && setVista("menu")}
          >
            <i className="fas fa-arrow-left" /> Salir
          </button>
        </div>
      </div>

      {/* Modales */}
      {errorOpen && (
        <div className="modal" onClick={() => setErrorOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={errorImg} alt="Error" />
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
            <img src={okImg} alt="Éxito" />
            <h2>¡ÉXITOSO!</h2>
            <p>El usuario ha sido creado con éxito.</p>
            <button
              className="ok-button"
              onClick={() => {
                setSuccessOpen(false);
                setVista && setVista("menu");
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

