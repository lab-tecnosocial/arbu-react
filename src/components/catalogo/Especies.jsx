import {useEffect, useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
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
  
    console.log(usuario);
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
          placeholder="Búsqueda por Nombre"
          onChange={handleChange}
        />
        <button className="btn btn-success">
          
        </button>
      </div>
    </div>
    <div className='container-primary'>

    {usuarios &&
      usuarios.map((usuario)=>(   
       <div key={usuario.id} onClick={()=>handleClickEspecie(usuario)} >
        {/* <a  href="">      */}
        
        <div className='container-catalogo'>
        <figure>
        <img 
        src={usuario.imagenesUri[0]} 
        alt={usuario.nombreComun} 
        referrerPolicy="no-referrer"
        
        />  
        </figure>
        
        <div className='text-arbol'>
        <p>
          {usuario.nombreComun} 
        </p>
        <p>
        {usuario.descripcion2}
        </p>
        </div>
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