// src/pages/DesactivarUsuario.jsx
import React, { useEffect, useState } from "react";
import "../styles/formulario_creacion_usuarios.css"; // ajusta si usas otro CSS
import logoSena from "/Img/logoSena.png";
import errorImg from "/Img/error.png";
import okImg from "/Img/check_circle.png";

// ⛳️ Ajusta estas rutas si tu backend usa otras
const API_BASE = "http://localhost:3000";
const BUSCAR_POR_CORREO = (email) =>
  `${API_BASE}/api/usuarios/by-email/${encodeURIComponent(email)}`; // ← EJEMPLO GET
const DESACTIVAR_URL = (id) =>
  `${API_BASE}/api/usuarios/${id}/desactivar`; // ← EJEMPLO PUT/PATCH

export default function DesactivarUsuario({ setVista }) {
  // Form/búsqueda
  const [correo, setCorreo] = useState("");
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Datos de desactivación
  const [motivo, setMotivo] = useState("");
  const [observacion, setObservacion] = useState("");

  // Acción
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTexto, setConfirmTexto] = useState("");
  const [cargandoAccion, setCargandoAccion] = useState(false);

  // Modales resultado
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Ha ocurrido un error.");
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    // asegurar modales cerrados al entrar
    setErrorOpen(false);
    setSuccessOpen(false);
    setConfirmOpen(false);
  }, []);

  const buscarUsuario = async () => {
    const email = correo.trim();
    if (!email) {
      setErrorMsg("Ingresa un correo para buscar.");
      setErrorOpen(true);
      return;
    }
    setCargandoBusqueda(true);
    setUsuario(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(BUSCAR_POR_CORREO(email), {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg =
          data?.mensaje || data?.message || `No se pudo buscar el usuario (${res.status}).`;
        throw new Error(msg);
      }

      // ✅ Arreglo: evitar mezclar ?? y || sin paréntesis
      const fullName = [data?.nombres, data?.apellidos].filter(Boolean).join(" ").trim();
      const nombreNormalizado =
        data?.nombre ??
        data?.Nombre ??
        data?.Nombre_Usuario ??
        (fullName || "(Sin nombre)");

      const u = {
        id: data?.id ?? data?.ID_Usuario ?? data?.ID ?? data?.usuarioId ?? null,
        nombre: nombreNormalizado,
        email: data?.email ?? data?.correo ?? data?.Correo ?? email,
        rol:
          data?.rolNombre ??
          data?.Rol ??
          (data?.idRol ? `Rol ${data.idRol}` : "Rol desconocido"),
        idRol: data?.idRol ?? data?.ID_Rol ?? null,
        activo:
          typeof data?.activo === "boolean"
            ? data.activo
            : data?.Estado === "ACTIVO" || data?.estado === "ACTIVO",
      };

      if (!u.id) {
        throw new Error("No se encontró un ID de usuario válido en la respuesta.");
      }

      setUsuario(u);
    } catch (err) {
      setUsuario(null);
      setErrorMsg(err?.message || "Error al buscar el usuario.");
      setErrorOpen(true);
    } finally {
      setCargandoBusqueda(false);
    }
  };

  const abrirConfirmacion = () => {
    if (!usuario) {
      setErrorMsg("Primero busca y selecciona un usuario.");
      setErrorOpen(true);
      return;
    }
    if (!motivo) {
      setErrorMsg("Selecciona un motivo de desactivación.");
      setErrorOpen(true);
      return;
    }
    setConfirmTexto("");
    setConfirmOpen(true);
  };

  const desactivarUsuario = async () => {
    if (confirmTexto.trim().toUpperCase() !== "DESACTIVAR") return;

    setCargandoAccion(true);
    try {
      const token = localStorage.getItem("token");

      // 🔁 ADAPTA ESTE PAYLOAD a tu backend si pide otros campos
      const payload = {
        motivo,
        observacion,
        activo: false, // muchos backends lo usan
        estado: "INACTIVO", // por si tu API usa estado textual
      };

      const res = await fetch(DESACTIVAR_URL(usuario.id), {
        method: "PUT", // o "PATCH" si tu API lo usa
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.mensaje || data?.message || `No se pudo desactivar (${res.status}).`;
        throw new Error(msg);
      }

      setSuccessOpen(true);
      setConfirmOpen(false);
      // Refresca estado local
      setUsuario((prev) => (prev ? { ...prev, activo: false } : prev));
      setMotivo("");
      setObservacion("");
    } catch (err) {
      setErrorMsg(err?.message || "Error al desactivar el usuario.");
      setErrorOpen(true);
    } finally {
      setCargandoAccion(false);
    }
  };

  return (
    <>
      <div className="body-listado-aprendices">
        <div className="contenedor-principal">
          {/* Columna izquierda (navegación simple) */}
          <div className="form-container izquierda navegacion">
            <img src={logoSena} alt="Logo SENA" className="imagen-header" />
            <div style={{ padding: 16, color: "#00304D", fontWeight: 600 }}>
              Desactivación de usuarios
            </div>
            <div className="botones-container">
              <button className="boton btn" onClick={() => setVista && setVista("menu")}>
                Menú principal
              </button>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="form-container derecha">
            {/* Volver */}
            <button
              className="volver-btn-fijo"
              onClick={() => setVista && setVista("desactivacion")}
            >
              ⬅ Volver
            </button>

            <h1 className="titulo">
              Te encuentras en <span style={{ color: "#00304D" }}>desactivación de</span>{" "}
              <span style={{ color: "#39A900" }}>usuarios</span>
            </h1>

            <div className="sub-div">
              {/* Búsqueda */}
              <div className="info-pequeña">
                <div className="campo-busqueda" style={{ display: "flex", gap: 8 }}>
                  <input
                    type="email"
                    placeholder="Correo del usuario..."
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className="btn" onClick={buscarUsuario} disabled={cargandoBusqueda}>
                    {cargandoBusqueda ? "Buscando..." : "Buscar"}
                  </button>
                </div>
              </div>

              {/* Datos del usuario */}
              {usuario && (
                <div className="lista-aprendices" style={{ marginTop: 16 }}>
                  <div
                    className="bloque-instructor"
                    style={{ padding: 16, border: "1px solid #eee", borderRadius: 12 }}
                  >
                    <h3 style={{ marginTop: 0 }}>Usuario encontrado</h3>
                    <p>
                      <strong>Nombre:</strong> {usuario.nombre}
                    </p>
                    <p>
                      <strong>Correo:</strong> {usuario.email}
                    </p>
                    <p>
                      <strong>Rol:</strong> {usuario.rol}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span style={{ color: usuario.activo ? "#39A900" : "#b00" }}>
                        {usuario.activo ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Formulario de desactivación */}
              <div className="linea" style={{ marginTop: 16 }} />

              <div className="info-pequeña" style={{ display: "grid", gap: 12 }}>
                <label>
                  Motivo de desactivación
                  <select value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                    <option value="" disabled hidden>
                      Selecciona un motivo
                    </option>
                    <option value="retiro">Retiro voluntario</option>
                    <option value="sancion">Sanción disciplinaria</option>
                    <option value="egreso">Egreso / finalización</option>
                    <option value="otros">Otros</option>
                  </select>
                </label>

                <label>
                  Observaciones
                  <textarea
                    rows={4}
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    placeholder="Detalle adicional (opcional)"
                  />
                </label>

                <button
                  className="btn"
                  onClick={abrirConfirmacion}
                  disabled={!usuario || cargandoAccion}
                >
                  Desactivar usuario
                </button>
              </div>
            </div>

            <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {confirmOpen && (
        <div className="modal" onClick={() => setConfirmOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar desactivación</h2>
            <p>
              Esta acción desactivará el usuario <strong>{usuario?.nombre}</strong> (
              {usuario?.email}). Para confirmar, escribe <strong>DESACTIVAR</strong>:
            </p>
            <input
              type="text"
              value={confirmTexto}
              onChange={(e) => setConfirmTexto(e.target.value)}
              placeholder="DESACTIVAR"
              style={{ width: "100%", padding: 8, marginTop: 8 }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                className="btn"
                onClick={desactivarUsuario}
                disabled={confirmTexto.trim().toUpperCase() !== "DESACTIVAR" || cargandoAccion}
              >
                {cargandoAccion ? "Procesando..." : "Confirmar"}
              </button>
              <button className="btn btn-secundario" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
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

      {/* Modal de éxito */}
      {successOpen && (
        <div className="modal" onClick={() => setSuccessOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={okImg} alt="Éxito" />
            <h2>¡ÉXITOSO!</h2>
            <p>El usuario ha sido desactivado correctamente.</p>
            <button
              className="ok-button"
              onClick={() => {
                setSuccessOpen(false);
                setVista && setVista("desactivacion");
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
