import React from "react";

import "./ChildComponent.css";

const ChildComponent = ({ nombre, puntos, foto, institucion,index }) => {
  return (
    <div className="child-container">
      <div className="flex">
        <div className="item" style={{width:'30px',textAlign:'center',justifyContent:'center'}}>
          <strong>{index}</strong>
        </div>
        <div className="item">
          <img
            width="70px"
            heigth="70px"
            src={foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user"
          />

          <div className="info">
            <strong className="name text-dark">{nombre}</strong>
            <span>{institucion}</span>
          </div>
        </div>
        <div className="item">
          <span>{puntos}</span><span style={{fontSize:'1.2rem'}}>pts</span>
        </div>
      </div>
    </div>
  );
};

export default ChildComponent;
