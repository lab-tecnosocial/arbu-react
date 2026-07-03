import React, { useState } from 'react'
import './PlantacionGuide.css'
import speciesSelector from '../../../utils/speciesSelector'
import { especies } from '../especiesData'

export default function SelectionGuide({ onClose, isModal = true }) {
  const [lugar, setLugar] = useState('Calle')
  const [ancho, setAncho] = useState('')
  const [cables, setCables] = useState('No')
  const [results, setResults] = useState(null)

  const handleBackdropClick = (e) => {
    if (isModal && e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  const lugares = [
    'Calle',
    'Parque',
    'Plazuela',
    'Rotonda',
    'Jardín privado',
    'Plaza',
    'Bosque urbano',
    'Corredor biológico',
    'Hacienda privada',
  ]

  function handleSubmit(e) {
    e.preventDefault()
    const answers = { lugar, ancho: ancho ? Number(ancho) : undefined, cables }
    const rec = speciesSelector.recommendSpecies(especies, answers, { topN: 5 })
    setResults(rec)
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
            <p>Recomendaciones ordenadas por puntaje</p>
          </div>
          {onClose ? <button className='plantacion-close' onClick={onClose}>✕</button> : null}
        </div>

        <form className='selection-guide-form' onSubmit={handleSubmit}>
          <label>¿En qué tipo de área plantarás?</label>
          <select value={lugar} onChange={(e) => setLugar(e.target.value)}>
            {lugares.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>

          <label>Ancho disponible (metros, opcional)</label>
          <input placeholder='Valor en metros' type='number' value={ancho} onChange={(e) => setAncho(e.target.value)} />

          <label>¿Hay cables encima?</label>
          <select value={cables} onChange={(e) => setCables(e.target.value)}>
            <option value='No'>No</option>
            <option value='Baja'>Sí, cables de baja tensión</option>
            <option value='Media'>Sí, cables de media tensión</option>
          </select>

          <div className='selection-guide-actions'>
            <button className='selection-guide-primary' type='submit'>Calcular recomendación</button>
            {onClose ? <button className='selection-guide-secondary' type='button' onClick={onClose}>Cerrar</button> : null}
          </div>
        </form>

        {results ? (
          <div className='selection-guide-results'>
            <h4>Recomendaciones</h4>
            <ol>
              {results.map((r) => (
                <li key={r.especie.id}>
                  <div className='selection-guide-card'>
                    <div className='selection-guide-rank'>{r.rank}</div>
                    <img src={r.especie.imagenesUri?.[0]} alt={r.especie.nombreComun} className='selection-guide-image' />
                    <div className='selection-guide-content'>
                      <div className='selection-guide-name'>{r.especie.nombreComun || r.especie.nombreCientifico}</div>
                      <div className='selection-guide-description'>{r.especie.descripcion2}</div>
                    </div>
                    <div className='selection-guide-score'>
                      <span>{r.score}</span>
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
