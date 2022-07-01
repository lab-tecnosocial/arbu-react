import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideDetailArbol, setActiveMonitoreo } from "../../actions/mapaActions";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import IconButton from '@mui/material/IconButton';
import ImageDetail from "./ImageDetail";
import "./DetailArbol.css";
import gotaIcon from './gota_contorno.svg'
import alturaIcon from './altura.svg'
import estetoscopioIcon from './estetoscopio.svg'
import relogIcon from './relog.svg'
import SvgComponent from "./SvgComponent";
const DetailArbol = () => {

  const dispatch = useDispatch();
  const { active: arbol, usuarios, monitoreo,usuariosMap } = useSelector((state) => state.mapa);
  const [monitoreos, setMonitoreos] = useState([]);
  // console.log(usuariosMap);
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
  const getUserPhoto = (id)=>{
    if (arbol !== null) {
      if(usuariosMap !==null){
         if(usuariosMap.hasOwnProperty(id)){
      // console.log(usuariosMap.id);
      // console.log(usuariosMap[id]);
      return usuariosMap[id]?.imageProfile;
     }
      }
    }
    return "default";
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
      {/* <button >X</button> */}
      
      <IconButton aria-label="back" onClick={handleCloseDetail}>
      <ArrowBackIosNewIcon  sx={{color:'#000'}}/>
      </IconButton>
      {/* {monitoreos.length > 0 
        && (
          <ImageDetail src={monitoreos[0]?.fotografia} />
        )
      } */}
      
      <div className="detail-container">
        <div style={{marginTop:'auto',marginBottom:'auto'}}>
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
          <h2 className="titles">
            &nbsp;
            {arbol?.nombrePropio}
          </h2>
          <div className="text-normal">
            <div>
              Nombre común:&nbsp;
              {arbol?.nombreComun}
            </div>
            <div>
              Nombre científico:&nbsp;
              {arbol?.nombreCientifico}
            </div>
            <div>
              Lugar de plantación:&nbsp;
              {arbol?.lugarDePlantacion}
            </div>
            <div>
              Adoptado por: <br />
              {(arbol?.usuariosQueAdoptaron).map((stringIdUser, i) => (
                <div key={stringIdUser} style={{display:'table'}}>
                  {
                    getUserPhoto(stringIdUser) !== 'default'?
                    (
                      <img src={getUserPhoto(stringIdUser)} alt="" width="30px" height="30px" style={{borderRadius:'50%'}} referrerPolicy="no-referrer"/>
                    ):
                    (
                      <SvgComponent />
                    )
                  }
                 
                  <span style={{display:'table-cell',verticalAlign:'middle'}}>
                    &nbsp;{getFullNameUser(stringIdUser)}
                    {/* {i < arbol?.usuariosQueAdoptaron.length - 1 && `, `} */}
                  </span>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'50% 50%'}}>
              <div style={{display:'flex'}}>
                <span>Riegos:</span>&nbsp;
                <span >
                  <img src={gotaIcon} alt="" width="20px" height="20px" style={{verticalAlign:'middle'}} />
                </span>
                <span>{arbol !== null && Object.entries(arbol?.riegos).length}</span>
              </div>
              <div>
                Estado:&nbsp;
                {arbol?.estado}
              </div>
            </div>
          </div>
        </div>
        
        <div></div>
      </div>
      
        <div className="card container text-normal">
         
          
            <div style={{display:'table'}}>
            <span style={{display:'table-cell',verticalAlign:'middle'}}><img src={relogIcon} alt="" width="20px" height="20px"/></span> Fecha: { monitoreos.length>0 && (new Date(monitoreo?.timestamp._seconds * 1000)).toDateString()}
            </div>
            <div style={{display:'flex',alignItems:'center'}}>
              <div>
                 {   getUserPhoto(monitoreo?.monitoreoRealizadoPor) !== 'default'?
                    (
                      <img src={getUserPhoto(monitoreo?.monitoreoRealizadoPor)} alt="" width="30px" height="30px" style={{borderRadius:'50%'}} referrerPolicy="no-referrer" />
                    ):
                    (
                      <SvgComponent />
                    )}
              </div>
              &nbsp;
              <div style={{display:'inline'}}>
                <div>
                  Monitoreado por:
                </div>
                <div>
                  {monitoreos.length>0 && getFullNameUser(monitoreo?.monitoreoRealizadoPor)}
                </div>
              </div>
          
            </div>
            <div style={{display:'table'}}>
            <span style={{display:'table-cell',verticalAlign:'middle'}}><img src={alturaIcon} alt="" width="20px" height="20px"/></span>Altura (m): {monitoreos.length>0 && monitoreo?.altura}  
            </div>
            <div style={{display:'table'}}>
            <span style={{display:'table-cell',verticalAlign:'middle'}}><img src={estetoscopioIcon} alt="" width="20px" height="20px"/></span>Sanidad: {monitoreos.length>0 && monitoreo?.sanidad}
            </div>
          
        </div>
        <div className="titles" style={{ fontWeight: "bold",marginLeft:'20px' }}>Monitoreos Pasados</div>
        <div className="monitores-list text-normal">
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
                  <div style={{display:'table'}}>
                  <span style={{display:'table-cell',verticalAlign:'middle'}}><img src={relogIcon} alt="" width="30px" height="30px"/></span>&nbsp;<span style={{display:'table-cell',verticalAlign:'middle'}}>Fecha: {(new Date(item.timestamp._seconds * 1000)).toDateString()}</span>
                  </div>
                  <div style={{display:'table'}}>
                   {getUserPhoto(item.monitoreoRealizadoPor) !== 'default'?
                    (
                      <img src={getUserPhoto(item.monitoreoRealizadoPor)} alt="" width="30px" height="30px" style={{borderRadius:'50%'}} referrerPolicy="no-referrer"/>
                    ):
                    (
                      <SvgComponent />
                    )} 
                    <span style={{display:'table-cell',verticalAlign:'middle'}}>&nbsp;Monitoreado por: {getFullNameUser(item.monitoreoRealizadoPor)}</span>
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
