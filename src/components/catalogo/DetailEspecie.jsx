import { IconButton } from '@mui/material';
import React from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { setHideDetailEspecie } from '../../actions/catalogoActions';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ImageDetail from '../mapa/ImageDetail';
import './DetailEspecie.css'
const DetailEspecie = () => {
  const {activeEspecie} = useSelector(state=>state.catalogo);
  const dispatch = useDispatch();

  const handleBack=() => {
    dispatch(setHideDetailEspecie());
  }
  return (
    // <div>DetailEspecie

    //   <button onClick={handleBack}>Atras</button>
    // </div>
    <div className={`detail-arbol ${activeEspecie !== null && "active"}`} id="detail">
      <IconButton aria-label="back" onClick={handleBack}>
      <ArrowBackIosNewIcon  sx={{color:'#000'}}/>
      </IconButton>
      {/* {monitoreos.length > 0 
        && (
          <ImageDetail src={monitoreos[0]?.fotografia} />
        )
      } */}
      
      <div className="detail-container-especie">
        <div className="detail-container-especie-secundary">
          <div style={{marginTop:'auto',marginBottom:'auto'}}>
              <ImageDetail src={activeEspecie.imagenesUri[0]}/>
          </div>
              <div>
              <h2 className="titles">
                &nbsp;
                {activeEspecie?.nombreComun}
              </h2>
            <div>
                <div className="text-normal" >
                  {activeEspecie?.nombreCientifico}
                </div>
                <div className="text-normal" style={{fontStyle:'italic'}}>
                  {activeEspecie?.familia}
                </div>
                <div className="text-normal">
                  {activeEspecie?.origen}
              </div>
            </div>
          </div>
          
        </div>

       
        <div>  
            <div className="text-normal">
              {
                activeEspecie?.descripcion
              }
            </div>
            <div className="text-normal">
              {
                activeEspecie?.descripcion2
              }
            </div>
            <div className="text-normal">
              {
                activeEspecie?.recomendablePara
              }
            </div>
          </div>
        
        
        <div></div>
      </div>
      
       
       
       
    </div>
  )
}

export default DetailEspecie