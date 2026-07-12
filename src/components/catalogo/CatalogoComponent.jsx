<<<<<<< HEAD
import React from 'react'
import Manuales from './manual/Manuales'

import './CatalogoComponent.css'
import Especies from './Especies'
import {useSelector} from 'react-redux';
import DetailEspecie from './DetailEspecie';
import Footer from '../footer/Footer';

const CatalogoComponent = () => {
  const {activeEspecie} = useSelector(state=>state.catalogo);
  return (
        <main>
          {
        activeEspecie ?
        (
          <DetailEspecie />
        )
        :
        (
          <span></span>
        )
        }
          <Manuales />
          <Especies />
          <Footer />
        </main>
=======
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Manuales from './manual/Manuales'
import './CatalogoComponent.css'
import Especies from './Especies'
import DetailEspecie from './DetailEspecie'
import Footer from '../footer/Footer'
import SelectionGuide from './manual/SelectionGuide'
import PlantacionGuide from './manual/PlantacionGuide'
import { startLoadEspeciesCatalogo } from '../../actions/catalogoActions'

const CatalogoComponent = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const activeTab = ['catalogo', 'guia-seleccion', 'guia-plantacion'].includes(tab) ? tab : 'guias'
  const { activeEspecie } = useSelector((state) => state.catalogo)

  useEffect(() => {
    dispatch(startLoadEspeciesCatalogo())
  }, [dispatch])

  const handleTabChange = (nextTab) => {
    const nextParams = new URLSearchParams(searchParams)

    if (nextTab === 'catalogo' || nextTab === 'guia-seleccion' || nextTab === 'guia-plantacion') {
      nextParams.set('tab', nextTab)
    } else {
      nextParams.delete('tab')
    }

    setSearchParams(nextParams, { replace: true })
  }

  const renderContent = () => {
    if (activeTab === 'catalogo') return <Especies />
    if (activeTab === 'guia-seleccion') {
      return <SelectionGuide isModal={false} onClose={() => handleTabChange('guias')} />
    }
    if (activeTab === 'guia-plantacion') {
      return <PlantacionGuide isModal={false} onClose={() => handleTabChange('guias')} />
    }
    return <Manuales />
  }

  return (
    <main className={`catalogo-main ${activeTab !== 'catalogo' ? 'catalogo-main--guias' : ''}`}>
      {activeTab !== 'guias' ? (
        <section className='catalogo-backbar'>
          <button
            type='button'
            className='catalogo-back-button'
            onClick={() => handleTabChange('guias')}
          >
            Atras
          </button>
        </section>
      ) : null}
      {activeEspecie ? <DetailEspecie /> : <span></span>}
      {renderContent()}
      <Footer />
    </main>
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
  )
}

export default CatalogoComponent
<<<<<<< HEAD

// export default function CatalogoComponent(){
//   return (
//     <div>
//       <Especies/>
//       <Manuales/>
//     </div>
//   )

// }
=======
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
