// src/pages/ListadoFichas.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Listado_fichas_Activar.css';
import logoSena from '/img/logoSena.png';
import folderIcon from '/img/folder_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import api from '../controlador/api.js';

const ListadoFichas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelado = false;

    const cargarFichas = async () => {
      setCargando(true);
      setError('');
      try {
        const { data } = await api.get('/api/fichas');

        // Normalizamos los campos por si vienen con nombres distintos
        const normalizadas = (Array.isArray(data) ? data : [])
          .map((f) => {
            const id = f.ID_Ficha ?? f.Codigo_Ficha ?? f.codigo ?? f.id ?? '';
            const nombre = f.Programa ?? f.programa ?? f.Nombre ?? f.nombre ?? '';
            const estado = f.Estado ?? f.estado ?? 'Activo';
            return { _id: String(id), _nombre: String(nombre), _estado: String(estado) };
          })
          .filter((f) => f._id); // solo fichas válidas

        if (!cancelado) setFichas(normalizadas);
      } catch (e) {
        if (!cancelado) {
          if (e?.response?.status === 401) {
            setError('No estás autenticada. Vuelve a iniciar sesión.');
          } else if (e?.response?.status === 403) {
            setError('No tienes permisos para ver las fichas.');
          } else {
            setError('No se pudieron cargar las fichas. Verifica el backend.');
          }
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargarFichas();
    return () => {
      cancelado = true;
    };
  }, []);

  // Filtrado por búsqueda
  const fichasFiltradas = fichas.filter((ficha) =>
    (ficha._id + ' ' + ficha._nombre).toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Ir a lista de aprendices
  const verAprendices = (fichaId) => {
    navigate(`/lista-aprendices/${fichaId}`);
  };

  return (
    <div className="layout-listado-fichas">
      {/* COLUMNA IZQUIERDA */}
      <div className="izquierda navegacion">
        <img src={logoSena} alt="Logo SENA" className="imagen-header" />
        
      </div>

      {/* COLUMNA DERECHA */}
      <div className="derecha contenido">
        <h2 className="titulo-principal">Listado de fichas</h2>
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar ficha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {cargando && <p className="cargando">Cargando fichas...</p>}
        {error && <p className="error">{error}</p>}

        <div className="listado-fichas">
          {fichasFiltradas.map((ficha) => (
            <div key={ficha._id} className="ficha-item">
              <img src={folderIcon} alt="Icono" className="icono-carpeta" />
              <div className="ficha-info">
                <div className="ficha-codigo">ficha: {ficha._id}</div>
                {ficha._nombre && <div className="ficha-programa">Programa: {ficha._nombre}</div>}
                <div className="ficha-estado">Estado: {ficha._estado}</div>
              </div>
              <button className="seleccionar-boton" onClick={() => verAprendices(ficha._id)}>
                Seleccionar
              </button>
            </div>
          ))}

          {!cargando && !error && fichasFiltradas.length === 0 && (
            <p className="sin-resultados">No se encontraron fichas</p>
          )}
        </div>

        <p className="pie-de-pagina">2024 - Servicio Nacional de Aprendizaje SENA</p>

        <div className="flecha-container">
          <button className="boton-flecha" onClick={() => navigate('/menu')}>
            <FontAwesomeIcon icon={faArrowLeft} /> Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListadoFichas;
