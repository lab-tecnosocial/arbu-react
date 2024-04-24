import React from 'react'
import { Link } from 'react-router-dom'

const Recursos = () => {
  return (
    <>
      <div className='apidocs__panel-row'>
        <h3 id='realizar-peticiones'>Realizar peticiones HTTP persolanizados.</h3>
        <p>Si necesitas realizar peticiones HTTP personalizadas a nuestra API de árboles urbanos, puedes hacerlo utilizando cualquier cliente HTTP compatible. A continuación, te proporcionamos un ejemplo básico utilizando la biblioteca requests en Python:</p>
        <code>
          import requests

          url = 'https://api.arbolesurbanos.com/arboles/especies'
          {/* headers = {'Authorization': 'Bearer tu_token_de_autenticacion'} */}

          response = requests.get(url, headers=headers)

          if response.status_code == 200:
          data = response.json()
          # Procesa los datos obtenidos según sea necesario
          print(data)
          else:
          print("Error:", response.status_code)

        </code>
      </div>
      <div className='apidocs__panel-row'>
        <h3 id='obtener-archivos'>Obtener datos en formato csv, xlsx, otros.</h3>
        <p>Si prefieres obtener los datos en un formato descargable como CSV, XLSX u otros, proporcionamos enlaces directos para descargar estos archivos. Simplemente haz clic en los enlaces correspondientes a continuación:</p>
        <ul>
          <li>Descargar datos en formato CSV</li>
          <li>Descargar datos en formato XLSX</li>
          <li>Descargar datos en formato JSON</li>
        </ul>
        <p>
          Haz clic en el enlace del formato deseado para iniciar la descarga del archivo. Estos archivos están preparados y listos para su uso, por lo que no necesitas codificar para obtenerlos.
        </p>
      </div>
      <div className='apidocs__panel-row'>
        <h3 id='conceptos'>Conceptos</h3>
        <h4>Terminos principales</h4>
        <ul>
          <li><span>Especie Arbórea:</span> Tipo específico de árbol definido por sus características genéticas y morfológicas</li>
          <li>
            <span>
              Árbol Nativo:
            </span> Especie de árbol que es indígena de una región específica y ha evolucionado naturalmente en ese entorno</li>
          <li><span>Árbol Exótico:</span> Especie de árbol que es introducida en una región donde no es originaria.</li>
          <li><span>Árbol Caducifolio:</span> Árbol que pierde sus hojas en ciertas estaciones del año, típicamente en otoño.</li>
          <li><span>Árbol Perenne:</span> Árbol que retiene sus hojas durante todo el año.</li>
        </ul>
        <h4>Conceptos Tecnicos</h4>
        <ul>
          <li><span>API REST:</span> Interfaz de programación que utiliza el protocolo HTTP para realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre recursos.</li>
          <li><span>Endpoint:</span> Punto de acceso específico de una API que permite interactuar con un recurso particular</li>
          <li><span>Autenticación de API:</span> Proceso mediante el cual un usuario o aplicación se identifica ante la API para acceder a recursos protegidos.</li>
          <li><span>Protocolo de Transferencia de Hipertexto:</span> Protocolo de comunicación utilizado para transferir datos en la web.</li>
          <li><span>HTTPS (Protocolo de Transferencia de Hipertexto Seguro):</span> Versión segura de HTTP que utiliza cifrado SSL/TLS para proteger la comunicación.</li>
          <li><span>JSON (Notación de Objetos de JavaScript):</span> Formato de intercambio de datos ligero y legible por humanos basado en JavaScript.</li>
          <li><span>CSV (Valores Separados por Comas):</span> Formato de archivo utilizado para almacenar datos tabulares como una secuencia de valores separados por comas.</li>
          <li><span>HTTP:</span> Programa o biblioteca que permite realizar solicitudes HTTP a servidores web.</li>
          <li><span>Método HTTP:</span> Acción que se puede realizar sobre un recurso, como GET para obtener datos, POST para crear nuevos recursos, PUT para actualizar recursos existentes y DELETE para eliminar recursos.</li>
          <li><span>Código de Estado HTTP:</span> Números de tres dígitos que indican el resultado de una solicitud HTTP, como 200 para éxito, 404 para recurso no encontrado y 500 para error del servidor.</li>
        </ul>
        <h4>Geolocalizacion</h4>
        <ul>
          <li><span>Coordenadas Geográficas:</span> Pares de valores numéricos que representan la ubicación geográfica de un punto en la superficie de la Tierra, generalmente expresados en latitud y longitud.</li>
          <li><span>API de Geolocalización:</span> Servicio que proporciona información sobre la ubicación geográfica de un dispositivo o dirección basándose en sus coordenadas.</li>

          <li><span>Token de Acceso:</span> Cadena de caracteres utilizada para autenticar y autorizar las solicitudes de API.</li>
          <li><span>OAuth:</span> Protocolo de autorización abierto que permite a las aplicaciones obtener acceso limitado a recursos en un servidor HTTP.</li>
        </ul>
      </div>
      <div className='subnav-links'>
        <Link to={'/api/referencia-endpoints'} onClick={() => window.scrollTo(0, 0)}>Referencia de endpoints</Link>
        <Link to={'/api/contacto-soporte'} onClick={() => window.scrollTo(0, 0)}>Contacto y soporte</Link>
      </div>
    </>
  )
}

export default Recursos
