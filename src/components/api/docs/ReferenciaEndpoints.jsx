import { Link } from "react-router-dom"

const ReferenciaEndpoints = () => {
  return (
    <>
      <div className='apidocs__panel-row'>
        <h3 id="descripcion-general">
          Descripcion general de los endpoints</h3>
        <p>Nuestra API de árboles urbanos proporciona diversos endpoints que te permiten acceder a información detallada sobre especies de árboles, árboles plantados y más. A continuación, se presenta una descripción general de la estructura de los endpoints disponibles.</p>
      </div>
      <div className="apidocs__panel-row">
        <h3 id="detalles-endpoint">Endpoints disponibles</h3>
        <p>A continuación, se presenta una lista de los endpoints disponibles en la API de Árboles Urbanos, junto con una breve descripción de su función y los parámetros de consulta admitidos:</p>
        <h4>1. /arboles</h4>
        <ul>
          <li>
            <span>Descripción:</span> Este endpoint devuelve una lista de árboles urbanos que cumplen con los criterios especificados.
          </li>
          <li>
            <span>Método HTTP:</span> GET
          </li>
          <li>
            <span>Parámetros de Consulta:</span>
            <ul>
              <li>
                <span>`especie`:</span> Filtra los árboles por especie.
              </li>
              <li>
                <span>`ubicacion`:</span> Filtra los árboles por ubicación geográfica.
              </li>
            </ul>
          </li>
          <li>
            <span>Respuestas Posibles</span> GET
            <ul>
              <li>
                <span>`200 OK`:</span> La solicitud fue exitosa y se devolvieron los datos solicitados.
              </li>
              <li>
                <span>`400 Bad Request`:</span> La solicitud contiene parámetros no válidos o está mal formada.
              </li>
              <li>
                <span>`404 Not Found`:</span> No se encontraron árboles que cumplan con los criterios de búsqueda especificados.
              </li>
            </ul>
          </li>
        </ul>

        <h4>2. /especies</h4>
        <ul>
          <li>
            <span>Descripción:</span> Este endpoint devuelve una lista de especies de árboles disponibles en la base de datos.
          </li>
          <li>
            <span>Método HTTP:</span> GET
          </li>
          <li>
            <span>Parámetros de Consulta:</span> Ninguno
          </li>
          <li>
            <span>Respuestas Posibles</span> GET
            <ul>
              <li>
                <span>`200 OK`:</span> La solicitud fue exitosa y se devolvieron los datos solicitados.
              </li>
              <li>
                <span>`404 Not Found`:</span> No se encontraron especies de árboles en la base de datos.
              </li>
            </ul>
          </li>
        </ul>

        <h4>3. /id (detalles)</h4>
        <ul>
          <li>
            <span>Descripción:</span> Este endpoint devuelve detalles específicos sobre un árbol urbano en particular.
          </li>
          <li>
            <span>Método HTTP:</span> GET
          </li>
          <li>
            <span>Parámetros de Consulta:</span>
            <ul>
              <li>
                <span>`id`:</span> El ID único del árbol que se desea consultar.
              </li>
            </ul>
          </li>
          <li>
            <span>Respuestas Posibles</span> GET
            <ul>
              <li>
                <span>`200 OK`:</span> La solicitud fue exitosa y se devolvieron los detalles del árbol solicitado.
              </li>
              <li>
                <span>`400 Bad Request`:</span> La solicitud contiene parámetros no válidos o está mal formada.
              </li>
              <li>
                <span>`404 Not Found`:</span> No se encontró un árbol con el ID especificado.
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="apidocs__panel-row">
        <h3 id="codigos-estado">Respuestas posibles y codigos de estado HTTP</h3>
        <ul>
          <li><span>200 OK:</span> La solicitud se completó correctamente</li>
          <li><span>201 Created:</span> La solicitud se ha completado y se ha creado un nuevo recurso</li>
          <li><span>400 Bad Request:</span> La solicitud no se pudo entender debido a una sintaxis incorrecta o parámetros inválidos</li>
          <li><span>401 Unauthorized:</span> La solicitud no se pudo procesar debido a la falta de autenticación o credenciales inválidas</li>
          <li><span>403 Forbidden:</span> El servidor entendió la solicitud, pero se niega a cumplirla debido a que el cliente no tiene permiso para realizar la acción solicitada</li>
          <li><span>404 Not Found:</span> El recurso solicitado no se encontró en el servidor.</li>
        </ul>
      </div>
      <div className='subnav-links'>
        <Link to={'/api/como-empezar'} onClick={() => window.scrollTo(0, 0)}>Como empezar</Link>
        <Link to={'/api/recursos'} onClick={() => window.scrollTo(0, 0)}>Recursos</Link>
      </div>
    </>
  )
}

export default ReferenciaEndpoints
