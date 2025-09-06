import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import RankingComponent from './components/ranking/RankingComponent';
import CatalogoComponent from './components/catalogo/CatalogoComponent';
import APIComponent from './components/api/APIComponent';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MapaComponent from './pages/mapav/MapaComponent';
import Acerca from './components/acerca/Acerca';
import {
  ComoEmpezar,
  ReferenciaEndpoints,
  ProbarApi,
  Recursos,
  ContactoSoporte,
  Licencias
} from './components/api/docs'
import { Navbar } from './components/navbar/Navbar.jsx';
import { HomePage } from './pages/homev/HomePage.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <App /> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="mapa" element={<MapaComponent />} />
        <Route path="ranking" element={<RankingComponent />} />
        <Route path="aprende" element={<CatalogoComponent />} />
        <Route path="api" element={<APIComponent />}>
          <Route path='como-empezar' element={<ComoEmpezar />} />
          <Route path='referencia-endpoints' element={<ReferenciaEndpoints />} />
          <Route path='probar-api' element={<ProbarApi />} />
          <Route path='recursos' element={<Recursos />} />
          <Route path='contacto-soporte' element={<ContactoSoporte />} />
          <Route path='licencias-limitaciones' element={<Licencias />} />
        </Route>
        <Route path="acerca" element={<Acerca />} />

        <Route path="*" element={<main style={{ padding: "1rem" }}><h2>Ho hay nada aquí!</h2></main>} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

