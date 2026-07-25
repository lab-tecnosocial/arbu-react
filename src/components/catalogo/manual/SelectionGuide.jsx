import React, { useState } from 'react'
import './PlantacionGuide.css'
import { recommendSpecies } from '../../../utils/speciesSelector'

// IMPORTAMOS EL JSON DIRECTAMENTE (Ajusta la ruta si lo guardaste en otra carpeta)
import especiesData from './especies.json'
import { LUGARES, OPCIONES_CABLES } from '../data/speciesPlantingProfiles'

export default function SelectionGuide({ onClose, isModal = true }) {
  // Extraemos el arreglo de especies del archivo JSON
  const especies = especiesData.especies;

  const [lugar, setLugar] = useState('Calle')
  const [ancho, setAncho] = useState('')
  const [cables, setCables] = useState('No')
  const [results, setResults] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleBackdropClick = (e) => {
    if (isModal && e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const answers = {
      lugar,
      ancho: ancho ? Number(ancho) : undefined,
      cables,
    }

    // Le pasamos nuestro arreglo de JSON a la función
    const rec = recommendSpecies(especies, answers, { topN: 5 })
    setResults(rec)
    setSearched(true)
  }

  return (
    <section
      className={`plantacion-guide ${isModal ? '' : 'plantacion-guide--page'}`.trim()}
      aria-label='Guía de selección de especies'
      onClick={handleBackdropClick}
    >
      <div
        className={`plantacion-step-card ${isModal ? '' : 'plantacion-step-card--page'}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='selection-guide-header'>
          <div>
            <h3>Guía de selección de especies</h3>
            <p>Recomendaciones exactas según el sitio de plantación.</p>
          </div>
          {onClose ? (
            <button type='button' className='plantacion-close' onClick={onClose} aria-label='Cerrar'>
              ✕
            </button>
          ) : null}
        </div>

        <form className='selection-guide-form' onSubmit={handleSubmit}>
          <label htmlFor='selection-lugar'>¿En qué tipo de área plantarás?</label>
          <select id='selection-lugar' value={lugar} onChange={(e) => setLugar(e.target.value)}>
            {LUGARES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <label htmlFor='selection-ancho'>Ancho disponible (metros, opcional)</label>
          <input
            id='selection-ancho'
            placeholder='Ej.: 2.5'
            type='number'
            min='0.5'
            step='0.1'
            value={ancho}
            onChange={(e) => setAncho(e.target.value)}
          />

          <label htmlFor='selection-cables'>¿Hay cables encima?</label>
          <select id='selection-cables' value={cables} onChange={(e) => setCables(e.target.value)}>
            {OPCIONES_CABLES.map((option) => (
              <option key={option} value={option}>
                {option === 'No' ? 'No' : option === 'Baja' ? 'Sí, cables de baja tensión' : 'Sí, cables de media tensión'}
              </option>
            ))}
          </select>

          <div className='selection-guide-actions'>
            <button className='selection-guide-primary' type='submit'>
              Buscar especie
            </button>
            {onClose ? (
              <button className='selection-guide-secondary' type='button' onClick={onClose}>
                Cerrar
              </button>
            ) : null}
          </div>
        </form>

        {searched && results?.length === 0 ? (
          <p className='selection-guide-empty'>
            No encontramos ninguna especie que cumpla con todos los criterios exactos. Prueba ampliar el ancho disponible o cambiar el tipo de área.
          </p>
        ) : null}

        {results?.length ? (
          <div className='selection-guide-results'>
            <h4>Resultados Compatibles</h4>
            <ol>
              {results.map((r) => (
                <li key={r.especie.cod || r.especie.nombreComun}>
                  <div className='selection-guide-card'>
                    <div className='selection-guide-rank'>{r.rank}</div>
                    <img
                      src={r.especie.img}
                      alt={r.especie.nombreComun}
                      className='selection-guide-image'
                    />
                    <div className='selection-guide-content'>
                      <div className='selection-guide-name'>
                        {r.especie.nombreComun}
                      </div>
                      <div className='selection-guide-meta'>
                        <span className={`selection-guide-origin ${r.especie.origen === 'nativa' ? 'nativa' : 'introducida'}`}>
                          {r.especie.origen}
                        </span>
                        <span className="selection-guide-score-label" style={{marginLeft: '10px', color: '#2e7d32'}}>
                          ✓ Cumple requisitos
                        </span>
                      </div>
                      <ul className='selection-guide-reasons' style={{marginTop: '10px', fontSize: '14px', color: '#555'}}>
                        <li><strong>Tamaño:</strong> {r.especie.tamanoArbol} ({r.especie.dimJardinera2}m requeridos)</li>
                        <li><strong>Cables:</strong> {r.especie.cablesElectricidad}</li>
                        <li><strong>Deciduosidad:</strong> {r.especie.deciduosidad}</li>
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  )
}