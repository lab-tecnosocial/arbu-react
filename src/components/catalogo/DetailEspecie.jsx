import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHideDetailEspecie } from "../../actions/catalogoActions";
import "./DetailEspecie.css";
import EmblaCarouselComponent from "./carrusel/EmblaCarousel";
import CloseIcon from '@mui/icons-material/Close';

const DetailEspecie = () => {
  const { activeEspecie } = useSelector((state) => state.catalogo);
  const dispatch = useDispatch();
  const mostradaRef = useRef(null);
  if (activeEspecie) mostradaRef.current = activeEspecie;
  const especie = activeEspecie ?? mostradaRef.current;
  const abierto = Boolean(activeEspecie);

  const handleClose = () => {
    dispatch(setHideDetailEspecie());
  };

  if (!especie) return null;

  return (
    <div className={`detail-especie${abierto ? " active" : ""}`}>
      <div className="detail-container-especie">
        <div className="detail-container-especie-secundary">
          <button
            type="button"
            className="detail-especie-close"
            onClick={handleClose}
            aria-label="Cerrar detalle de especie"
          >
            <CloseIcon sx={{ color: 'inherit' }} />
          </button>
          <div style={{ margin: "auto" }} >
            <EmblaCarouselComponent autoplay delayLength={4000}>
              {(especie.imagenesUri ?? []).map((item) => (
                <img
                  id="image"
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
                {especie?.nombreComun}
              </h2>
            <div>
                <div className="nombreCientifico "  >
                  {especie?.nombreCientifico}
                </div>
                <div className='text-container'>
                <div className="text-normal " style={{fontStyle:'italic'}}>
                 Familia: {especie?.familia}
                </div>
                <div className="text-origen">

                  {especie?.origen === 'Nativa' ?
            
               <span style={{backgroundColor:'#03b25e'}}>
                 {especie?.origen}
                </span>
               : 
                <span >
                  {especie?.origen}
                  </span>
               }
                </div>
                </div>

            </div>
        </div>
       
        <div>  
            <div className="text-descripcion">
              {
                especie?.descripcion
              }
            </div>
            <div className="text-descripcion">
              {
                especie?.descripcion2
              }
            </div>
            <div className="text-recomendable">
              {
                especie?.recomendablePara
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
