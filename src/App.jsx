import { useState, useEffect } from 'react';
import Login from './pages/Login';
import CrearUsuario from './pages/CrearUsuario';
import PaginaPrincipalCoordinacion from './pages/PaginaPrincipalCoordinacion';
import ListadoFichas from './pages/ListadoFichas';
import ReporteGeneral from './pages/ReporteGeneral';
import ListaAprendices from './pages/ListaAprendices';
import Notificaciones from './pages/Notificaciones';
import ListadoFichasReportes from './pages/ListadoFichasReportes';

function App() {
  const [vista, setVista] = useState({ vista: 'login' });

  // ⚙️ Cambiador tolerante: acepta (obj) o (string, data)
  const cambiarVista = (arg, data = null) => {
    if (typeof arg === 'object' && arg !== null) {
      // Llamadas tipo setVista({ vista: 'x', ... })
      setVista(arg);
    } else {
      // Llamadas tipo setVista('x', { ... })
      setVista(data ? { vista: arg, ...data } : { vista: arg });
    }
  };

  // 🧹 Des-anidador: si alguien metió { vista: { vista: 'x', ... } }, lo arregla
  useEffect(() => {
    if (vista && typeof vista.vista === 'object' && vista.vista !== null && 'vista' in vista.vista) {
      // Normaliza a un solo nivel
      setVista(vista.vista);
    }
  }, [vista]);

  console.log('🧭 Vista actual:', JSON.stringify(vista, null, 2));
  console.log('🔎 Tipo de vista.vista:', typeof vista.vista);

  return (
    <>
      {vista.vista === 'login' && <Login setVista={cambiarVista} />}
      {vista.vista === 'crear' && <CrearUsuario setVista={cambiarVista} />}
      {vista.vista === 'menu' && <PaginaPrincipalCoordinacion setVista={cambiarVista} />}
      {vista.vista === 'listadoFichas' && <ListadoFichas setVista={cambiarVista} />}
      {vista.vista === 'reporteGeneral' && <ReporteGeneral setVista={cambiarVista} />}
      {vista.vista === 'listadoFichasReportes' && (
        <ListadoFichasReportes setVista={cambiarVista} fichaId={vista.fichaId} />
      )}
      {vista.vista === 'listaAprendices' && (
        <ListaAprendices setVista={cambiarVista} fichaId={vista.fichaId} />
      )}
      {vista.vista === 'notificaciones' && <Notificaciones setVista={cambiarVista} />}
    </>
  );
}

export default App;
