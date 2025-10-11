import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App.jsx';


import RankingComponent from './components/ranking/RankingComponent';
import CatalogoComponent from './components/catalogo/CatalogoComponent';
import APIComponent from './components/api/APIComponent';
import HomeComponent from './components/home/HomeComponent';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MapaComponent from './components/mapa/MapaComponent';
import Acerca from './components/acerca/Acerca';
import MapeoScoutComponent from './components/mapeo-scout/MapeoScoutComponent';
import {
  ComoEmpezar,
  ReferenciaEndpoints,
  ProbarApi,
  Recursos,
  ContactoSoporte,
  Licencias
} from './components/api/docs'
import IniciarSesion from './components/autenticacion/IniciarSesion.jsx';
import ProtectedRoute from './components/autenticacion/ProtectedRoute.jsx';
import PublicRoute from './components/autenticacion/PublicRoute.jsx';
import NoAutorizado from './components/autenticacion/NoAutorizado.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Tabla from './components/tabla/Tabla.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import ProyectosComponent from './components/proyectos/ProyectosComponent.jsx';
import DetalleProyecto from './components/proyectos/DetalleProyecto.jsx';
import ProyectosLayout from './components/proyectos/ProyectosLayout.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="mapa" element={<MapaComponent />} />
        <Route path="ranking" element={<RankingComponent />} />
        <Route path="aprende" element={<CatalogoComponent />} />
        <Route path="acerca" element={<Acerca />} />
        <Route path="login" element={<PublicRoute element={<IniciarSesion />} />} />
        <Route path="iniciar-sesion" element={<PublicRoute element={<IniciarSesion />} />} />

        <Route path="admin" element={<ProtectedRoute element={<AdminDashboard />} requiresAuthorization={true} />} />
        <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="tabla" element={<ProtectedRoute element={<Tabla />} requiresAuthorization={true} />} />
        <Route path="mapeo-scout" element={<ProtectedRoute element={<MapeoScoutComponent />} requiresAuthorization={true} />} />

        {/* Rutas de proyectos con layout compartido */}
        <Route path="proyectos" element={<ProtectedRoute element={<ProyectosLayout />} requiresAuthorization={true} />}>
          <Route index element={<ProyectosComponent />} />
          <Route path=":id" element={<DetalleProyecto />} />
        </Route>

        <Route path="api" element={<ProtectedRoute element={<APIComponent />} requiresAuthorization={true} />}>
          <Route path='como-empezar' element={<ComoEmpezar />} />
          <Route path='referencia-endpoints' element={<ReferenciaEndpoints />} />
          <Route path='probar-api' element={<ProbarApi />} />
          <Route path='recursos' element={<Recursos />} />
          <Route path='contacto-soporte' element={<ContactoSoporte />} />
          <Route path='licencias-limitaciones' element={<Licencias />} />
        </Route>

        <Route path="no-autorizado" element={<NoAutorizado />} />

        <Route path="*" element={<main style={{ padding: "1rem" }}><h2>Ho hay nada aquí!</h2></main>} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

