import { BrowserRouter, Routes, Route } from "react-router-dom";
import RankingComponent from './components/ranking/RankingComponent';
import CatalogoComponent from './components/catalogo/CatalogoComponent';
import APIComponent from './components/api/APIComponent';
import MapaPage from './pages/mapav/MapaPage.jsx';
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
import './index.css';
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"
import { authLogin } from "./actions/auth.actions.jsx";
import { auth } from "./firebase/firebase-config.js";
import { Inscripcion } from "./pages/inscripcion/Inscripcion.jsx";

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
        <Route path="*" element={<main style={{ padding: "1rem" }}><h2>Ho hay nada aquí!</h2></main>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
