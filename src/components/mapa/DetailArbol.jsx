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
        // let fechaA = Number(new Date(a.timestamp._seconds * 1000));
        // let fechaB = Number(new Date(b.timestamp._seconds * 1000));
        let fechaA = Number(new Date(a.timestamp.seconds * 1000));
        let fechaB = Number(new Date(b.timestamp.seconds * 1000));
        return fechaB - fechaA;
      });
      dispatch(setActiveMonitoreo(monitoreosSorted[0]));
      setMonitoreos(monitoreosSorted);
      
    }
  }, [arbol, setMonitoreos,dispatch]);
 
  const dateToDMY = (date) => {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
}
function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " a las " + strTime;
}
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
          <div >
            <div className="text-normal" >
              
              {arbol?.nombreComun}
            </div>
            <div className="text-normal" style={{fontStyle:'italic'}}>
              
              {arbol?.nombreCientifico}
            </div>
            <div className="text-normal">
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
                      <img className="img-usuarios" src={getUserPhoto(stringIdUser)} alt="" width="30px" height="30px" style={{borderRadius:'50%'}} referrerPolicy="no-referrer"/>
                    ):
                    (
                      <SvgComponent />
                    )
                  }
                 
                  <span className="span-nombre-usuarios" style={{display:'table-cell',verticalAlign:'middle'}}>
                    {getFullNameUser(stringIdUser)}
                    {/* {i < arbol?.usuariosQueAdoptaron.length - 1 && `, `} */}
                  </span>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'50% 50%'}}>
              <div style={{display:'flex'}}>
                <span className="text-normal">Riegos:</span>&nbsp;
                <span >
                  <img src={gotaIcon} alt="" width="20px" height="20px" style={{verticalAlign:'middle'}} />
                </span>
                <span>{arbol !== null && Object.entries(arbol?.riegos).length}</span>
              </div>
              <div className="text-normal">
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
            <span style={{display:'table-cell',verticalAlign:'middle'}}><img src={relogIcon} alt="" width="20px" height="20px"/></span> 
            {/* Fecha: { monitoreos.length>0 && formatDate((new Date(monitoreo?.timestamp.seconds * 1000)))} */}
            {/* &nbsp; */}
              <div style={{display:'inline'}}>
                <div>
                  Fecha:
                </div>
                <div>
                { monitoreos.length>0 && formatDate((new Date(monitoreo?.timestamp.seconds * 1000)))}
                </div>
              </div>
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
            <div key={item.timestamp.seconds} className="card hover" onClick={()=>handleClickMonitoreo(item)} >
              
              <div className="monitoreos-container">
                <div >
                  <img src={item.fotografia} alt="" width="70px" height="70px" />
                </div>
                <div style={{display:'block',marginTop:'auto',marginBottom:'auto',marginLeft:'8px'}}>
                  <div style={{display:'table'}}>
                  <span style={{display:'table-cell',verticalAlign:'middle'}}><img src={relogIcon} alt="" width="25px" height="25px"/></span>&nbsp;<span style={{display:'table-cell',verticalAlign:'middle'}}>Fecha:  { monitoreos.length>0 && formatDate((new Date(monitoreo?.timestamp.seconds * 1000)))}</span>
                  </div>
                  <div style={{display:'table'}}>
                   {getUserPhoto(item.monitoreoRealizadoPor) !== 'default'?
                    (
                      <img src={getUserPhoto(item.monitoreoRealizadoPor)} alt="" width="25px" height="25px" style={{borderRadius:'50%'}} referrerPolicy="no-referrer"/>
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
