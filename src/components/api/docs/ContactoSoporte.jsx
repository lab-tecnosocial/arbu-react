import React from 'react'
import { Link } from 'react-router-dom'

const ContactoSoporte = () => {
  return (
    <>
      <div className='apidocs__panel-row'>
        <h3>Contacto y Soporte</h3>
        <p>Si tienes alguna pregunta, comentario o necesitas asistencia relacionada con nuestra API de árboles urbanos, estamos aquí para ayudarte. A continuación, encontrarás diferentes formas de contactarnos:</p>
      </div>
      <div className='apidocs__panel-row'>
        <h3 id='contacto-general'>Contacto general</h3>
        <p>Para consultas generales, comentarios o cualquier otro asunto que no esté relacionado específicamente con el soporte técnico, puedes comunicarte con nosotros a través de:</p>
        <ul>
          <li>Correo Electrónico: info@arbu.com</li>
          <li>Formulario de Contacto: Completa nuestro formulario de contacto en línea enlace al formulario y nos pondremos en contacto contigo lo antes posible.</li>
          <li>Foro de Soporte: Visita nuestro foro de soporte en línea en <a href="https://www.facebook.com/ArbuCb/" target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>FACEBOOk</a> donde puedes publicar tus preguntas y recibir ayuda de la comunidad y nuestro equipo de soporte técnico.</li>
        </ul>
      </div>
      <div className='apidocs__panel-row'>
        <h3 id='redes-sociales'>Redes Sociales</h3>
        <p>También puedes seguirnos en nuestras redes sociales para estar al tanto de las últimas actualizaciones, anuncios y noticias relacionadas con nuestra API:</p>
        <ul>
          <li>
            <a href="https://www.facebook.com/ArbuCb/" target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>
              Enlace a la página de Facebook
            </a>
          </li>
          <li>
            <a href="https://twitter.com/ArbuCbba" target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>
              Enlace a la página de Twitter
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/arbucbba/" target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>
              Enlace a la página de Instagram
            </a>
          </li>
        </ul>
        <p>Estamos comprometidos a brindarte el mejor servicio posible y a responder a tus consultas en el menor tiempo posible. No dudes en contactarnos si necesitas ayuda o tienes alguna sugerencia para mejorar nuestra API.</p>
      </div>
      <div className='subnav-links'>
        <Link to={'/api/recursos'} onClick={() => window.scrollTo(0, 0)}>Recursos</Link>
        <Link to={'/api/licencias-limitaciones'} onClick={() => window.scrollTo(0, 0)}>Licencias y limitaciones</Link>
      </div>
    </>
  )
}

export default ContactoSoporte
