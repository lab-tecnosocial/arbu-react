import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './PlantacionGuide.css'
import { recommendSpecies, getCompatibilityLevel } from '../../../utils/speciesSelector'
import { especies as especiesFallback } from '../especiesData'
import { startLoadEspeciesCatalogo } from '../../../actions/catalogoActions'
import { LUGARES, OPCIONES_CABLES } from '../data/speciesPlantingProfiles'

export default function SelectionGuide({ onClose, isModal = true }) {
  const dispatch = useDispatch()
  const especiesCatalogo = useSelector((state) => state.catalogo.especies)
  const especies = especiesCatalogo?.length ? especiesCatalogo : especiesFallback

  const [lugar, setLugar] = useState('Calle')
  const [ancho, setAncho] = useState('')
  const [cables, setCables] = useState('No')
  const [results, setResults] = useState(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!especiesCatalogo?.length) {
      dispatch(startLoadEspeciesCatalogo())
    }
  }, [dispatch, especiesCatalogo?.length])

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

    const rec = recommendSpecies(especies, answers, { topN: 5, minScore: 3 })
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
            <p>Recomendaciones según el sitio de plantación y las {especies.length} especies del catálogo.</p>
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
              Calcular recomendación
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
            No encontramos especies adecuadas con esos criterios. Prueba ampliar el ancho disponible o cambiar el tipo de área.
          </p>
        ) : null}

        {results?.length ? (
          <div className='selection-guide-results'>
            <h4>Recomendaciones</h4>
            <aside className='selection-guide-score-help' aria-label='Explicación de compatibilidad'>
              <strong>¿Qué significa compatibilidad?</strong>
              <p>
                Es un puntaje calculado según tus respuestas: tipo de área, ancho disponible y cables aéreos.
                Cada especie suma o resta puntos según su perfil de plantación del catálogo ARBU.
              </p>
              <ul>
                <li><span>20+</span> Excelente</li>
                <li><span>15–19</span> Alta</li>
                <li><span>10–14</span> Media</li>
                <li><span>3–9</span> Baja</li>
              </ul>
              <p className='selection-guide-score-help-note'>
                Las especies están ordenadas de mayor a menor compatibilidad. Revisa también las advertencias de cada resultado.
              </p>
            </aside>
            <ol>
              {results.map((r) => {
                const compatibility = getCompatibilityLevel(r.score)

                return (
                <li key={r.especie.id || r.especie.nombreComun}>
                  <div className='selection-guide-card'>
                    <div className='selection-guide-rank'>{r.rank}</div>
                    <img
                      src={r.especie.imagenesUri?.[0]}
                      alt={r.especie.nombreComun}
                      className='selection-guide-image'
                    />
                    <div className='selection-guide-content'>
                      <div className='selection-guide-name'>
                        {r.especie.nombreComun || r.especie.nombreCientifico}
                      </div>
                      <div className='selection-guide-meta'>
                        <span className={`selection-guide-origin ${r.especie.origen === 'Nativa' ? 'nativa' : 'introducida'}`}>
                          {r.especie.origen}
                        </span>
                        <span
                          className={`selection-guide-score-label selection-guide-score-label--${compatibility.label.toLowerCase()}`}
                          title={compatibility.description}
                        >
                          Compatibilidad: {r.score} · {compatibility.label}
                        </span>
                      </div>
                      {r.reasons?.length ? (
                        <ul className='selection-guide-reasons'>
                          {r.reasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      ) : null}
                      {r.warnings?.length ? (
                        <ul className='selection-guide-warnings'>
                          {r.warnings.map((warning) => (
                            <li key={warning}>{warning}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </li>
                )
              })}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  )
}
