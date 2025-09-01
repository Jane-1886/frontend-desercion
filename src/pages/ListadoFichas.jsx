// src/pages/ListadoFichas.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Listado_fichas_Activar.css';
import logoSena from '/Img/logoSena.png';
import folderIcon from '/Img/folder_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import api from '../controlador/api.js';

const ListadoFichas = ({ setVista }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setCargando(true);
      setError('');
      try {
        const { data } = await api.get('/api/fichas');
        const normalizadas = (Array.isArray(data) ? data : [])
          .map((f) => {
            const id = f.ID_Ficha || f.id || f.Id || f.codigo || f.Codigo_Ficha;
            const nombre = f.Programa || f.programa || f.Nombre || f.nombre || '';
            const estado = f.Estado ?? f.estado ?? 'Activo';
            return { ...f, _id: String(id || ''), _nombre: String(nombre), _estado: String(estado) };
          })
          .filter(x => x._id);
        if (!cancelado) setFichas(normalizadas);
      } catch (e) {
        console.error('Error cargando fichas:', e);
        if (!cancelado) setError('No se pudieron cargar las fichas. Verifica el login y el backend.');
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => { cancelado = true; };
  }, []);

  const fichasFiltradas = fichas.filter((ficha) =>
    (ficha._id + ' ' + (ficha._nombre || '')).toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="layout-listado-fichas">
      <div className="izquierda navegacion">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />
        <div className="busqueda-container">
          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar ficha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="derecha contenido">
        <h2 className="titulo-principal">Listado de fichas</h2>

        {cargando && <p style={{ fontWeight: 'bold' }}>Cargando fichas...</p>}
        {error && <p style={{ color: 'crimson', fontWeight: 'bold' }}>{error}</p>}

        <div className="listado-fichas">
          {fichasFiltradas.map((ficha) => (
            <div key={ficha._id} className="ficha-item">
              <img src={folderIcon} alt="Icono" className="icono-carpeta" />
              <div className="ficha-info">
                <div className="ficha-codigo">{ficha._id}</div>
                {ficha._nombre && <div className="ficha-programa">{ficha._nombre}</div>}
                <div className="ficha-estado">{ficha._estado}</div>
              </div>
              <button
                className="seleccionar-boton"
                onClick={() => setVista('listaAprendices', { fichaId: ficha._id, modo: 'visualizar' })}
              >
                Seleccionar
              </button>
            </div>
          ))}

          {!cargando && !error && fichasFiltradas.length === 0 && (
            <p style={{ color: '#aaa', fontWeight: 'bold', marginTop: '20px' }}>
              No se encontraron fichas
            </p>
          )}
        </div>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>

        <div className="flecha-container">
          <button className="boton-flecha" onClick={() => setVista('menu')}>
            <FontAwesomeIcon icon={faArrowLeft} /> Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListadoFichas;
