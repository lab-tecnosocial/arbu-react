import {useEffect, useState} from 'react';
import {especies} from "./especies"
import './Especies.css'


const Especies = () => {

  const [usuarios, setUsuarios] = useState(especies);
  const [tablaUsuarios, setTablaUsuarios] = useState(especies);
  const [busqueda, setBusqueda] = useState([""]);

  const handleChange=e=>{
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  }

  const filtrar=(terminoBusqueda)=>{
    console.log(tablaUsuarios);
    var resultadosBusqueda=tablaUsuarios.filter(elemento=>{
      if(elemento.nombreComun.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
    
    ){
      return elemento;
    }
  });
  setUsuarios(resultadosBusqueda);
  }
  return (
    <div className="App">
    <div className="containerInput">
          <input
            className="form-control inputBuscar"
            value={busqueda}
            placeholder="Búsqueda por Nombre"
            onChange={handleChange}
          />
          <button className="btn btn-success">
            
          </button>
    </div>
    <div className='container-primary'>

    {usuarios &&
      usuarios.map((usuario)=>(   
       <>
        <a key={usuario.id} href="">     
        
        <div className='container-catalogo'>
        <figure>
        <img 
        src={usuario.imagenesUri} 
        alt={usuario.nombreComun} referrerPolicy="no-referrer"/>  
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
        </a>
      </>
))

}

    </div>
    </div>
  );
}
  
  export default Especies