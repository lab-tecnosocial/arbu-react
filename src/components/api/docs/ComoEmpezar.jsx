import React from "react"
import img from '../assets/arbuimg.webp'
import { Link } from "react-router-dom"
const ComoEmpezar = () => {
  return (
    <>

      <div className="apidocs__panel-row">
        <h3>Como empezar</h3>
        <p>
          Comienza a explorar datos representativos que reflejan información de árboles urbanos en la ciudad de Cochabamba.
        </p>
        <ul className="nav-list">
          <li>
            <Link to={'/api/recursos#conceptos'}>
              Conoce la terminología o conceptos útiles.
            </Link>
          </li>
          <li>
            <Link to={'/api/recursos#obtener-archivos'}>
              Como obtener datos en formato csv, xlsx, qgis u otros.
            </Link>
          </li>
          <li>
            <Link to={'/api/recursos'}>
              Como realizar peticiones HTTP personalizadas.
            </Link>
          </li>
          <li>
            <Link to={'/api/contacto-soporte'}>
              Obtén ayuda mediante nuestro contacto y soporte.
            </Link>
          </li>
        </ul>
        <p>Si en algún momento necesitas ayuda o tienes alguna pregunta, no dudes en ponerte en contacto con nuestro equipo de soporte. Estamos aquí para ayudarte en cada paso del camino mientras exploras el maravilloso mundo de los árboles urbanos con nuestra API.</p>
      </div>
      <div className='subnav-links'>
        <Link to={'/api'} onClick={() => window.scrollTo(0, 0)}>Introducción</Link>
        <Link to={'/api/referencia-endpoints'} onClick={() => window.scrollTo(0, 0)}>Referencia de endpoints</Link>
      </div>
    </ >

  )
}

export default ComoEmpezar
