import React from "react";

import "./ChildComponent.css";
import SvgComponentUserDefault from "./SvgComponentUserDefault";
const ChildComponent = ({ nombre, puntos, foto, institucion,index }) => {
  return (
    <div className="child-container">
      <div className="flex">
        <div className="index-and-img">
          <strong className="index-number">{index}</strong>
          <div>
            {foto !== 'default' ? (
              <img
                src={foto}
                alt=""
                referrerPolicy="no-referrer"
                className="img-user-list"
              />
            ) : (
              <SvgComponentUserDefault />
            )}
          </div>
        </div>
        <div className="img-and-info">
          <div className="info">
            <span className="name-user-list text-dark">{nombre}</span>
            <span className="puntos-user-list">{puntos} pts</span>
            {/* <span className="name-institucion">{institucion}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildComponent;
