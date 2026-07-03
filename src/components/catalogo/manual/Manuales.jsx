import React from 'react'
import './Manuales.css'
import dataSlider from './dataSlider'
import { Link } from 'react-router-dom';
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
                            <Link
                                to='/aprende?tab=guia-seleccion'
                                key={obj.id}
                                className='guia-card guia-link'
                            >
                                {content}
                            </Link>
                        )
                    }

                    if (index === 2) {
                        return (
                            <Link
                                to='/aprende?tab=guia-plantacion'
                                key={obj.id}
                                className='guia-card guia-link'
                            >
                                {content}
                            </Link>
                        )
                    }

                    return (
                        <article key={obj.id} className='guia-card'>
                            {content}
                        </article>
                    )
                })}
            </section>
        </>
    )
}
