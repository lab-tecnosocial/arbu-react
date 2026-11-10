import React from 'react'
import './Manuales.css'
import { Link } from 'react-router-dom'

const GUIAS = [
  {
    id: 'catalogo',
    titles: ['CATÁLOGO DE', 'ESPECIES'],
    image: '/Imgs/catalogodeespecies.svg',
    tab: 'catalogo',
  },
  {
    id: 'guia-seleccion',
    titles: ['GUÍA DE', 'SELECCIÓN DE ESPECIES'],
    image: '/Imgs/guiadeseleccion.svg',
    tab: 'guia-seleccion',
  },
  {
    id: 'guia-plantacion',
    titles: ['GUÍA DE', 'PLANTACIÓN'],
    image: '/Imgs/guiadeplantacion.svg',
    tab: 'guia-plantacion',
  },
  {
    id: 'identificacion-especies',
    titles: ['IDENTIFICACIÓN', 'DE ESPECIES'],
    image: '/Imgs/idespecie.svg',
    tab: 'identificacion-especies',
  },
]

export default function Slider() {
  return (
    <section className='manuales-container'>
      {GUIAS.map((guia) => (
        <Link
          key={guia.id}
          to={`/aprende?tab=${guia.tab}`}
          className='guia-card guia-link'
        >
          <div className='guia-content'>
            <h2 className='guia-title'>
              {guia.titles.map((line, lineIndex) => (
                <span key={`${guia.id}-${lineIndex}`}>
                  {line}
                  {lineIndex < guia.titles.length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
          </div>

          <div className='guia-visual' aria-label='Ilustracion de la guia'>
            <img className='guia-visual-image' src={guia.image} alt={guia.titles.join(' ')} />
          </div>
        </Link>
      ))}
    </section>
  )
}
