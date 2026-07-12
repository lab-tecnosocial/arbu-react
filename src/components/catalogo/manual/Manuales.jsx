<<<<<<< HEAD
import React, {useState} from 'react'
import './Manuales.css'
import BtnSlider from './BtnSlider'
import dataSlider from './dataSlider'
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


export default function Slider() {

    const [slideIndex, setSlideIndex] = useState(1)

    const nextSlide = () => {
        if(slideIndex !== dataSlider.length){
            setSlideIndex(slideIndex + 1)
        } 
        else if (slideIndex === dataSlider.length){
            setSlideIndex(1)
        }
    }

    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(dataSlider.length)
        }
    }

    const moveDot = index => {
        setSlideIndex(index)
    }

    return (
        <div className="container-slider">
            {dataSlider.map((obj, index) => {
                return (
                    <div
                    key={obj.id}
                    className={slideIndex === index + 1 ? "slide active-anim" : "slide"}
                    >
                    <img className='img-desktop'
                        src={`/Imgs/slides${index + 1}.png`} 
                        />
                    <img className='img-mobile'
                        src={`/Imgs/imgs mobile/slides${index + 1}.png`} 
                        />
                    </div>
                )
            })}
            
            <BtnSlider moveSlide={nextSlide} direction={"next"} />

            <BtnSlider moveSlide={prevSlide} direction={"prev"}/>

            <div className="container-dots">
                {Array.from({length: 9}).map((item, index) => (
                    <div 
                    key={`item-${index}`}
                    onClick={() => moveDot(index + 1)}
                    className={slideIndex === index + 1 ? "dot active" : "dot"}
                    ></div>
                ))}
            </div>
        </div>
=======
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
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
    )
}