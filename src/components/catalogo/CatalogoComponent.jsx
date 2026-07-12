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
  )
}

export default CatalogoComponent

// export default function CatalogoComponent(){
//   return (
//     <div>
//       <Especies/>
//       <Manuales/>
//     </div>
//   )

// }