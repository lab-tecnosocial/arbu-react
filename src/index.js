import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';

import MapaComponent from './components/mapa/MapaComponent';
import RankingComponent from './components/ranking/RankingComponent';
import CatalogoComponent from './components/catalogo/CatalogoComponent';
import APIComponent from './components/api/APIComponent';
import HomeComponent from './components/home/HomeComponent';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    <Routes>
      <Route path="/" element={<HomeComponent />} />
      <Route path="mapa" element={<MapaComponent />} />
      <Route path="ranking" element={<RankingComponent />} />
      <Route path="catalogo" element={<CatalogoComponent />} />
      <Route path="api" element={<APIComponent />} />
      <Route path="*" element={ <main style={{ padding: "1rem" }}><h2>Ho hay nada aquí!</h2></main>}/>
    </Routes>
  </BrowserRouter>
);

