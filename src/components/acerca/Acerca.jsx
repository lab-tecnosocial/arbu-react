import React from 'react'
import iconoarbu from './../home/iconoarbu.png';
import lablogodia from './lablogodia.png';
import { Link as MuiLink } from "@mui/material";
const Acerca = () => {
  return (
    <div>
     <br />
      <center>
      <a href="https://play.google.com/store/apps/details?id=org.labtecnosocial.arbu.android&hl=es_BO&gl=US" target="_blank" rel="noopener noreferrer">
        
        <img src={iconoarbu} alt="" />
        </a>
        <div style={{color:'#174d44',fontFamily:'Poppins',fontSize:'1.2rem'}}>
          Arbu
        </div>
        <div style={{margin:'auto 20px',fontSize:'1rem',fontFamily:'Open Sans'}}>
          <br />
          Es una iniciativa del Laboratorio de Tecnologías Sociales (Lab TecnoSocial) en coordinación con especialistas forestales.
          <br />
          <br />
          <div>
          <MuiLink href="https://labtecnosocial.org/" target="_blank">
            
          <img src={lablogodia} alt="" width={200} />
            </MuiLink>

          </div>
          <br />
          <div style={{margin: 'auto 20px'}}>
            <div style={{color:'#174d44',fontFamily:'Poppins',fontSize:'1.2rem'}}>
            Agradecimientos
            </div>
            <div style={{fontWeight:'bold',color:'#174d44'}}>&nbsp;Coordinación</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Alex Ojeda (Coordinación General)</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Sarah Jiménez (Coordinación Técnica Forestal)</div>
            <div style={{fontWeight:'bold',color:'#174d44'}}>&nbsp;Desarrollo Arbu App móvil</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Erick Gomez (Desarrollo Android)</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Valeria Peredo (Diseño gráfico y UI)</div>
            <div style={{fontWeight:'bold',color:'#174d44'}}>&nbsp;Desarrollo Arbu web</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Erick Gomez</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Pedro Anze</div>
            <div style={{fontWeight:'bold',color:'#174d44'}}>&nbsp;Elaboración del catálogo de especies</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Daniela Acebey</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Denis De la Barra</div>
            <div style={{fontFamily:'Open Sans'}}>&nbsp;&nbsp;Irma Quispe</div>
          </div>
        </div>
      </center>
     
          <br />
          <br />
    </div>
  )
}

export default Acerca