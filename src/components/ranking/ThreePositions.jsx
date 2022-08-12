import React from "react";
import "./ThreePositions.css";
const ThreePositions = ({ list3Best }) => {
  return (
    <div className="center">
      <div className="top-position-container">
        <div className="second-place">
          <div className="label-position-second"><strong>2</strong></div>
          <img
            width="70px"
            heigth="70px"
            src={list3Best[1].foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user"
          />

          <div className="puntos">
            <span>{list3Best[1].puntos}</span><span style={{fontSize:'1.2rem'}}>pts</span>
          </div>

          <div className="name-institucion">
            <strong className="name text-dark">{list3Best[1].nombre}</strong>
            <div>{list3Best[1].institucion}</div>
          </div>
        </div>
        <div className="first-place">
        <div className="label-position-first"><strong>1</strong></div>
        <img
            width="90px"
            heigth="90px"
            src={list3Best[2].foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user"
          />

          <div className="puntos">
            <span>{list3Best[2].puntos}</span><span style={{fontSize:'1.2rem'}}>pts</span>
          </div>

          <div className="name-institucion">
            <strong className="name text-dark">{list3Best[2].nombre}</strong>
            <div>{list3Best[2].institucion}</div>
          </div>
        </div>
        <div className="third-place">
        <div className="label-position-third"><strong>3</strong></div>
        <img
            width="70px"
            heigth="70px"
            src={list3Best[0].foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user"
          />

          <div className="puntos">
            <span>{list3Best[0].puntos}</span><span style={{fontSize:'1.2rem'}}>pts</span>
          </div>

          <div className="name-institucion">
            <strong className="name text-dark">{list3Best[0].nombre}</strong>
            <div>{list3Best[0].institucion}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreePositions;
