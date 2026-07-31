import React, { useEffect } from 'react'

function formatOrigen(origen = '') {
  const value = String(origen).toLowerCase()
  if (value === 'nativa') return 'Nativa'
  if (value === 'exótica' || value === 'exotica') return 'Exótica'
  return origen
}

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null

  return (
    <div className='selection-species-modal-row'>
      <span className='selection-species-modal-label'>{label}</span>
      <span className='selection-species-modal-value'>{value}</span>
    </div>
  )
}

export default function SelectionSpeciesModal({ especie, onClose }) {
  useEffect(() => {
    if (!especie) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [especie, onClose])

  if (!especie) return null

  const origen = formatOrigen(especie.origen)
  const isNativa = origen === 'Nativa'

  return (
    <div
      className='selection-species-modal-backdrop'
      role='presentation'
      onClick={onClose}
    >
      <article
        className='selection-species-modal'
        role='dialog'
        aria-modal='true'
        aria-labelledby='selection-species-modal-title'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          className='selection-species-modal-close'
          onClick={onClose}
          aria-label='Cerrar detalle'
        >
          ✕
        </button>

        <div className='selection-species-modal-hero'>
          <img src={especie.img} alt={especie.nombreComun} />
        </div>

        <div className='selection-species-modal-body'>
          <header className='selection-species-modal-header'>
            <h3 id='selection-species-modal-title'>{especie.nombreComun}</h3>
            {especie.nombreCientifico ? (
              <p className='selection-species-modal-scientific'>{especie.nombreCientifico}</p>
            ) : null}
            <div className='selection-species-modal-badges'>
              <span className={`selection-guide-origin ${isNativa ? 'nativa' : 'introducida'}`}>
                {origen}
              </span>
              {especie.grupo ? <span className='selection-species-modal-chip'>{especie.grupo}</span> : null}
            </div>
          </header>

          <section className='selection-species-modal-section'>
            <h4>Plantación</h4>
            <DetailRow label='Tamaño' value={especie.tamanoArbol} />
            <DetailRow label='Espacio requerido' value={especie.dimJardinera1 ? `${especie.dimJardinera1} m` : `${especie.dimJardinera2} m`} />
            <DetailRow label='Áreas recomendadas' value={especie.tipoArea} />
            <DetailRow label='Cables eléctricos' value={especie.cablesElectricidad} />
            <DetailRow label='Deciduosidad' value={especie.deciduosidad} />
          </section>

          <section className='selection-species-modal-section'>
            <h4>Características</h4>
            <DetailRow label='Familia' value={especie.familia} />
            <DetailRow label='Tolerancia al estrés' value={especie.toleranciaEstres} />
            <DetailRow label='Flor llamativa' value={especie.extravaganciaFlor} />
            <DetailRow label='ANMI' value={especie.anmi} />
          </section>

          {(especie.alturaMaxPlanta || especie.diametroCopa || especie.extensionRaiz) ? (
            <section className='selection-species-modal-section'>
              <h4>Medidas registradas</h4>
              <DetailRow label='Altura máxima' value={especie.alturaMaxPlanta ? `${especie.alturaMaxPlanta} m` : null} />
              <DetailRow label='Diámetro de copa' value={especie.diametroCopa ? `${especie.diametroCopa} m` : null} />
              <DetailRow label='Extensión de raíz' value={especie.extensionRaiz ? `${especie.extensionRaiz} m` : null} />
            </section>
          ) : null}
        </div>
      </article>
    </div>
  )
}
