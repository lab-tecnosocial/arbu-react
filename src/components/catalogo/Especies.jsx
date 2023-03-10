import {useEffect, useState} from 'react';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import {useSelector,useDispatch} from 'react-redux';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { setActiveEspecie } from '../../actions/catalogoActions';
import DetailEspecie from './DetailEspecie';
// import {especies} from "./especiesData.js"
import './Especies.css'


const Especies = () => {
  const dispatch = useDispatch();
  const {especies} = useSelector(state=>state.catalogo);
  const [usuarios, setUsuarios] = useState([]);
  const [tablaUsuarios, setTablaUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState([""]);

  const handleChange=e=>{
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  }

  const filtrar=(terminoBusqueda)=>{
    // console.log(tablaUsuarios); 
    var resultadosBusqueda=tablaUsuarios.filter(elemento=>{
      if(elemento.nombreComun.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
        || elemento.nombreCientifico.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
    ){
      return elemento;
    }
  });
  setUsuarios(resultadosBusqueda);
  }

  const handleClickEspecie = (usuario) => {
  
    // console.log(usuario);
    dispatch(setActiveEspecie(usuario));
  }
  
  useEffect(() => {
    setUsuarios(especies);
    setTablaUsuarios(especies);
  }, [especies]);
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