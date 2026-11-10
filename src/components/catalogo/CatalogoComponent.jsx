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
import IdentificacionEspecie from './identificacion/IdentificacionEspecie'
import { startLoadEspeciesCatalogo } from '../../actions/catalogoActions'
import { APRENDE_NIGHT_MODE_CLASS } from './aprendeTheme.config'
import { useTheme } from '../../context/ThemeContext'
import './aprende-theme.css'
import {
  trackVerCatalogoEspecies,
  trackVerGuiaPlantacion,
  trackVerGuiaSeleccion,
} from '../../analytics/arbuAnalytics'

const CatalogoComponent = () => {
  const dispatch = useDispatch()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const activeTab = ['catalogo', 'guia-seleccion', 'guia-plantacion', 'identificacion-especies'].includes(tab)
    ? tab
    : 'guias'
  const { activeEspecie } = useSelector((state) => state.catalogo)

  useEffect(() => {
    dispatch(startLoadEspeciesCatalogo())
  }, [dispatch])

  useEffect(() => {
    if (activeTab === 'catalogo') trackVerCatalogoEspecies('aprende')
    if (activeTab === 'guia-seleccion') trackVerGuiaSeleccion('aprende')
    if (activeTab === 'guia-plantacion') trackVerGuiaPlantacion('aprende')
  }, [activeTab])

  const handleTabChange = (nextTab) => {
    const nextParams = new URLSearchParams(searchParams)

    if (
      nextTab === 'catalogo' ||
      nextTab === 'guia-seleccion' ||
      nextTab === 'guia-plantacion' ||
      nextTab === 'identificacion-especies'
    ) {
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
    if (activeTab === 'identificacion-especies') {
      return <IdentificacionEspecie />
    }
    return <Manuales />
  }

  return (
    <main
      className={[
        'catalogo-main',
        activeTab !== 'catalogo' ? 'catalogo-main--guias' : '',
        isDark ? APRENDE_NIGHT_MODE_CLASS : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
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
  )
}

export default CatalogoComponent