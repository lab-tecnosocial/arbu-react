// export default function Manuales(){
//     <div>
//         <h1>Manuales</h1>
//     </div>
// }
const style = {
    alignItems: 'center',
    placeItems: 'center'
}
const bottom = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '24px',
}
const img = {
    width: '70px',
    height: '70px',
    borderRadius: '10px'
}

const Manuales = () => {

    return (
      <main style={style}>
        <div className = "bottom" style={bottom}>
            <p>manuales</p>
            <figure >
                <img  style ={img} 
                src="https://us.123rf.com/450wm/alazur/alazur1907/alazur190700001/127906637-silueta-de-un-%C3%A1rbol-con-ra%C3%ADces-y-hojas-en-c%C3%ADrculo-color-blanco-sobre-fondo-verde-logotipo-de-ilustra.jpg?ver=6" alt="" />
            </figure>
        </div>
 
      </main>
    )
  }
  
  export default Manuales