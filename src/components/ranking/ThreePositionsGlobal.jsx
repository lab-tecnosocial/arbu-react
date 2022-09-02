import React from "react";
import "./ThreePositions.css";
const ThreePositionsGlobal = ({ list3Best }) => {
  return (
    <div className="center">
      <div className="top-position-container">
      {list3Best.length > 0 && (
      <>
       <div className="second-place">
       {
            list3Best.length > 1 && (
              <>
          <div className="label-position-second"><strong>2</strong></div>
          <img
            src={list3Best[1]?.foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user img-user-second"
          />

          <div className="puntos">
            <span>{list3Best[1]?.puntos}</span><span style={{fontSize:'1.2rem'}}>pts</span>
          </div>

          <div className="info-user">
            <span className="name-user">{list3Best[1]?.nombre}</span>
            {/* <div>{list3Best[1].institucion}</div> */}
          </div>
          </>
            
            )
        }
        </div>
        <div className="first-place">
        <div className="label-position-first"><strong>1</strong></div>
        <img

            src={list3Best[0]?.foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user img-user-first"
          />

          <div className="puntos">
            <span>{list3Best[0]?.puntos}</span><span style={{fontSize:'1.2rem'}}>pts</span>
          </div>

          <div className="info-user">
            <span className="name-user">{list3Best[0]?.nombre}</span>
            {/* <div>{list3Best[2].institucion}</div> */}
          </div>
        </div>
        <div className="third-place">
        {
              list3Best.length > 2 && (

                <>
        <div className="label-position-third"><strong>3</strong></div>
        <img

            src={list3Best[2]?.foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user img-user-third"
          />

          <div className="puntos">
            <span>{list3Best[2]?.puntos}</span><span style={{fontSize:'1.2rem'}}>pts</span>
          </div>

          <div className="info-user">
            <span className="name-user">{list3Best[2]?.nombre}</span>
            {/* <div>{list3Best[0].institucion}</div> */}
          </div>
          </>
              
              )
            }
        </div>
      </>
      )
      }
       
      </div>
    </div>
  );
};

export default ThreePositionsGlobal;
