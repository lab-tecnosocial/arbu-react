import React from 'react'
import iconoarbu from './../home/iconoarbu.png';
import lablogodia from './lablogodia.png';
import { Link as MuiLink } from "@mui/material";
import './Acerca.css';
import erick from './team/erick.png';
import patricia from './team/patricia.png';
import montserrat from './team/montserrat.png';
import brian from './team/brian.jpg';
import lourdes from './team/lourdes.jpg';
import dayra from './team/dayra.png';
import luis from './team/luis.png';
import marian from './team/marian.png';


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
          <section className="acerca-de">
        <h3>Nuestro Equipo 2024</h3>
        <div className="coordinadores">
            <div className="integrante">
                <img src={erick} alt="Coordinador 1" />
                <p className='nombre'>Erick Gomez</p>
                <p>Coordinación y Desarrollo<br />de Software</p>
            </div>
            <div className="integrante">
                <img src={patricia} alt="Coordinador 2" />
                <p className='nombre'>Patricia Delgadillo</p>
                <p>Coordinación y Comunicación</p>
            </div>
        </div>
        <div className="voluntarios">
          
            <div className="integrante">
                <img src={lourdes} alt="Voluntario 1" />
                <p className='nombre'>Lourdes Jacinto</p>
                <p>Forestal</p>
            </div>
            <div className="integrante">
                <img src={brian} alt="Voluntario 2" />
                <p className='nombre'>Brian Tarqui</p>
                <p>Desarrollo de Software</p>
            </div>
        </div>
    </section>
          <section className="acerca-de">
        <h2>Nuestro Equipo 2023</h2>
        <div className="coordinadores">
            <div className="integrante">
                <img src={erick} alt="Coordinador 1" />
                <p className='nombre'>Erick Gomez</p>
                <p>Coordinación y Desarrollo<br />de Software</p>
            </div>
            <div className="integrante">
                <img src={patricia} alt="Coordinador 2" />
                <p className='nombre'>Patricia Delgadillo</p>
                <p>Coordinación y Comunicación</p>
            </div>
        </div>
        <div className="voluntarios">
            
            
            <div className="integrante">
                <img src={marian} alt="Voluntario 3" />
                <p className='nombre'>Marian Gil</p>
                <p>Comunicación</p>
            </div>
            <div className="integrante">
                <img src={montserrat} alt="Voluntario 1" />
                <p className='nombre'>Montserrat Martínez</p>
                <p>Comunicación y Marketing</p>
            </div>
            <div className="integrante">
                <img src={luis} alt="Voluntario 4" />
                <p className='nombre'>Luis Ugarte</p>
                <p>Comunicación</p>
            </div>
            <div className="integrante">
                <img src={dayra} alt="Voluntario 2" />
                <p className='nombre'>Dayra Estrada</p>
                <p>Ciencia de Datos</p>
            </div>
        </div>
    </section>
            <div style={{color:'#174d44',fontFamily:'Poppins',fontSize:'1.2rem'}}>
            Agradecimientos
            </div>
        
            <div style={{fontWeight:'bold',color:'#174d44'}}>&nbsp;Gestión 2021- 2022</div>
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