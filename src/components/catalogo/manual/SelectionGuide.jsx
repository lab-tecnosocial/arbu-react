import React, { useState } from 'react'
import './PlantacionGuide.css'
import { recommendSpecies } from '../../../utils/speciesSelector'
import especiesData from './especies.json'
import { LUGARES, OPCIONES_CABLES } from '../data/speciesPlantingProfiles'
import SelectionSpeciesModal from './SelectionSpeciesModal'

function formatOrigen(origen = '') {
  const value = String(origen).toLowerCase()
  if (value === 'nativa') return 'Nativa'
  if (value === 'exótica' || value === 'exotica') return 'Exótica'
  return origen
}

export default function SelectionGuide({ onClose, isModal = true }) {
  const especies = especiesData.especies

  const [lugar, setLugar] = useState('Calle')
  const [ancho, setAncho] = useState('')
  const [cables, setCables] = useState('No')
  const [results, setResults] = useState(null)
  const [searched, setSearched] = useState(false)
  const [selectedEspecie, setSelectedEspecie] = useState(null)

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

    const rec = recommendSpecies(especies, answers, { topN: 5 })
    setResults(rec)
    setSearched(true)
    setSelectedEspecie(null)
  }

  return (
    <>
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
              <h4>Resultados compatibles</h4>
              <p className='selection-guide-results-hint'>Toca una especie para ver el detalle completo.</p>
              <ol className='selection-guide-list'>
                {results.map((r) => {
                  const origen = formatOrigen(r.especie.origen)
                  const isNativa = origen === 'Nativa'

                  return (
                    <li key={r.especie.cod || r.especie.nombreComun}>
                      <button
                        type='button'
                        className='selection-guide-card'
                        onClick={() => setSelectedEspecie(r.especie)}
                      >
                        <div className='selection-guide-card-media'>
                          <span className='selection-guide-rank'>{r.rank}</span>
                          <img
                            src={r.especie.img}
                            alt={r.especie.nombreComun}
                            className='selection-guide-image'
                          />
                        </div>

                        <div className='selection-guide-content'>
                          <div className='selection-guide-name'>{r.especie.nombreComun}</div>
                          <div className='selection-guide-meta'>
                            <span className={`selection-guide-origin ${isNativa ? 'nativa' : 'introducida'}`}>
                              {origen}
                            </span>
                            <span className='selection-guide-score-label selection-guide-score-label--match'>
                              Cumple requisitos
                            </span>
                          </div>
                          <p className='selection-guide-summary'>
                            {r.especie.tamanoArbol} · {r.especie.dimJardinera2} m · {r.especie.cablesElectricidad}
                          </p>
                          <span className='selection-guide-card-cta'>Ver detalle</span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          ) : null}
        </div>
      </section>

      <SelectionSpeciesModal
        especie={selectedEspecie}
        onClose={() => setSelectedEspecie(null)}
      />
    </>
  )
}
