import React, { useState, useEffect } from 'react'
import './Manuales.css'
import dataSlider from './dataSlider'
import { Link, useSearchParams } from 'react-router-dom';
import PlantacionGuide from './PlantacionGuide';
import SelectionGuide from './SelectionGuide';
const guiaTitles = [
    ['CATÁLOGO DE', 'ESPECIES'],
    ['GUÍA DE', 'SELECCIÓN DE ESPECIES'],
    ['GUÍA DE', 'PLANTACIÓN'],
    
]

const guiaImages = [
    '/Imgs/catalogodeespecies.svg',
    '/Imgs/guiadeseleccion.svg',
    '/Imgs/guiadeplantacion.svg',
    
]


export default function Slider() {
    const [searchParams] = useSearchParams()
    const [showPlantacionGuide, setShowPlantacionGuide] = useState(false)
    const [showSelectionGuide, setShowSelectionGuide] = useState(false)

    // Cerrar modales cuando el usuario sale de la pestaña de guías
    useEffect(() => {
        const isOnCatalogo = searchParams.get('tab') === 'catalogo'
        if (isOnCatalogo) {
            setShowPlantacionGuide(false)
            setShowSelectionGuide(false)
        }
    }, [searchParams])

    // Listener adicional para cerrar al hacer clic fuera (ESC)
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setShowPlantacionGuide(false)
                setShowSelectionGuide(false)
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [])

    return (
        <>
            <section className='manuales-container'>
                {dataSlider.slice(0, 3).map((obj, index) => {
                    const content = (
                        <>
                            <div className='guia-content'>
                                <h2 className='guia-title'>
                                    {guiaTitles[index].map((line, lineIndex) => (
                                        <span key={`${obj.id}-${lineIndex}`}>
                                            {line}
                                            {lineIndex < guiaTitles[index].length - 1 ? <br /> : null}
                                        </span>
                                    ))}
                                </h2>
                            </div>

                            <div className='guia-visual' aria-label='Ilustracion de la guia'>
                                <img
                                    className='guia-visual-image'
                                    src={guiaImages[index]}
                                    alt={guiaTitles[index].join(' ')}
                                />
                            </div>
                        </>
                    )

                    if (index === 0 || index === 3) {
                        return (
                            <Link
                                to={'/aprende?tab=catalogo'}
                                key={obj.id}
                                className='guia-card guia-link'
                            >
                                {content}
                            </Link>
                        )
                    }

                    if (index === 1) {
                        return (
                            <button
                                type='button'
                                key={obj.id}
                                className='guia-card guia-button'
                                onClick={() => setShowSelectionGuide(true)}
                            >
                                {content}
                            </button>
                        )
                    }

                    if (index === 2) {
                        return (
                            <button
                                type='button'
                                key={obj.id}
                                className='guia-card guia-button'
                                onClick={() => setShowPlantacionGuide(true)}
                            >
                                {content}
                            </button>
                        )
                    }

                    return (
                        <article key={obj.id} className='guia-card'>
                            {content}
                        </article>
                    )
                })}
            </section>

            {showSelectionGuide ? (
                <SelectionGuide onClose={() => setShowSelectionGuide(false)} />
            ) : null}

            {showPlantacionGuide ? (
                <PlantacionGuide onClose={() => setShowPlantacionGuide(false)} />
            ) : null}
        </>
    )
}
