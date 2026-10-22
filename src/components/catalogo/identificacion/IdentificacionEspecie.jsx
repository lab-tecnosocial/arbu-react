import { useState } from 'react'
import ImageFilePicker from './ImageFilePicker'
import './IdentificacionEspecie.css'

const INSTRUCCIONES = [
  'Sube una foto de una hoja.',
  'Sube una foto del árbol completo.',
  'Referencia de escala: hoja ~30 cm; árbol ~4–5 m de alto.',
  'Toma las fotos en un día despejado, con buena luz.',
]

export default function IdentificacionEspecie() {
  const [fotoHoja, setFotoHoja] = useState(null)
  const [fotoArbol, setFotoArbol] = useState(null)

  return (
    <section className='id-especie' aria-labelledby='id-especie-title'>
      <div className='id-especie__card'>
        <header className='id-especie__header'>
          <h2 id='id-especie-title'>Identificación de especies</h2>
          <p>Prepara dos fotos siguiendo estas indicaciones. Luego podrás analizarlas con el modelo.</p>
        </header>

        <ol className='id-especie__instrucciones'>
          {INSTRUCCIONES.map((texto) => (
            <li key={texto}>{texto}</li>
          ))}
        </ol>

        <div className='id-especie__pickers'>
          <ImageFilePicker
            label='Foto de la hoja'
            hint='Una hoja clara, preferiblemente con una referencia de tamaño (~30 cm).'
            file={fotoHoja}
            onFileChange={setFotoHoja}
          />
          <ImageFilePicker
            label='Foto del árbol completo'
            hint='El árbol entero visible, a ~4–5 m de distancia si es posible.'
            file={fotoArbol}
            onFileChange={setFotoArbol}
          />
        </div>

        <p className='id-especie__fase-nota'>
          {fotoHoja && fotoArbol
            ? 'Ambas fotos están listas en este dispositivo. La subida y el análisis se habilitarán en la siguiente fase.'
            : 'Selecciona o suelta cada foto cuando la tengas.'}
        </p>
      </div>
    </section>
  )
}
