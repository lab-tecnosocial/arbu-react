import React, { useMemo, useState, useEffect } from 'react'
import './PlantacionGuide.css'

const plantacionSteps = [
  {
    number: 1,
    text: 'Antes de plantar, debes verificar que no existan tuberias de gas, agua o alcantarillado cerca al hoyo que vas a realizar la plantacion.',
  },
  {
    number: 2,
    text: 'Haz un buen hoyo. 50 cm de profundidad es lo minimo y 50 cm de ancho.',
  },
  {
    number: 3,
    text: 'Mejora el suelo: mezcla la tierra que has excavado con tierra vegetal en la misma proporcion para darle nutrientes a la planta. No te olvides de quitar las piedras muy grandes.',
  },
  {
    number: 4,
    text: 'Llena el hoyo dejando un espacio, coloca la planta correctamente, extrayendo la bolsa con cuidado para no romper el terron de tierra. Deja el tallo recto y el cuello de raiz visible.',
  },
  {
    number: 5,
    text: 'Riega lo suficiente hasta que el suelo absorba por completo el agua.',
  },
  {
    number: 6,
    text: 'Coloca una varilla de madera (tutor) para corregir y estabilizar el tallo de la planta. Amarralo con una cuerda o tira de goma delgada y deja una ligera flexibilidad.',
  },
  {
    number: 7,
    text: 'Por ultimo, coloca un protector a la planta. Puede ser una malla.',
  },
  {
    number: 8,
    text: 'Verifica el resultado: el arbol debe quedar protegido, firme y con espacio para crecer.',
  },
  {
    number: 9,
    text: 'No te olvides de llevar adelante tu plan de riego. Gracias por pensar en los arboles.',
  },
]

export default function PlantacionGuide({ onClose }) {
  const [stepIndex, setStepIndex] = useState(0)

  const totalSteps = plantacionSteps.length
  const step = useMemo(() => plantacionSteps[stepIndex], [stepIndex])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  // image files expected in public/Imgs named plantacion-step-1..9.png (or .jpg)
  // prefer images named consejo1..consejo9, fallback to plantacion-step-{n}
  const imageCandidatesFor = (i) => [
    `/Imgs/consejo${i + 1}.png`,
    `/Imgs/consejo${i + 1}.jpg`,
    `/Imgs/consejo${i + 1}.webp`,
    `/Imgs/plantacion-step-${i + 1}.png`,
    `/Imgs/plantacion-step-${i + 1}.jpg`,
    `/Imgs/plantacion-step-${i + 1}.webp`,
  ]

  function StepImage({ index }) {
    const candidates = imageCandidatesFor(index)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
      setAttempt(0)
    }, [index])

    const src = candidates[attempt]
    if (!src) return null

    return (
      <img
        src={src}
        alt={`Paso ${plantacionSteps[index].number}`}
        className='plantacion-step-img'
        onError={(e) => {
          if (attempt < candidates.length - 1) setAttempt((a) => a + 1)
          else e.target.style.display = 'none'
        }}
      />
    )
  }

  // when opened, prevent body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const goPrev = () => {
    setStepIndex((current) => Math.max(0, current - 1))
  }

  const handlePrev = () => {
    if (stepIndex === 0) {
      setStepIndex(0)
      if (onClose) onClose()
    } else {
      goPrev()
    }
  }

  const goNext = () => {
    setStepIndex((current) => Math.min(totalSteps - 1, current + 1))
  }

  const finishFromNext = () => {
    // reset to first step and close
    setStepIndex(0)
    if (onClose) onClose()
  }

  return (
    <section className='plantacion-guide' aria-label='Consejos de plantacion' onClick={handleBackdropClick}>
      <article className='plantacion-step-card' onClick={(e) => e.stopPropagation()}>
        <div className='plantacion-guide-header'>
          <h3>Consejos de Plantacion</h3>
          <button type='button' className='plantacion-close' onClick={onClose} aria-label='Cerrar'>
            ✕
          </button>
        </div>

        <header className='plantacion-top'>
          <span className='plantacion-step-number'>{step.number}</span>
        </header>

        <div className='plantacion-step-visual'>
          <StepImage index={stepIndex} />

          <div className='plantacion-image-note'>
          </div>
        </div>

        <p className='plantacion-step-text'>{step.text}</p>

        <div className='plantacion-step-controls'>
          <button type='button' onClick={handlePrev}>
            Atrás
          </button>

          <div className='plantacion-step-dots' aria-hidden='true'>
            {plantacionSteps.map((item, index) => (
              <span
                key={item.number}
                className={`plantacion-dot ${index === stepIndex ? 'active' : ''}`}
              />
            ))}
          </div>

          <button
            type='button'
            onClick={stepIndex === totalSteps - 1 ? finishFromNext : goNext}
          >
            {stepIndex === totalSteps - 1 ? 'Cerrar' : 'Siguiente'}
          </button>
        </div>
      </article>
    </section>
  )
}
