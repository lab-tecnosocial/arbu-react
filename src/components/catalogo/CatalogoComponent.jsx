import React from 'react'
import Manuales from './manual/Manuales'

import './CatalogoComponent.css'
import Especies from './Especies'
import {useSelector} from 'react-redux';
import DetailEspecie from './DetailEspecie';
import Footer from '../footer/Footer';
import { useSearchParams } from 'react-router-dom';

const CatalogoComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'catalogo' ? 'catalogo' : 'guias';

  const handleTabChange = (tab) => {
    const nextParams = new URLSearchParams(searchParams);

    if (tab === 'catalogo') {
      nextParams.set('tab', 'catalogo');
    } else {
      nextParams.delete('tab');
    }

    // Keep URL and visible tab in sync to avoid stale navigation state.
    setSearchParams(nextParams, { replace: true });
  };
  const {activeEspecie} = useSelector(state=>state.catalogo);

    return (
      <main className={`catalogo-main ${activeTab === 'guias' ? 'catalogo-main--guias' : ''}`}>
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
        {activeTab === 'guias' ? <Manuales /> : <Especies />}
        <Footer />
      </main>
  )
}

export default CatalogoComponent