// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Ajusta el nombre/caso según tu archivo real:
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Si ya hay sesión válida → al menú
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = Number(localStorage.getItem("rol"));
    if (token && rol === 3) navigate("/menu", { replace: true });
  }, [navigate]);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsg("");

    // 1) Si definiste VITE_API_URL, úsala. Si no, usa ruta relativa (proxy Vite).
    const API = (import.meta.env.VITE_API_URL
      ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, "")
      : ""
    );
    const url = API ? `${API}/api/auth/login` : `/api/auth/login`;

    // 2) Timeout para evitar “hangs” si el backend no responde
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000); // 10s

    try {
      const respuesta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), contrasena }),
        signal: ctrl.signal,
      });
      clearTimeout(t);

      let data = {};
      try { data = await respuesta.json(); } catch { /* body vacío o no JSON */ }

      if (!respuesta.ok) {
        const msg = data?.mensaje || data?.message || "❌ Credenciales inválidas";
        localStorage.clear();
        setErrorMsg(msg);
        return;
      }

      // 3) Extrae token y rol desde distintas claves posibles
      const token = data?.token ?? "";
      const u = data?.usuario ?? {};
      const rolNum = Number(
        u?.rol ?? u?.idRol ?? u?.ID_Rol ?? u?.role ?? u?.roleId ?? 0
      );

      if (!token) {
        setErrorMsg("⚠️ El servidor no devolvió token.");
        return;
      }
      if (!rolNum && rolNum !== 0) {
        setErrorMsg("⚠️ No llegó el rol del usuario en la respuesta.");
        return;
      }

      // 4) Guarda sesión
      localStorage.setItem("token", token);
      localStorage.setItem("rol", String(rolNum));
      localStorage.setItem("nombreUsuario", u?.nombre || "");

      // 5) Solo Coordinación (3) entra a este módulo
      if (rolNum === 3) {
        navigate("/menu", { replace: true });
      } else {
        localStorage.clear();
        setErrorMsg("⚠️ Tu rol no tiene acceso a esta vista.");
      }
    } catch (err) {
      clearTimeout(t);
      console.error("Error en login:", err);
      if (err.name === "AbortError") {
        setErrorMsg("⏱️ El servidor tardó demasiado en responder (timeout).");
      } else {
        setErrorMsg("⚠️ No se pudo conectar con el servidor.");
      }
      localStorage.clear();
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>

        {errorMsg ? <div className="login-error">{errorMsg}</div> : null}

        <form onSubmit={manejarLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-btn" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Habilita esto solo si tienes la ruta /crear en App.jsx
        <p className="crear-cuenta-link">
          ¿Eres nuevo?{" "}
          <span role="button" onClick={() => navigate("/crear")}>
            Crear cuenta
          </span>
        </p>
        */}
      </div>
    </div>
  );
}
