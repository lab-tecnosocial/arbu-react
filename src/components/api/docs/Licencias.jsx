import { Link } from "react-router-dom"

const Licencias = () => {
  return (
    <>
      <div className='apidocs__panel-row'>
        <h3 id="uso-api">Uso de la API</h3>
        <p>Nuestra API de árboles urbanos está disponible para su uso bajo la licencia de Arbu. Al acceder y utilizar esta API, aceptas respetar los términos de esta licencia.</p>
      </div>

      <div className='apidocs__panel-row'>
        <h3 id="derechos-de-propiedad">  Derechos de propiedad</h3>
        <p> Todos los derechos de propiedad intelectual de la API y los datos proporcionados a través de ella son propiedad de Arbu. No se otorgan derechos de propiedad sobre la API o los datos, excepto los expresamente otorgados por nuestra licencia.</p>
      </div>
      <div className='apidocs__panel-row'>
        <h3 id="uso-aceptable">  Uso aceptable</h3>
        <p> Al utilizar nuestra API, aceptas utilizarla solo con fines legales y de acuerdo con estos términos y condiciones. No debes utilizar la API de manera que pueda dañar, deshabilitar, sobrecargar o perjudicar nuestra infraestructura o interferir con el uso y disfrute de la API por parte de otros usuarios.</p>
      </div>
      <div className='apidocs__panel-row'>
        <h3 id="limitaciones-responsabilidad">  Limitación de responsabilidad</h3>
        <p>Nos esforzamos por proporcionar una API confiable y precisa, pero no garantizamos que esté libre de errores o que funcione de manera ininterrumpida. En ningún caso seremos responsables de cualquier daño directo, indirecto, incidental, especial o consecuente que surja del uso de nuestra API.</p>
      </div>
      <div className='apidocs__panel-row'>
        <h3 id="modificaciones-terminacion">Modificaciones y Terminación</h3>
        <p>Nos esforzamos por proporcionar una API confiable y precisa, pero no garantizamos que esté libre de errores o que funcione de manera ininterrumpida. En ningún caso seremos responsables de cualquier daño directo, indirecto, incidental, especial o consecuente que surja del uso de nuestra API.</p>
        <p>Al acceder y utilizar nuestra API de árboles urbanos, aceptas cumplir con estos términos y condiciones.Si no estás de acuerdo con estos términos, no debes utilizar la API.Si tienes alguna pregunta sobre nuestros términos y condiciones, contáctanos en info @arbu.com.</p>
      </div >
      <div className='subnav-links'>
        <Link to={'/api/contacto-soporte'} onClick={() => window.scrollTo(0, 0)}>Contacto y soporte</Link>
      </div>
    </>
  )
}

export default Licencias
