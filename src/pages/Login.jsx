// src/pages/Login.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ¿ya hay sesión?
  const sesion = useMemo(() => {
    const token = localStorage.getItem("token");
    const rol = Number(localStorage.getItem("rol") || 0);
    const nombre = localStorage.getItem("nombreUsuario") || "";
    return { token, rol, nombre };
  }, []);

  // Si ya hay sesión rol 3 → menú
  useEffect(() => {
    if (sesion.token && sesion.rol === 2) {
      // Si quieres ver el botón en login, comenta esta línea temporalmente:
      // return;
      navigate("/menu", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const safeDecodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsg("");

    const API = (import.meta.env.VITE_API_URL
      ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, "")
      : "");
    const url = API ? `${API}/api/auth/login` : `/api/auth/login`;

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), contrasena }),
        signal: ctrl.signal,
      });
      clearTimeout(t);

      let data = {};
      try { data = await resp.json(); } catch {}

      if (!resp.ok) {
        const msg = data?.mensaje || data?.message || "❌ Credenciales inválidas";
        localStorage.clear();
        setErrorMsg(msg);
        return;
      }

      const token = data?.token ?? "";
      if (!token) {
        setErrorMsg("⚠️ El servidor no devolvió token.");
        return;
      }

      let rolNum = Number(
        data?.idRol ??
        data?.rol ??
        data?.usuario?.rol ??
        data?.usuario?.idRol ??
        data?.usuario?.ID_Rol ??
        0
      );
      let nombreUsuario =
        data?.nombre ??
        data?.usuario?.nombre ??
        data?.usuario?.Nombre_Usuario ??
        "";

      if (!rolNum) {
        const payload = safeDecodeJWT(token);
        rolNum = Number(
          payload?.rol ?? payload?.role ?? payload?.idRol ?? payload?.ID_Rol ?? 0
        );
        if (!nombreUsuario) {
          nombreUsuario = payload?.nombre ?? payload?.name ?? payload?.Nombre_Usuario ?? "";
        }
      }

      if (!rolNum) {
        setErrorMsg("⚠️ No se pudo determinar el rol del usuario.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("rol", String(rolNum));
      localStorage.setItem("nombreUsuario", nombreUsuario || "");

      if (rolNum === 3) {
        navigate("/menu", { replace: true });
      } else {
        localStorage.clear();
        setErrorMsg("⚠️ Tu rol no tiene acceso a esta vista.");
      }
    } catch (err) {
      clearTimeout(t);
      console.error("Error en login:", err);
      if (err?.name === "AbortError") {
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

        {/* Botones secundarios */}
        <div style={{ marginTop: 16 }}>
        <button
  type="button"
  className="login-secondary-btn"
  onClick={() => navigate("/crearUsuario")}
>
  Crear usuario
</button>       
         </div>
      </div>
    </div>
  );
}
