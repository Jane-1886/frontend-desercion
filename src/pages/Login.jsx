// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate(); // ✅ para navegar después del login
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const respuesta = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });

      const data = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        const msg = data?.mensaje || "❌ Credenciales inválidas";
        alert(msg);
        return;
      }

      const { token, usuario } = data || {};
      localStorage.setItem("token", token || "");
      localStorage.setItem("rol", String(usuario?.rol ?? ""));
      localStorage.setItem("nombreUsuario", usuario?.nombre || "");

      // ✅ Si es coordinador (rol 3), navega al menú
      if ((usuario?.rol ?? usuario?.idRol) === 3) {
        navigate("/menu"); // 👈 usamos navigate en lugar de setVista
      } else {
        alert("⚠️ Tu rol no tiene acceso a esta vista.");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("⚠️ Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>
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
        <p className="crear-cuenta-link">
          ¿Eres nuevo?{" "}
          <span onClick={() => navigate("/crear")}>Crear cuenta</span> {/* 👈 también cambiamos esto */}
        </p>
      </div>
    </div>
  );
};

export default Login;
