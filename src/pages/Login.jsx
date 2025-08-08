/*import React, { useState } from "react";
import "../styles/Login.css"; // sube dos niveles desde src/pages

const Login = ({ setVista }) => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contrasena }),
      });

      const data = await respuesta.json();
      console.log("📦 Respuesta completa:", data);


      if (respuesta.ok) {
        // ✅ Guardar información importante para acceder a rutas protegidas
        localStorage.setItem("token", data.token);               // ← token JWT
        localStorage.setItem("rol", data.rol);                   // ← rol del usuario
        localStorage.setItem("nombreUsuario", data.nombre);      // ← nombre visible

        // ✅ Solo permitir acceso si es coordinador (rol 3)
        if (data.idRol === 3) {
          setVista("menu");
        } else {
          alert("⚠️ Tu rol no tiene acceso a esta vista.");
        }
      } else {
        alert("❌ Credenciales inválidas");
      }
    } catch (error) {
      alert("⚠️ Error al conectar con el servidor");
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="title">Iniciar Sesión</h1>
      <form onSubmit={manejarLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      <p className="crear-cuenta-link">
        ¿Eres nuevo?{" "}
        <span onClick={() => setVista("crear")}>Crear cuenta</span>
      </p>
    </div>
  );
};

export default Login;
*/
import React, { useState } from "react";
import "../styles/Login.css";

const Login = ({ setVista }) => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contrasena }),
      });

      const data = await respuesta.json();
      console.log("📦 Respuesta completa:", data);

      if (respuesta.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombreUsuario", data.nombre);

        if (data.idRol === 3) {
          setVista("menu");
        } else {
          alert("⚠️ Tu rol no tiene acceso a esta vista.");
        }
      } else {
        alert("❌ Credenciales inválidas");
      }
    } catch (error) {
      alert("⚠️ Error al conectar con el servidor");
      console.error("Error en login:", error);
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
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Ingresar</button>
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
