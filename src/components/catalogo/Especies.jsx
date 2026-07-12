<<<<<<< HEAD
import {useEffect, useState} from 'react';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import {useSelector,useDispatch} from 'react-redux';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { setActiveEspecie, startLoadEspeciesCatalogo } from '../../actions/catalogoActions';
import DetailEspecie from './DetailEspecie';
// import {especies} from "./especiesData.js"
import './Especies.css'


const Especies = () => {
  const dispatch = useDispatch();
  const {especies} = useSelector(state=>state.catalogo);
  const [usuarios, setUsuarios] = useState([]);
  const [tablaUsuarios, setTablaUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const handleChange=e=>{
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  }

const filtrar = (terminoBusqueda) => {
    const termino = terminoBusqueda.toLowerCase().trim();
    
    if (!termino) {
      setUsuarios(tablaUsuarios);
      return;
    }

    const resultadosBusqueda = tablaUsuarios.filter(elemento => {
      const nombreComun = elemento.nombreComun?.toString().toLowerCase() || "";
      const nombreCientifico = elemento.nombreCientifico?.toString().toLowerCase() || "";
      
      return nombreComun.includes(termino) || nombreCientifico.includes(termino);
    });

    setUsuarios(resultadosBusqueda);
  };

  const handleClickEspecie = (usuario) => {
  
    // console.log(usuario);
    dispatch(setActiveEspecie(usuario));
  }
=======
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveEspecie, startLoadEspeciesCatalogo } from '../../actions/catalogoActions';
import './Especies.css';

const Especies = () => {
  const dispatch = useDispatch();
  const { especies } = useSelector(state => state.catalogo);
  
  const [usuarios, setUsuarios] = useState([]);
  const [tablaUsuarios, setTablaUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // Corregido: de [""] a ""
  const [filtroOrigen, setFiltroOrigen] = useState("Todos"); // Nuevo estado para el filtro

  // Función unificada para filtrar por texto y por origen
  const aplicarFiltros = (texto, origen) => {
    let resultados = tablaUsuarios.filter(elemento => {
      // Coincidencia por texto (nombre común, científico o descripción)
      const busc = texto.toLowerCase();
      const coincideTexto = 
        (elemento.nombreComun || '').toLowerCase().includes(busc) ||
        (elemento.nombreCientifico || '').toLowerCase().includes(busc) ||
        (elemento.descripcion2 || '').toLowerCase().includes(busc);
      
      // Coincidencia por origen
      const coincideOrigen = (origen === "Todos") || (elemento.origen === origen);

      return coincideTexto && coincideOrigen;
    });
    setUsuarios(resultados);
  };

  const handleChangeBusqueda = e => {
    const valor = e.target.value;
    setBusqueda(valor);
    aplicarFiltros(valor, filtroOrigen);
  };

  const handleCambiarFiltro = () => {
    // Ciclo simple: Todos -> Nativa -> Introducida -> Todos
    let nuevoFiltro;
    if (filtroOrigen === "Todos") nuevoFiltro = "Nativa";
    else if (filtroOrigen === "Nativa") nuevoFiltro = "Introducida";
    else nuevoFiltro = "Todos";

    setFiltroOrigen(nuevoFiltro);
    aplicarFiltros(busqueda, nuevoFiltro);
  };

  const handleClickEspecie = (usuario) => {
    dispatch(setActiveEspecie(usuario));
  };
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
  
  useEffect(() => {
    dispatch(startLoadEspeciesCatalogo());
  }, [dispatch]);

  useEffect(() => {
    if (especies && especies.length > 0) {
      setUsuarios(especies);
      setTablaUsuarios(especies);
    }
  }, [especies]);

<<<<<<< HEAD
  return (
    <div className="App">
      
      
    <div className="containerInput">
      <div className='search'>
        
        <input
          className="form-control inputBuscar"
          value={busqueda}
          placeholder="Búsqueda por Nombre común o científico"
          onChange={handleChange}
        />
        <button className="btn btn-success">
        {/* <IconButton aria-label="back" > */}
        <SearchIcon  sx={{color:'#fff'}}/>
        {/* </IconButton> */}
        </button>
      </div>
    </div>
    <div className='container-primary'>

    {usuarios &&
      usuarios.map((usuario)=>(   
       <div key={usuario.id} onClick={()=>handleClickEspecie(usuario)} style={{borderRadius:'1rem'}}>
        {/* <a  href="">      */}

        <div className='container-catalogo'>
        
          <Button className='button-primary'>
        <figure>
        <img 
        src={usuario.imagenesUri[0]} 
        alt={usuario.nombreComun} 
        referrerPolicy="no-referrer"
        style={{borderRadius:'1rem'}}
        />  
        </figure>
        <div className='container-text-icon'>
          <div className='text-arbol'>
          <h2 className='titles'>
              {usuario.nombreComun} 
          </h2>
            <p className='text-normal descripcion'>
            {usuario.descripcion2}
            </p>
          </div>

        <div className='container-icon-info'> 
          <span>
          </span>
            <figure className="icon-info">
              {/* <IconButton aria-label="back" >
              <InfoIcon  sx={{color:'#fff'}}/>
              </IconButton> */}
              <div className="text-origen">
              
               {usuario?.origen === 'Nativa' ? 
            
               <span style={{backgroundColor:'#03b25e'}}>
                 {usuario?.origen}
                </span>
               : 
                <span >
                  {usuario?.origen}
                  </span>
               }
                  
                 
                </div>
        </figure>
        </div>
        </div>
        </Button>
        
        </div> 
        {/* </a> */}
      </div>
))

}

    </div>
    </div>
  );
}
  
  export default Especies
=======

  return (
    <section className='catalogo-wrapper'>
      <div className='catalogo-search-row'>
        {/* Botón de filtro ahora funcional */}
        <button 
          className={`filter-chip ${filtroOrigen !== 'Todos' ? 'active-filter' : ''}`} 
          type='button'
          onClick={handleCambiarFiltro}
        >
          <TuneIcon sx={{ fontSize: '1rem' }} />
          {filtroOrigen === "Todos" ? "Filtrar" : `Origen: ${filtroOrigen}`}
        </button>

        <div className='search-box'>
          <input
            className='form-control inputBuscar'
            value={busqueda}
            placeholder='Buscar...'
            onChange={handleChangeBusqueda}
          />
          <SearchIcon sx={{ color: '#777' }} />
        </div>

        <button className='btn-success' type='button' onClick={() => aplicarFiltros(busqueda, filtroOrigen)}>
          Buscar
        </button>
      </div>

      <div className='container-primary'>
        {usuarios && usuarios.map((usuario) => (
          <article
            key={usuario.id}
            className='container-catalogo'
            onClick={() => handleClickEspecie(usuario)}
          >
            <figure>
              <img
                src={usuario.imagenesUri[0]}
                alt={usuario.nombreComun}
                referrerPolicy='no-referrer'
              />
            </figure>

            <div className='container-text-icon'>
              <div className='text-arbol'>
                <h2 className='titles'>{usuario.nombreComun}</h2>
                <p className='text-normal descripcion'>{usuario.descripcion2}</p>
              </div>

              <div className='container-icon-info'>
                <span className={`origin-badge ${usuario?.origen === 'Nativa' ? 'nativa' : 'introducida'}`}>
                  {usuario?.origen}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Especies;
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
