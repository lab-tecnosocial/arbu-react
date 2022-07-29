import React from 'react'
import Manuales from './manual/Manuales'

import './CatalogoComponent.css'
import Especies from './Especies'

const CatalogoComponent = () => {
  return (
        <main style={{ padding: "1rem 0" }}>
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