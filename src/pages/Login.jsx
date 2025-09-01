import React, { useState } from "react";
import "../styles/Login.css";

const Login = ({ setVista }) => {
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

      // Intenta parsear JSON incluso en error para mostrar mensaje del backend
      const data = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        const msg = data?.mensaje || "❌ Credenciales inválidas";
        alert(msg);
        return;
      }

      // El backend devuelve { token, usuario: { id, nombre, rol, email } }
      const { token, usuario } = data || {};
      localStorage.setItem("token", token || "");
      localStorage.setItem("rol", String(usuario?.rol ?? ""));            // ej. 3
      localStorage.setItem("nombreUsuario", usuario?.nombre || "");

      // Si quieres exigir coordinador (rol 3), deja esta validación:
      if ((usuario?.rol ?? usuario?.idRol) === 3) {
        setVista("menu");
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
          <span onClick={() => setVista("crear")}>Crear cuenta</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
