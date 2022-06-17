import './App.css';
import { Link, Outlet } from "react-router-dom";
import { startLoadingArboles, startLoadingUsuarios } from './actions/mapaActions';
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(startLoadingArboles());
    dispatch(startLoadingUsuarios());
  }, [dispatch]);

  return (
    <>
 
     <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem",}}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/mapa">Mapa</Link> |{" "}
        <Link to="/ranking">Ranking</Link> |{" "}
        <Link to="/catalogo">Catalogo y Manuales de plantacion</Link> |{" "}
        <Link to="/api">API</Link> |{" "}
      </nav>
      
    </>
  );
}

export default App;
