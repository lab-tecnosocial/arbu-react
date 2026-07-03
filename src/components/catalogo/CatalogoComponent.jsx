import React from 'react'
import Manuales from './manual/Manuales'

import './CatalogoComponent.css'
import Especies from './Especies'
import {useSelector} from 'react-redux';
import DetailEspecie from './DetailEspecie';
import Footer from '../footer/Footer';
import { useSearchParams } from 'react-router-dom';
import SelectionGuide from './manual/SelectionGuide';
import PlantacionGuide from './manual/PlantacionGuide';

const CatalogoComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const activeTab = ['catalogo', 'guia-seleccion', 'guia-plantacion'].includes(tab) ? tab : 'guias';

  const handleTabChange = (tab) => {
    const nextParams = new URLSearchParams(searchParams);

    if (tab === 'catalogo' || tab === 'guia-seleccion' || tab === 'guia-plantacion') {
      nextParams.set('tab', tab);
    } else {
      nextParams.delete('tab');
    }

    // Keep URL and visible tab in sync to avoid stale navigation state.
    setSearchParams(nextParams, { replace: true });
  };

  const renderContent = () => {
    if (activeTab === 'catalogo') return <Especies />;
    if (activeTab === 'guia-seleccion') return <SelectionGuide isModal={false} onClose={() => handleTabChange('guias')} />;
    if (activeTab === 'guia-plantacion') return <PlantacionGuide isModal={false} onClose={() => handleTabChange('guias')} />;
    return <Manuales />;
  };

  const {activeEspecie} = useSelector(state=>state.catalogo);

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
        {renderContent()}
        <Footer />
      </main>
  )
}

export default CatalogoComponent