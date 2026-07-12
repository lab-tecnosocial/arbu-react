import React from 'react'
import { Popup } from 'react-leaflet'
import { usuarios as users } from './usuarios';
const PopupMarker = (({arbol={},usuarios,arrayUsers,setArbolDetail}) => {
  
  // console.log(usuarios);

  const getNameUser = (id) => {
    for (const [key, value] of arrayUsers) {
      if ( value.id === id) {
        const n = value.nombre;
        const firstWordFromName = n.split(' ')[0];
       return firstWordFromName;
      }
    }
  }
  const handleClickVerMas = (arbol) => {
    setArbolDetail(arbol)
  }
  return (
    <Popup>
    <img
      src={Object.values(arbol.monitoreos).pop().fotografia}
      alt={arbol.nombrePropio}
      width="250px"
      height="200px"
      style={{ objectFit: "cover",borderRadius:'5px'}}
    />
    <br />
    <span style={{fontWeight:'bold',fontSize:'16px'}}>{arbol.nombrePropio} </span><br />
    {arbol.nombreComun}
    <br />
    Adoptado por: {
    usuarios.map((stringIdUser,i) => <span key={stringIdUser}>{getNameUser(stringIdUser)}{(i<(usuarios.length-1)) && `, `}</span>)
    }<br />
    <div className='hover' style={{fontWeight:'bolder',display:'flex',justifyContent:'center'}} onClick={()=>handleClickVerMas(arbol)}>
      <span >Ver detalle</span>
    </div>
  </Popup>
  )
})

export default PopupMarker