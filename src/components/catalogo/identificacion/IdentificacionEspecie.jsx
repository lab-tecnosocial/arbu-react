import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveEspecie } from '../../../actions/catalogoActions'
import ImageFilePicker from './ImageFilePicker'
import {
  MODELOS_IDENTIFICACION,
  identificarEspecie,
  liberarMotorIdentificacion,
  modeloIdentificacionEnCache,
} from './motorIdentificacion'
import './IdentificacionEspecie.css'

const TIPOS_FOTO = {
  hoja: {
    value: 'hoja',
    label: 'Hoja',
    hint: 'Una hoja clara, preferiblemente con una referencia de tamaño (~30 cm).',
  },
  arbol: {
    value: 'arbol',
    label: 'Árbol completo',
    hint: 'El árbol entero visible, a ~4–5 m de distancia si es posible.',
  },
}

const INSTRUCCIONES = [
  'Elige si la foto es de una hoja o del árbol completo.',
  'Sube una foto según esa elección.',
  'Referencia de escala: hoja ~30 cm; árbol ~4–5 m de alto.',
  'Toma las fotos en un día despejado, con buena luz.',
]

const UMBRAL_CONFIANZA_BAJA = 0.35

export default function IdentificacionEspecie() {
  const dispatch = useDispatch()
  const { especies } = useSelector((state) => state.catalogo)
  const [tipoFoto, setTipoFoto] = useState(TIPOS_FOTO.hoja.value)
  const [foto, setFoto] = useState(null)
  const [analizando, setAnalizando] = useState(false)
  const [descargandoModelo, setDescargandoModelo] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [error, setError] = useState(null)
  const tipoActual = TIPOS_FOTO[tipoFoto] ?? TIPOS_FOTO.hoja
  const clasesModelo = MODELOS_IDENTIFICACION[tipoFoto]?.clases ?? 0

  useEffect(() => () => liberarMotorIdentificacion(), [])

  const handleTipoChange = (siguienteTipo) => {
    setTipoFoto(siguienteTipo)
    setFoto(null)
    setResultados(null)
    setError(null)
  }

  const handleFotoChange = (archivo) => {
    setFoto(archivo)
    setResultados(null)
    setError(null)
  }

  const handleIdentificar = async () => {
    if (!foto || analizando) return
    setAnalizando(true)
    setDescargandoModelo(!modeloIdentificacionEnCache(tipoFoto))
    setError(null)
    try {
      const predicciones = await identificarEspecie(tipoFoto, foto, especies, (estado) => {
        setDescargandoModelo(estado === 'descargando')
      })
      setResultados(predicciones)
    } catch (err) {
      console.error(err)
      setResultados(null)
      setError(err?.message || 'No se pudo analizar la foto. Prueba de nuevo o usa Chrome.')
    } finally {
      setAnalizando(false)
      setDescargandoModelo(false)
    }
  }

  const confianzaBaja = resultados?.[0] && resultados[0].score < UMBRAL_CONFIANZA_BAJA

  return (
    <section className='id-especie' aria-labelledby='id-especie-title'>
      <div className='id-especie__card'>
        <header className='id-especie__header'>
          <h2 id='id-especie-title'>Identificación de especies</h2>
          <p>
            Elige el tipo de foto y súbela. El análisis corre en tu dispositivo con el modelo
            entrenado para {clasesModelo} especies de {tipoActual.label.toLowerCase()}.
          </p>
        </header>

        <ol className='id-especie__instrucciones'>
          {INSTRUCCIONES.map((texto) => (
            <li key={texto}>{texto}</li>
          ))}
        </ol>

        <div className='id-especie__upload'>
          <label className='id-especie__tipo-label' htmlFor='id-especie-tipo'>
            Tipo de imagen
          </label>
          <select
            id='id-especie-tipo'
            className='id-especie__tipo'
            value={tipoFoto}
            disabled={analizando}
            onChange={(e) => handleTipoChange(e.target.value)}
          >
            {Object.values(TIPOS_FOTO).map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>

          <ImageFilePicker
            label={`Foto: ${tipoActual.label.toLowerCase()}`}
            hint={tipoActual.hint}
            file={foto}
            disabled={analizando}
            onFileChange={handleFotoChange}
          />
        </div>

        <div className='id-especie__acciones'>
          <button
            type='button'
            className='id-especie__identificar'
            disabled={!foto || analizando}
            aria-live='polite'
            onClick={handleIdentificar}
          >
            {descargandoModelo
              ? 'Descargando modelo…'
              : analizando
                ? 'Analizando…'
                : 'Identificar especie'}
          </button>
        </div>

        {error ? (
          <p className='id-especie__error' role='alert'>
            {error}
          </p>
        ) : null}

        {resultados ? (
          <div className='id-especie__resultados'>
            <h3>Resultados</h3>
            {resultados.length === 0 ? (
              <p>El modelo no devolvió una coincidencia. Prueba con otra foto o cambia el tipo de imagen.</p>
            ) : (
              <>
                {confianzaBaja ? (
                  <p className='id-especie__aviso'>
                    La confianza es baja: puede no ser una de las especies que este modelo reconoce.
                  </p>
                ) : null}
                <ol className='id-especie__lista'>
                  {resultados.map((item) => (
                    <li key={`${item.etiqueta}-${item.score}`}>
                      <div className='id-especie__prediccion'>
                        <strong>{item.nombre}</strong>
                        <span>{Math.round(item.score * 100)}%</span>
                      </div>
                      <div
                        className='id-especie__barra'
                        style={{ '--confianza': `${Math.round(item.score * 100)}%` }}
                      />
                      {item.especie ? (
                        <button
                          type='button'
                          className='id-especie__ficha'
                          onClick={() => dispatch(setActiveEspecie(item.especie))}
                        >
                          Ver ficha del catálogo
                        </button>
                      ) : (
                        <p className='id-especie__sin-ficha'>Sin ficha en el catálogo de Aprende.</p>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        ) : (
          <p className='id-especie__fase-nota'>
            {foto
              ? 'La foto está lista. Pulsa identificar para analizarla en este dispositivo (aún no se sube).'
              : 'Selecciona el tipo de imagen y luego elige o suelta el archivo.'}
          </p>
        )}
      </div>
    </section>
  )
}
