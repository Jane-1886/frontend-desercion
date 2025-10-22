// src/pages/CrearUsuario2.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/formulario_creacion_usuarios.css";

// Imágenes (asegúrate de que existan en /public/img o /src/assets según tu proyecto)
import eyeOn from "/img/eye_on.png";
import eyeOff from "/img/eye_off.png";
import errorImg from "/img/error.png";
import okImg from "/img/check_circle.png";

// Tu instancia axios con baseURL/token
import api from "../controlador/api.js";

export default function CrearUsuario2() {
  const navigate = useNavigate();

  // Form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(""); // 1 | 2 | 3
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Nuevos campos
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [celular, setCelular] = useState("");

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

  // Helpers
  const onlyDigits = (s) => (s || "").replace(/\D+/g, "");

  const validar = () => {
    if (!username.trim() || !email.trim() || !roleId || !password || !confirm) {
      setErrorMsg("Por favor, llena todos los campos obligatorios.");
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

    // Validaciones suaves para los nuevos campos (opcionales)
    if (numeroDocumento && onlyDigits(numeroDocumento).length < 5) {
      setErrorMsg("El número de documento parece demasiado corto.");
      return false;
    }
    if (celular && onlyDigits(celular).length < 7) {
      setErrorMsg("El celular parece demasiado corto.");
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
      // Claves EXACTAS esperadas por tu backend:
      // { nombre, contrasena, idRol, email, tipoDocumento, numeroDocumento, celular }
      const payload = {
        nombre: username.trim(),
        contrasena: password,
        idRol: Number(roleId),
        email: email.trim(),
        tipoDocumento: tipoDocumento || null,
        numeroDocumento: numeroDocumento ? onlyDigits(numeroDocumento) : null,
        celular: celular ? onlyDigits(celular) : null,
      };

      // Usa tu instancia `api` (debe tener baseURL hacia http://localhost:3000).
      // Si tu instancia no tiene baseURL, usa la URL absoluta:
      // const url = "http://localhost:3000/api/usuarios";
      const url = "/api/usuarios";

      const resp = await api.post(url, payload);

      // Éxito: mostrar modal y limpiar el formulario
      if (resp?.status === 201) {
        setSuccessOpen(true);
        setUsername("");
        setEmail("");
        setRoleId("");
        setPassword("");
        setConfirm("");
        setTipoDocumento("");
        setNumeroDocumento("");
        setCelular("");
      } else {
        // Respuestas no 201 pero sin throw (raro)
        setErrorMsg("No se pudo crear el usuario (respuesta inesperada del servidor).");
        setErrorOpen(true);
      }
    } catch (err) {
      let msg =
        err?.response?.data?.mensaje ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo crear el usuario.";

      if (err?.response?.status === 404) {
        msg =
          "Ruta no encontrada (404). Verifica que el backend tenga POST /api/usuarios y esté montado en server.js.";
      } else if (err?.response?.status === 401) {
        msg = "No autorizado (401). Inicia sesión nuevamente.";
      } else if (err?.response?.status === 409) {
        msg = err?.response?.data?.mensaje || "El correo o el documento ya están registrados.";
      }

      setErrorMsg(msg);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Estilos inline para asegurar que los modales siempre se vean
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.45)",
    zIndex: 9999,
  };

  const modalStyle = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    maxWidth: 420,
    width: "90%",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
    textAlign: "center",
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

          <div className="form-group">
            <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="" disabled hidden>
                Rol (ID)
              </option>
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

          {/* Nuevos campos */}
          <div className="form-group">
            <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
              <option value="" disabled hidden>
                Tipo de documento 
              </option>
              <option value="CC">CC</option>
              <option value="TI">TI</option>
              <option value="CE">CE</option>
              <option value="PA">Pasaporte</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Número de documento "
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              inputMode="numeric"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Celular "
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              inputMode="tel"
            />
          </div>

          {/* Passwords */}
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

        <div className="flecha-container">
          <button className="boton-flecha" type="button" onClick={() => navigate("/menu")}>
            ← Salir
          </button>
        </div>
      </div>

      {/* Modal Error */}
      {errorOpen && (
        <div className="modal" style={overlayStyle} onClick={() => setErrorOpen(false)}>
          <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <img src={errorImg} alt="Error" style={{ width: 64, height: 64 }} />
            <h2>ERROR</h2>
            <p>{errorMsg}</p>
            <button className="ok-button" onClick={() => setErrorOpen(false)}>
              Ok
            </button>
          </div>
        </div>
      )}

      {/* Modal Éxito */}
      {successOpen && (
        <div className="modal" style={overlayStyle} onClick={() => setSuccessOpen(false)}>
          <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <img src={okImg} alt="Éxito" style={{ width: 64, height: 64 }} />
            <h2>¡ÉXITOSO!</h2>
            <p>El usuario ha sido creado con éxito.</p>
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
