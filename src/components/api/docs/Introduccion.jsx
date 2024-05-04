import React from 'react'
import img from '../assets/arbuimg.webp'
import { Link } from 'react-router-dom'

const Introduccion = () => {
  return (
    <>
      <div className='image-wrapper'>
        <div className='image-text'>Introduccion</div>
        <img src={img} loading='lazy' />
      </div>
      <div className='apidocs__panel-row'>
        <p>¡Bienvenido a la documentación de la API de Árboles Urbanos!</p>
      </div>
      <div className='apidocs__panel-row'>
        <h4>¿Qué es la API de Árboles Urbanos?</h4>
        <p>La API de Árboles Urbanos es una plataforma que proporciona acceso a datos sobre árboles en entornos urbanos. Ofrece información detallada sobre diferentes especies de árboles, ubicaciones de árboles plantados y otros datos relevantes para la gestión y conservación de áreas verdes en entornos urbanos.</p>
      </div>
      <div className='apidocs__panel-row'>
        <h4>Objetivo</h4>
        <p>El objetivo principal de esta API es facilitar el acceso a datos precisos y actualizados sobre árboles urbanos para profesionales en campos como la botánica, la gestión ambiental, la planificación urbana y cualquier persona interesada en el estudio y cuidado de los árboles en entornos urbanos.</p>
        <h4>Misión</h4>
        <p>Nuestra misión es promover la conservación y gestión sostenible de los árboles urbanos a través de la democratización del acceso a datos precisos y actualizados sobre la flora urbana. Creemos en la importancia vital de los árboles para la salud y el bienestar de nuestras comunidades, y estamos comprometidos a proporcionar a los usuarios las herramientas necesarias para comprender y proteger este valioso recurso natural.</p>
        <h4>Visión</h4>
        <p>Nuestra visión es crear un mundo donde los árboles urbanos sean valorados, protegidos y celebrados como parte integral de nuestras ciudades y comunidades. Queremos fomentar un mayor aprecio por la biodiversidad urbana y promover prácticas de gestión sostenible que garanticen la salud y la vitalidad de nuestros entornos urbanos para las generaciones futuras.</p>
      </div>
      <div className='subnav-link'>
        <Link to={'como-empezar'} onClick={() => window.scrollTo(0, 0)}>Como comenzar</Link>
      </div>
    </>
  )
}

export default Introduccion 
