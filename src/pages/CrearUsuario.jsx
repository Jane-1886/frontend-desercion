// src/pages/CrearUsuario.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/formulario_creacion_usuarios.css";
import eyeOn from "/img/eye_on.png";
import eyeOff from "/img/eye_off.png";
import errorimg from "/img/error.png";
import okimg from "/img/check_circle.png";
import api from "../controlador/api.js"; // axios con baseURL + token

/* =========================
   Modal en el mismo archivo
   ========================= */
function Modal({ open, onClose, icon, title, children, okText = "Ok", onOk }) {
  // Cerrar con ESC
  const handleKey = useCallback(
    (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    },
    [open, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Click afuera
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) {
      onClose?.();
    }
  };

  return (
    <div className={`modal ${open ? "open" : ""}`} onClick={handleBackdropClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {icon && <img src={icon} alt="" />}
        {title && <h2>{title}</h2>}
        {children}
        <button
          className="ok-button"
          onClick={() => {
            onOk ? onOk() : onClose?.();
          }}
        >
          {okText}
        </button>
      </div>
    </div>
  );
}

export default function CrearUsuario() {
  const navigate = useNavigate();

  // Form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("CC");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // UI
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modales (usarán .modal.open del CSS)
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Por favor, llena todos los campos.");
  const [successOpen, setSuccessOpen] = useState(false);

  // 🔒 Coordinador fijo (ID 3)
  const COORDINADOR_ID = 3;

  useEffect(() => {
    setErrorOpen(false);
    setSuccessOpen(false);
  }, []);

  // Bloquear scroll cuando cualquier modal esté abierto
  useEffect(() => {
    const anyOpen = errorOpen || successOpen;
    const original = document.body.style.overflow;
    document.body.style.overflow = anyOpen ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [errorOpen, successOpen]);

  const soloDigitos = (s) => s.replace(/\D+/g, "");

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
    if (numeroDocumento && !/^\d{5,30}$/.test(numeroDocumento)) {
      setErrorMsg("El número de documento debe tener solo dígitos (5–30).");
      return false;
    }
    if (celular && !/^\d{7,20}$/.test(celular)) {
      setErrorMsg("El celular debe tener solo dígitos (7–20).");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validar()) {
      setErrorOpen(true); // muestra el modal de error
      return;
    }

    setLoading(true);

    const payload = {
      nombre: username.trim(),
      contrasena: password, // sin 'ñ'
      idRol: COORDINADOR_ID, // 3
      email: email.trim(),
      tipoDocumento: tipoDocumento || null,
      numeroDocumento: numeroDocumento || null,
      celular: celular || null,
    };

    try {
      // Asegura que la ruta salga a /api/usuarios (evita 404)
      const res = await api.post("/api/usuarios", payload, { timeout: 10000 });
      if (res?.status === 201) {
        setErrorOpen(false);
        setSuccessOpen(true); // muestra el modal de éxito

        // Limpia formulario
        setUsername("");
        setEmail("");
        setTipoDocumento("CC");
        setNumeroDocumento("");
        setCelular("");
        setPassword("");
        setConfirm("");
      } else {
        throw new Error(`Estado inesperado: ${res?.status}`);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.mensaje ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo crear el coordinador.";
      setErrorMsg(`No se pudo crear el coordinador. Detalles: ${msg}`);
      setErrorOpen(true); // muestra el modal de error
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

          <div
            className="form-row"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
          >
            <div className="form-group">
              <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
              >
                <option value="CC">Cédula (CC)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
                <option value="PAS">Pasaporte (PAS)</option>
              </select>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Número de Documento"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(soloDigitos(e.target.value))}
                autoComplete="off"
                inputMode="numeric"
              />
            </div>
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

          {/* ✅ Campo Celular */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Número de Celular"
              value={celular}
              onChange={(e) => setCelular(soloDigitos(e.target.value))}
              autoComplete="off"
              inputMode="numeric"
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

      {/* ======================
           Modales persistentes
         ====================== */}
      <Modal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        icon={errorimg}
        title="ERROR"
        okText="Ok"
      >
        <p>{errorMsg}</p>
      </Modal>

      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        icon={okimg}
        title="¡ÉXITOSO!"
        okText="Ok"
        onOk={() => {
          setSuccessOpen(false);
          navigate("/menu");
        }}
      >
        <p>El coordinador ha sido creado con éxito.</p>
      </Modal>
    </>
  );
}
