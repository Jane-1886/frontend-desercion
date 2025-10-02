// src/pages/MenuAyuda.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/menu_de_ayuda.css"; // estilos de esta página

// 📁 Las imágenes están en: frontend/public/img/tutoriales
// 👉 Si tus archivos tienen espacios, puedes dejarlos así, pero si diera 404 renómbralos sin espacios
//    o usa %20 en la URL. Aquí los dejo tal como los escribiste.
const BASE = "/img/tutoriales";

const TUTORIALES = [
  { id: 1,  titulo: "Página principal", imgs: [`${BASE}/pagina_principal.jpg`] },
  { id: 2,  titulo: "Visualizar listados", imgs: [`${BASE}/tutorial visualizar listados.jpg`] },
  { id: 3,  titulo: "Listado de aprendices", imgs: [`${BASE}/tutorial listado de aprendices.jpg`] },
  { id: 4,  titulo: "Modal asistencias de aprendiz", imgs: [`${BASE}/tutorial modal de asistencias de aprendiz.jpg`] },
  { id: 5,  titulo: "Reporte general (pantalla)", imgs: [`${BASE}/tutorial_reporte_general.jpg`] },
  { id: 6,  titulo: "Modal reporte general", imgs: [`${BASE}/modal_reporte_general.jpg`] },
  { id: 7,  titulo: "Desactivación (pantalla)", imgs: [`${BASE}/tutorial desactivacion.jpg`] },
  { id: 8,  titulo: "Desactivar ficha (paso a paso)", imgs: [
    `${BASE}/tutorial_desactivar ficha.jpg`,
    `${BASE}/modal_ficha_activada.jpg`,
    `${BASE}/modal_ficha_desactivada.jpg`,
    `${BASE}/modal_realizar_accion_ficha_activar.jpg`,
    `${BASE}/modal_realizar_accion_ficha_desactivar.jpg`,
  ]},
  { id: 9,  titulo: "Activar/Desactivar usuario (modales)", imgs: [
    `${BASE}/modal_usuario_activado.jpg`,
    `${BASE}/modal_usuario_desactivado.jpg`,
    `${BASE}/modal_realizar_accion.jpg`,
    `${BASE}/modal_realizar_accion_activar.jpg`,
  ]},
  { id: 10, titulo: "Crear roles / usuarios", imgs: [
    `${BASE}/tutorial_creacion_de_roles.jpg`,
    `${BASE}/tutorial_activar_usuarios.jpg`,
    `${BASE}/tutorial reactivacion_usuarios.jpg`,
    `${BASE}/tutorial desactivacion_usuarios.jpg`,
  ]},
  { id: 11, titulo: "Notificaciones", imgs: [`${BASE}/tutorial notificaciones.jpg`] },
];

export default function MenuAyuda() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(TUTORIALES[0]); // tutorial seleccionado
  const [idx, setIdx] = useState(0);             // índice de imagen

  const lista = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TUTORIALES;
    return TUTORIALES.filter(t => t.titulo.toLowerCase().includes(s));
  }, [q]);

  useEffect(() => {
    setIdx(0); // reset al cambiar de tutorial
  }, [sel]);

  const next = () => setIdx(i => (i + 1) % sel.imgs.length);
  const prev = () => setIdx(i => (i - 1 + sel.imgs.length) % sel.imgs.length);

  return (
    <div className="ayp-wrap">
      {/* Lateral similar al diseño que te dieron */}
      <aside className="ayp-left">
        <img src="/img/logoSena.png" alt="SENA" className="ayp-logo" />

        

        <div className="ayp-actions">
          <button className="ayp-btn" onClick={() => navigate(-1)}>⬅ Volver</button>
          
         
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="ayp-right">
        <h2 className="ayp-title">
          Te encuentras <span className="ayp-blue">en el</span> <span className="ayp-green">menú de ayuda</span>:
        </h2>
        <p className="ayp-sub">Selecciona el tutorial que deseas ver:</p>

        <div className="ayp-content">
          {/* Lista de tutoriales */}
          <div className="ayp-list">
            {lista.map(t => (
              <button
                key={t.id}
                className={`ayp-item ${sel?.id === t.id ? "active" : ""}`}
                onClick={() => setSel(t)}
              >
                {t.titulo}
              </button>
            ))}
            {lista.length === 0 && <p className="ayp-empty">No hay resultados para “{q}”.</p>}
          </div>

          {/* Visor */}
          <div className="ayp-viewer">
            <h3 className="ayp-view-title">{sel?.titulo}</h3>
            {sel && sel.imgs?.length > 0 && (
              <>
                <div className="ayp-carousel">
                  <button className="ayp-nav prev" onClick={prev}>❮</button>
                  <img
                    className="ayp-img"
                    src={sel.imgs[idx]}
                    alt={`Paso ${idx + 1}`}
                    onError={(e) => {
                      console.error("No cargó:", sel.imgs[idx]);
                      // opcional: pon un placeholder si lo tienes en la carpeta
                      // e.currentTarget.src = `${BASE}/placeholder.jpg`;
                    }}
                  />
                  <button className="ayp-nav next" onClick={next}>❯</button>
                </div>
                <p className="ayp-count">{idx + 1} / {sel.imgs.length}</p>
              </>
            )}
          </div>
        </div>

        <p className="ayp-footer">2024 - Servicio Nacional de Aprendizaje SENA</p>
      </main>
    </div>
  );
}
