import React from 'react'
import Manuales from './Manuales'
import Especies from './Especies'
import './CatalogoComponent.css'

const CatalogoComponent = () => {
  return (
        <main style={{ padding: "1rem 0" }}>
          <h2>CatalogoComponent</h2>
          <Especies/>
          <Manuales/>
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