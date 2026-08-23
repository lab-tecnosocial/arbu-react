import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHideDetailEspecie } from "../../actions/catalogoActions";
import "./DetailEspecie.css";
import EmblaCarouselComponent from "./carrusel/EmblaCarousel";
import CloseIcon from '@mui/icons-material/Close';

const DetailEspecie = () => {
  const { activeEspecie } = useSelector((state) => state.catalogo);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setHideDetailEspecie());
  };

  if (!activeEspecie) return null;

  return (
    <div className={`detail-especie ${activeEspecie ? "active" : ""}`}>
      <div className="detail-container-especie">
        <div className="detail-container-especie-secundary">
          <button
            type="button"
            className="detail-especie-close"
            onClick={handleClose}
            aria-label="Cerrar detalle de especie"
          >
            <CloseIcon sx={{ color: '#174C44' }} />
          </button>
          <div style={{ margin: "auto" }} >
              {activeEspecie.imagenesUri && activeEspecie.imagenesUri.length > 0 ? (
                <EmblaCarouselComponent autoplay delayLength={4000}>
                  {activeEspecie.imagenesUri.map((item, idx) => (
                    <img
                      id="image"
                      key={item || idx}
                      src={item}
                      alt={activeEspecie?.nombreComun || `imagen-${idx}`}
                      style={{
                        borderRadius: "0.5rem",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </EmblaCarouselComponent>
              ) : (
                <div className="no-images" style={{padding:16}}>No hay imágenes disponibles</div>
              )}
          </div>
        </div>

        <div className="scroll" >
          <div className="container-info">
            <h2 className="titleEspecie">
              &nbsp;
              {activeEspecie?.nombreComun}
            </h2>
            <div>
              <div className="nombreCientifico " >
                {activeEspecie?.nombreCientifico}
              </div>
              <div className='text-container'>
                <div className="text-normal " style={{fontStyle:'italic'}}>
                  Familia: {activeEspecie?.familia}
                </div>
                <div className="text-origen">
                  {activeEspecie?.origen === 'Nativa' ? 
                    <span style={{backgroundColor:'#03b25e'}}>
                      {activeEspecie?.origen}
                    </span>
                    : 
                    <span >
                      {activeEspecie?.origen}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
         
          <div>
            {[activeEspecie?.descripcion, activeEspecie?.descripcion2]
              .filter(Boolean)
              .map((text, i) => (
                <div className="text-descripcion" key={i}>
                  {text}
                </div>
              ))}
            <div className="text-recomendable">{activeEspecie?.recomendablePara}</div>
          </div>
        </div>
      </div>
      <span></span>
    </div>
  );
};

export default DetailEspecie;