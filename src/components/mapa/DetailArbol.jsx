import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideDetailArbol, setActiveMonitoreo } from "../../actions/mapaActions";

import ImageDetail from "./ImageDetail";
import "./DetailArbol.css";

const DetailArbol = () => {

  const dispatch = useDispatch();
  const { active: arbol, usuarios, monitoreo } = useSelector((state) => state.mapa);
  const [monitoreos, setMonitoreos] = useState([]);

  useEffect(() => {
    if (arbol !== null) {
      let monitoreosSorted = Object.values(arbol.monitoreos).sort((a, b) => {
        let fechaA = Number(new Date(a.timestamp._seconds * 1000));
        let fechaB = Number(new Date(b.timestamp._seconds * 1000));
        return fechaB - fechaA;
      });
      dispatch(setActiveMonitoreo(monitoreosSorted[0]));
      setMonitoreos(monitoreosSorted);
      
    }
  }, [arbol, setMonitoreos,dispatch]);
 
  const handleCloseDetail = () => {
    dispatch(hideDetailArbol());
    document.querySelector('.leaflet-control-zoom-in').style.display='block';
          document.querySelector('.leaflet-control-zoom-out').style.display='block';
  }

  const getNameUser = (id) => {
    if (arbol !== null) {
      for (const [key, value] of Object.entries(usuarios)) {
        if (value.id === id) {
          const n = value.nombre;
          const firstWordFromName = n.split(" ")[0];
          return firstWordFromName;
        }
      }
    }
    return "";
  }

  const getFullNameUser = (id) => {
    if (arbol !== null) {
      for (const [key, value] of Object.entries(usuarios)) {
        if (value.id === id) {
          return value.nombre;
        }
      }
    }
    return "";
  };
  const handleClickMonitoreo = (m) => {
    if(monitoreo!==m)
    dispatch(setActiveMonitoreo(m));
  }
  if (arbol === null) {
    return <span></span>;
  }
  return (
    <div className={`detail-arbol ${arbol !== null && "active"}`} id="detail">
      <button onClick={handleCloseDetail}>X</button>
      {/* {monitoreos.length > 0 
        && (
          <ImageDetail src={monitoreos[0]?.fotografia} />
        )
      } */}
      
      <div className="detail-container">
        <div>
          {monitoreos.length > 0 && (
          //   <img
          //   className="image-monitoring"
          //   src={monitoreo?.fotografia}
          //   alt={monitoreo?.timestamp._seconds}
          // />
          <ImageDetail src={monitoreo?.fotografia}/>
          )}
        </div>
        <div>
          <h2>
            &nbsp;
            {arbol?.nombrePropio}
          </h2>
          <div>
            <div>
              Nombre comun:&nbsp;
              {arbol?.nombreComun}
            </div>
            <div>
              Nombre científico:&nbsp;
              {arbol?.nombreCientifico}
            </div>
            <div>
              Lugar de plantacion:&nbsp;
              {arbol?.lugarDePlantacion}
            </div>
            <div>
              Adoptado por: <br />
              {(arbol?.usuariosQueAdoptaron).map((stringIdUser, i) => (
                <span key={stringIdUser}>
                  {getNameUser(stringIdUser)}
                  {i < arbol?.usuariosQueAdoptaron.length - 1 && `, `}
                </span>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
              <span>
                Riegos:&nbsp;&nbsp;
                {arbol !== null && Object.entries(arbol?.riegos).length}
              </span>
              <span>
                Estado:&nbsp;
                {arbol?.estado}
              </span>
            </div>
          </div>
        </div>
        
        <div></div>
      </div>
      
        <div className="card container">
         
          
            <div>
            Fecha: { monitoreos.length>0 && (new Date(monitoreo?.timestamp._seconds * 1000)).toDateString()}
            </div>
            <div>
            Monitoreado por: {monitoreos.length>0 && getNameUser(monitoreo?.monitoreoRealizadoPor)}
            </div>
            <div>
            Altura (m): {monitoreos.length>0 && monitoreo?.altura}  
            </div>
            <div>
            Sanidad: {monitoreos.length>0 && monitoreo?.sanidad}
            </div>
          
        </div>
        <div style={{ fontWeight: "bold",marginLeft:'20px' }}>Monitoreos Pasados</div>
        <div className="monitores-list">
 {
          monitoreos.length>0
          &&
          monitoreos.map(item=>(
            <div key={item.timestamp._seconds} className="card hover" onClick={()=>handleClickMonitoreo(item)} >
              
              <div className="monitoreos-container">
                <div>
                  <img src={item.fotografia} alt={item.timestamp._seconds} width="80px" height="80px" />
                </div>
                <div style={{display:'block',marginTop:'auto',marginBottom:'auto'}}>
                  <div>
                    Fecha: {(new Date(item.timestamp._seconds * 1000)).toDateString()}
                  </div>
                  <div>
                    Monitoreado por: {getFullNameUser(item.monitoreoRealizadoPor)}
                  </div>
                </div>
              </div>
            </div>
          ))
        }
        </div>
       
    </div>
  );
};

export default DetailArbol;
