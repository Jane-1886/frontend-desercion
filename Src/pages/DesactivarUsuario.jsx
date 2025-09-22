// src/pages/DesactivarUsuario.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/formulario_creacion_usuarios.css";
import logoSena from "/img/logoSena.png";
import errorimg from "/img/error.png";
import okimg from "/img/check_circle.png";
import api from "../controlador/api.js"; // axios con baseURL y token

export default function DesactivarUsuario() {
  const navigate = useNavigate();

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
    setErrorOpen(false);
    setSuccessOpen(false);
    setConfirmOpen(false);
  }, []);

  // GET /api/usuarios/by-email/:email
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
      const { data } = await api.get(`/api/usuarios/by-email/${encodeURIComponent(email)}`);

      const fullName = [data?.nombres, data?.apellidos].filter(Boolean).join(" ").trim();
      const nombreNormalizado =
        (data?.nombre ?? data?.Nombre ?? data?.Nombre_Usuario ?? fullName) || "(Sin nombre)";

      const u = {
        id: data?.id ?? data?.ID_Usuario ?? data?.ID ?? data?.usuarioId ?? null,
        nombre: nombreNormalizado,
        email: data?.email ?? data?.Email ?? data?.correo ?? data?.Correo ?? email,
        rol: data?.rolNombre ?? data?.Rol ?? (data?.idRol ? `Rol ${data.idRol}` : "Rol desconocido"),
        idRol: data?.idRol ?? data?.ID_Rol ?? null,
        activo:
          typeof data?.activo === "boolean"
            ? data.activo
            : (data?.Estado ?? data?.estado ?? "").toString().toUpperCase() === "ACTIVO",
        estado: (data?.Estado ?? data?.estado ?? (data?.activo ? "ACTIVO" : "INACTIVO")).toString().toUpperCase(),
      };

      if (!u.id) {
        throw new Error("No se encontró un ID de usuario válido en la respuesta.");
      }

      setUsuario(u);
    } catch (err) {
      const msg =
        err?.response?.data?.mensaje ||
        err?.response?.data?.message ||
        err?.message ||
        "Error al buscar el usuario.";
      setUsuario(null);
      setErrorMsg(msg);
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

  // PATCH /api/usuarios/:id/estado
  const desactivarUsuario = async () => {
    if (confirmTexto.trim().toUpperCase() !== "DESACTIVAR") return;

    setCargandoAccion(true);
    try {
      const payload = {
        estado: "INACTIVO", // el backend normaliza ACTIVO/INACTIVO
        motivo,
        observacion,
      };

      await api.patch(`/api/usuarios/${usuario.id}/estado`, payload);

      setSuccessOpen(true);
      setConfirmOpen(false);
      setUsuario((prev) => (prev ? { ...prev, activo: false, estado: "INACTIVO" } : prev));
      setMotivo("");
      setObservacion("");
    } catch (err) {
      const msg =
        err?.response?.data?.mensaje ||
        err?.response?.data?.message ||
        err?.message ||
        "Error al desactivar el usuario.";
      setErrorMsg(msg);
      setErrorOpen(true);
    } finally {
      setCargandoAccion(false);
    }
  };

  // Tooltip para explicar por qué está deshabilitado el botón
  const disabledReason = useMemo(() => {
    if (!usuario) return "Primero busca y selecciona un usuario";
    if (!motivo) return "Selecciona un motivo";
    return null;
  }, [usuario, motivo]);

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
              <button className="boton btn" onClick={() => navigate("/menu")}>
                Menú principal
              </button>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="form-container derecha">
            {/* Volver */}
            <button className="volver-btn-fijo" onClick={() => navigate("/desactivacion")}>
              ⬅ Volver
            </button>

            <h1 className="titulo">
              Te encuentras en <span style={{ color: "#00304D" }}>desactivación de</span>{" "}
              <span style={{ color: "#39A900" }}>usuarios</span>
            </h1>

            <div className="sub-div">
              {/* Búsqueda */}
              <div className="info-pequeña">
                <div className="campo-busqueda" style={{ display: "flex", gap: 8, width: "100%" }}>
                  <input
                    type="email"
                    placeholder="Correo del usuario..."
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    style={{ flex: 1 }}
                    onKeyDown={(e) => e.key === "Enter" && buscarUsuario()}
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
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Correo:</strong> {usuario.email}</p>
                    <p><strong>Rol:</strong> {usuario.rol}</p>
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
                    <option value="" disabled hidden>Selecciona un motivo</option>
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
                  disabled={!!disabledReason || cargandoAccion}
                  title={disabledReason || ""}
                >
                  Desactivar usuario
                </button>
              </div>
            </div>

            <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje Sena</p>
          </div>
        </div>
      </div>

      {/* Modal de confirmación (forzamos display:flex por si tu CSS tiene .modal { display:none }) */}
      {confirmOpen && (
        <div className="modal" style={{ display: "flex" }} onClick={() => setConfirmOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar desactivación</h2>
            <p>
              Esta acción desactivará el usuario <strong>{usuario?.nombre}</strong> ({usuario?.email}).<br />
              Para confirmar, escribe <strong>DESACTIVAR</strong>:
            </p>
            <input
              type="text"
              value={confirmTexto}
              onChange={(e) => setConfirmTexto(e.target.value)}
              placeholder="DESACTIVAR"
              style={{ width: "100%", padding: 8, marginTop: 8 }}
              onKeyDown={(e) => e.key === "Enter" && desactivarUsuario()}
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
        <div className="modal" style={{ display: "flex" }} onClick={() => setErrorOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={errorimg} alt="Error" />
            <h2>ERROR</h2>
            <p>{errorMsg}</p>
            <button className="ok-button" onClick={() => setErrorOpen(false)}>Ok</button>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {successOpen && (
        <div className="modal" style={{ display: "flex" }} onClick={() => setSuccessOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={okimg} alt="Éxito" />
            <h2>¡ÉXITOSO!</h2>
            <p>El usuario ha sido desactivado correctamente.</p>
            <button
              className="ok-button"
              onClick={() => {
                setSuccessOpen(false);
                navigate("/desactivacion");
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
