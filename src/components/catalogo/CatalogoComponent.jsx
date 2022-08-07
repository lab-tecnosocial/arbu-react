import React from 'react'
import Manuales from './manual/Manuales'

import './CatalogoComponent.css'
import Especies from './Especies'
import {useSelector} from 'react-redux';
import DetailEspecie from './DetailEspecie';

const CatalogoComponent = () => {
  const {activeEspecie} = useSelector(state=>state.catalogo);
  return (
        <main style={{ padding: "1rem 0" }}>
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