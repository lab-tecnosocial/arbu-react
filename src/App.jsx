import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RankingComponent from './components/ranking/RankingComponent';
import CatalogoComponent from './components/catalogo/CatalogoComponent';
import MapaPage from './pages/mapav/MapaPage.jsx';
import Acerca from './components/acerca/Acerca';
import { Navbar } from './components/navbar/Navbar.jsx';
import { HomePage } from './pages/homev/HomePage.jsx';
import './index.css';
import { useDispatch } from "react-redux";
import { Suspense, lazy, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"
import { authLogin } from "./actions/auth.actions.jsx";
import { auth } from "./firebase/firebase-config.js";
import { Inscripcion } from "./pages/inscripcion/Inscripcion.jsx";

// Las rutas de guardia sí se cargan siempre: son las que deciden el acceso.
import ProtectedRoute from './components/autenticacion/ProtectedRoute.jsx';
import PublicRoute from './components/autenticacion/PublicRoute.jsx';

// Arbu Pro (back-office) y la documentación de la API se cargan bajo demanda:
// arrastran material-react-table, xlsx y swagger-ui, que no tienen por qué
// pesar en el bundle que descarga cualquier visitante del sitio público.
const APIComponent = lazy(() => import('./components/api/APIComponent'));
const ComoEmpezar = lazy(() => import('./components/api/docs').then(m => ({ default: m.ComoEmpezar })));
const ReferenciaEndpoints = lazy(() => import('./components/api/docs').then(m => ({ default: m.ReferenciaEndpoints })));
const ProbarApi = lazy(() => import('./components/api/docs').then(m => ({ default: m.ProbarApi })));
const Recursos = lazy(() => import('./components/api/docs').then(m => ({ default: m.Recursos })));
const ContactoSoporte = lazy(() => import('./components/api/docs').then(m => ({ default: m.ContactoSoporte })));
const Licencias = lazy(() => import('./components/api/docs').then(m => ({ default: m.Licencias })));

const IniciarSesion = lazy(() => import('./components/autenticacion/IniciarSesion.jsx'));
const NoAutorizado = lazy(() => import('./components/autenticacion/NoAutorizado.jsx'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard.jsx'));
const Tabla = lazy(() => import('./components/tabla/Tabla.jsx'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard.jsx'));
const GestionAccesos = lazy(() => import('./components/admin/GestionAccesos.jsx'));
const MapeoScoutComponent = lazy(() => import('./components/mapeo-scout/MapeoScoutComponent.jsx'));
const Aportes = lazy(() => import('./components/aportes/Aportes.jsx'));
const ProyectosComponent = lazy(() => import('./components/proyectos/ProyectosComponent.jsx'));
const DetalleProyecto = lazy(() => import('./components/proyectos/DetalleProyecto.jsx'));
const ProyectosLayout = lazy(() => import('./components/proyectos/ProyectosLayout.jsx'));

// Campañas de mapeo y panel del concurso
const ListaCampanas = lazy(() => import('./components/concurso/ListaCampanas.jsx'));
const CampanaLayout = lazy(() => import('./components/concurso/CampanaLayout.jsx'));
const ResumenConcurso = lazy(() => import('./components/concurso/ResumenConcurso.jsx'));
const TablaRegistrosConcurso = lazy(() => import('./components/concurso/TablaRegistrosConcurso.jsx'));
const ColaRevision = lazy(() => import('./components/concurso/ColaRevision.jsx'));
const TablaPosiciones = lazy(() => import('./components/concurso/TablaPosiciones.jsx'));
const ActaResultados = lazy(() => import('./components/concurso/ActaResultados.jsx'));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(authLogin(currentUser));
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<main style={{ padding: "1rem" }}>Cargando…</main>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="mapa" element={<MapaPage />} />
          <Route path="ranking" element={<RankingComponent />} />
          <Route path="aprende" element={<CatalogoComponent />} />
          <Route path="inscripcion" element={<Inscripcion />} />
          <Route path="api" element={<APIComponent />}>
            <Route path='como-empezar' element={<ComoEmpezar />} />
            <Route path='referencia-endpoints' element={<ReferenciaEndpoints />} />
            <Route path='probar-api' element={<ProbarApi />} />
            <Route path='recursos' element={<Recursos />} />
            <Route path='contacto-soporte' element={<ContactoSoporte />} />
            <Route path='licencias-limitaciones' element={<Licencias />} />
          </Route>
          <Route path="acerca" element={<Acerca />} />

          {/* Arbu Pro */}
          <Route path="login" element={<PublicRoute element={<IniciarSesion />} />} />
          <Route path="iniciar-sesion" element={<PublicRoute element={<IniciarSesion />} />} />
          <Route path="admin" element={<ProtectedRoute element={<AdminDashboard />} requiresAuthorization={true} />} />
          <Route path="admin/accesos" element={<ProtectedRoute element={<GestionAccesos />} requiereSuperadmin={true} />} />
          <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} permiso="dashboard" />} />
          <Route path="tabla" element={<ProtectedRoute element={<Tabla />} permiso="tabla" />} />
          <Route path="mapeo-scout" element={<ProtectedRoute element={<MapeoScoutComponent />} permiso="mapeoScout" />} />
          <Route path="admin/aportes" element={<ProtectedRoute element={<Aportes />} permiso="aportes" />} />

          {/* Gestión de proyectos, con layout compartido */}
          <Route path="proyectos" element={<ProtectedRoute element={<ProyectosLayout />} permiso="proyectos" />}>
            <Route index element={<ProyectosComponent />} />
            <Route path=":id" element={<DetalleProyecto />} />
          </Route>

          {/* Campañas de mapeo: rutas anidadas para poder compartir enlaces
              concretos ("mirá las posiciones", "hay 30 pendientes en la cola"). */}
          <Route path="campanas" element={<ProtectedRoute element={<ListaCampanas />} permiso="campanas" />} />
          <Route path="campanas/:id" element={<ProtectedRoute element={<CampanaLayout />} permiso="campanas" />}>
            <Route index element={<Navigate to="resumen" replace />} />
            <Route path="resumen" element={<ResumenConcurso />} />
            <Route path="registros" element={<TablaRegistrosConcurso />} />
            <Route path="revision" element={<ColaRevision />} />
            <Route path="posiciones" element={<TablaPosiciones />} />
            <Route path="acta" element={<ActaResultados />} />
          </Route>

          <Route path="no-autorizado" element={<NoAutorizado />} />

          <Route path="*" element={<main style={{ padding: "1rem" }}><h2>Ho hay nada aquí!</h2></main>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
