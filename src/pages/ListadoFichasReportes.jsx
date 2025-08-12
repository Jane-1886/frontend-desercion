import React, { useState, useEffect, useRef } from 'react';
import '../styles/ListadoFichasReportes.css';
import logoSena from '/Img/logoSena.png';
import lupaIcono from '/Img/lupa_icono.png';
import folderIcon from '/Img/folder_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Usa .env: VITE_API_URL=http://localhost:3000 (ajústalo a tu backend)
const API_BASE = import.meta.env.VITE_API_URL || "";

const ListadoFichasReportes = ({ setVista, setFichaId, fichaId }) => {
  useEffect(() => {
    if (fichaId) console.log('🧾 Recibí ficha desde ReporteGeneral:', fichaId);
  }, [fichaId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [busquedaIzquierda, setBusquedaIzquierda] = useState('');
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [mostrarModalFicha, setMostrarModalFicha] = useState(false);

  // Estados de preview
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [errorReporte, setErrorReporte] = useState(null);
  const [reporte, setReporte] = useState(null);

  const fetchCtrlRef = useRef(null);

  const fichas = [2617001, 2617543, 2618129, 2614968, 2612387, 2615014, 2618902];
  const fichasFiltradas = fichas.filter((f) =>
    f.toString().includes(searchTerm.trim())
  );

  const botonesIzquierda = ['Notificaciones', '¿Necesitas ayuda?'].filter((op) =>
    op.toLowerCase().includes(busquedaIzquierda)
  );

  const abrirModal = async (ficha) => {
    setFichaSeleccionada(ficha);
    setMostrarModalFicha(true);
    setReporte(null);
    setErrorReporte(null);
    setLoadingReporte(true);

    // cancela fetch previo si existía
    if (fetchCtrlRef.current) fetchCtrlRef.current.abort();
    const ctrl = new AbortController();
    fetchCtrlRef.current = ctrl;

    try {
      const url = `${API_BASE}/reportes/asistencia/${ficha}`;
      const resp = await fetch(url, { signal: ctrl.signal });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      setReporte(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        // Fallback mock para visualizar mientras conectas backend
        setReporte({
          resumen: { totalSesiones: 12, presentes: 10, ausentes: 2, porcentajeAsistencia: 83.3 },
          detalle: [
            { fecha: '2025-08-01', presentes: 15, ausentes: 5, porcentaje: '75%' },
            { fecha: '2025-08-05', presentes: 18, ausentes: 2, porcentaje: '90%' },
            { fecha: '2025-08-08', presentes: 19, ausentes: 1, porcentaje: '95%' },
          ],
        });
        setErrorReporte('No se pudo cargar desde el servidor. Mostrando datos de ejemplo.');
      }
    } finally {
      setLoadingReporte(false);
    }
  };

  const cerrarModal = () => {
    // aborta fetch en curso si cierras
    if (fetchCtrlRef.current) fetchCtrlRef.current.abort();
    setMostrarModalFicha(false);
    setFichaSeleccionada(null);
    setReporte(null);
    setErrorReporte(null);
  };

  const extraerNombreArchivo = (disposition) => {
    if (!disposition) return null;
    // Content-Disposition: attachment; filename="reporte_ficha_2617001.pdf"
    const match = /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i.exec(disposition);
    return decodeURIComponent(match?.[1] || match?.[2] || '');
  };

  const generarPDF = async () => {
    if (!fichaSeleccionada) return;
    try {
      const url = `${API_BASE}/reportes/asistencia/${fichaSeleccionada}/pdf`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);

      // si tu backend envía nombre de archivo
      const disp = resp.headers.get('Content-Disposition');
      const nombre = extraerNombreArchivo(disp) || `reporte_ficha_${fichaSeleccionada}.pdf`;

      // descarga directa
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      // si prefieres abrir en pestaña nueva:
      // window.open(blobUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert('No se pudo generar/descargar el PDF.');
    }
  };

  return (
    <div className="layout-listado-fichas-reportes">
      {/* IZQUIERDA */}
      <div className="form-container-reportes izquierda">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />
        <div className="busqueda-container">
          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar"
              className="input-busqueda-fichas"
              value={busquedaIzquierda}
              onChange={(e) => setBusquedaIzquierda(e.target.value.toLowerCase())}
            />
            <div className="icono-lupa">
              <img src={lupaIcono} alt="Icono de lupa" />
            </div>
          </div>
        </div>

        <div className="botones-container">
          {botonesIzquierda.map((opcion, index) => (
            <button className="boton" key={index}>
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* DERECHA */}
      <div className="form-container-reportes derecha">
        <div className="titulo">
          Te encuentras visualizando <span style={{ color: '#00304D' }}>tu listado de</span>{' '}
          <span style={{ color: '#39A900' }}>fichas:</span>
        </div>

        <div className="busqueda-fichas" style={{ position: 'relative', width: '100%', maxWidth: '1000px' }}>
          <input
            type="text"
            placeholder="Buscar ficha"
            className="input-busqueda-fichas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="icono-lupa"
            onClick={() => {
              if (searchTerm.trim() === '') {
                alert('Por favor escribe un número de ficha');
              } else if (fichasFiltradas.length === 0) {
                alert('No se encontraron coincidencias');
              }
            }}
            aria-label="Buscar ficha"
          >
            <img src={lupaIcono} alt="Buscar" />
          </button>
        </div>

        <div className="linea"></div>

        <div className="sub-div">
          {fichasFiltradas.map((ficha) => (
            <div key={ficha} className="sub-item">
              <img src={folderIcon} alt="Icono Ficha" className="icono-sub-item" />
              Ficha - {ficha}
              <button className="seleccionar-boton" onClick={() => abrirModal(ficha)}>
                Seleccionar
              </button>
            </div>
          ))}

          {fichasFiltradas.length === 0 && (
            <p className="estado-vacio">No se encontraron fichas</p>
          )}
        </div>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>
      </div>

      {/* MODAL: PREVIEW + GENERAR PDF */}
      {mostrarModalFicha && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-confirmacion-titulo">
          <div className="modal-content">
            <p id="modal-confirmacion-titulo" className="modal-title">
              Reporte de asistencia — Ficha {fichaSeleccionada}
            </p>

            {loadingReporte && <p className="estado-cargando">Cargando reporte...</p>}

            {errorReporte && <p className="estado-error">{errorReporte}</p>}

            {!loadingReporte && reporte && (
              <div className="preview-reporte">
                {reporte.resumen && (
                  <div className="preview-resumen">
                    <div><strong>Total sesiones:</strong> {reporte.resumen.totalSesiones ?? '-'}</div>
                    <div><strong>Presentes:</strong> {reporte.resumen.presentes ?? '-'}</div>
                    <div><strong>Ausentes:</strong> {reporte.resumen.ausentes ?? '-'}</div>
                    <div><strong>Asistencia:</strong> {reporte.resumen.porcentajeAsistencia ?? '-'}%</div>
                  </div>
                )}

                {Array.isArray(reporte.detalle) && reporte.detalle.length > 0 ? (
                  <div className="tabla-wrapper">
                    <table className="tabla-reporte">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Presentes</th>
                          <th>Ausentes</th>
                          <th>% Asistencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reporte.detalle.map((d, i) => (
                          <tr key={i}>
                            <td>{d.fecha ?? '-'}</td>
                            <td>{d.presentes ?? '-'}</td>
                            <td>{d.ausentes ?? '-'}</td>
                            <td>{d.porcentaje ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !loadingReporte && <p className="estado-vacio">No hay información para mostrar.</p>
                )}
              </div>
            )}

            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={generarPDF}
                disabled={loadingReporte}
                title={API_BASE ? 'Generar PDF' : 'Configura VITE_API_URL en .env'}
              >
                Generar PDF
              </button>
              <button className="modal-button" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Salir */}
      <div className="flecha-container">
        <button className="boton-flecha" onClick={() => setVista('menu')}>
          <FontAwesomeIcon icon={faArrowLeft} /> Salir
        </button>
      </div>
    </div>
  );
};

export default ListadoFichasReportes;
