import { IconButton } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHideDetailEspecie } from "../../actions/catalogoActions";
import "./DetailEspecie.css";
import EmblaCarouselComponent from "./carrusel/EmblaCarousel";
import CloseIcon from '@mui/icons-material/Close';
const DetailEspecie = () => {
  const { activeEspecie } = useSelector((state) => state.catalogo);
  const dispatch = useDispatch();

  // const handleBack = () => {
  //   dispatch(setHideDetailEspecie());
  // };

  return (

    <div className={`detail-especie ${activeEspecie !== null && "active"}`}>

      

      <div className="detail-container-especie">
        <div className="detail-container-especie-secundary">
        {/* <div className="button-exit">
          <IconButton aria-label="back" onClick={handleBack}>
          <CloseIcon  sx={{color:'#174C44'}}/>
          </IconButton>
          </div> */}
          <div style={{ margin: "auto" }} >
            {/* <ImageDetail src={activeEspecie.imagenesUri[0]}/> */}
            {/* Aqui solo esta una imagen pero debe ser cambiada por un componente de slide de imagenes */}
            {/* <img src={activeEspecie.imagenesUri[0]} alt="" className='img-detail-especie' /> */}
            <EmblaCarouselComponent autoplay delayLength={4000}>
              {activeEspecie.imagenesUri.map((item) => (
            
                <img id="image"
                  key={item}
                  
                  src={item}
                  alt=""
                    style={{
                    borderRadius: "0.5rem",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    
                  }}
                  
                />
              ))}
            </EmblaCarouselComponent>
          </div>
        </div>

        <div className="scroll" >
      <div className="container-info">
              <h2 className="titleEspecie">
                &nbsp;
                {activeEspecie?.nombreComun}
              </h2>
            <div>
                <div className="nombreCientifico "  >
                  {activeEspecie?.nombreCientifico}
                </div>
                <div className='text-container'>
                <div className="text-normal " style={{fontStyle:'italic'}}>
                 Familia: {activeEspecie?.familia}
                </div>
                <div className="text-origen">
                  {activeEspecie?.origen}
                </div>
                </div>

            </div>
        </div>
       
        <div>  
            <div className="text-descripcion">
              {
                activeEspecie?.descripcion
              }
            </div>
            <div className="text-descripcion">
              {
                activeEspecie?.descripcion2
              }
            </div>
            <div className="text-recomendable">
              {
                activeEspecie?.recomendablePara
              }
            </div>
          </div>
      </div>

      </div>
      <span></span>
    </div>
  );
};

export default DetailEspecie;
