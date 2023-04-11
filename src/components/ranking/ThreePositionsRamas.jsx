import React from "react";
import SvgComponentUserDefaultFirst from "./SvgComponentUserDefaultFirst";
import SvgComponentUserDefaultSecond from "./SvgComponentUserDefaultSecond";
import SvgComponentUserDefaultThird from "./SvgComponentUserDefaultThird";
import "./ThreePositions.css";

const ThreePositionsRamas = ({ list3BestRamas }) => {
  return (
    <div className="center">
      <div className="top-position-container">
      {list3BestRamas.length > 0 && (
      <>
       <div className="second-place">
       {
            list3BestRamas.length > 1 && (
              <>
          <div className="label-position-second"><strong>2</strong></div>
          {
              list3BestRamas[1]?.foto !== 'default'?
              (
          <img
            src={list3BestRamas[1]?.foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user img-user-second"
          />
              ):
              (
                <SvgComponentUserDefaultSecond />
              )
              }    
          <div className="puntos">
            <span>{list3BestRamas[1]?.puntos}</span><span style={{fontSize:'1.2rem'}}> pts</span>
          </div>

          <div className="info-user">
            <span className="name-user">{list3BestRamas[1]?.nombre}</span>
          </div>
          </>
            
            )
        }
        </div>
        <div className="first-place">
        <div className="label-position-first"><strong>1</strong></div>
        {
              list3BestRamas[0]?.foto !== 'default'?
              (
        <img
            src={list3BestRamas[0]?.foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user img-user-first"
          />
              ):
              (
                <SvgComponentUserDefaultFirst />
              )
              }
          <div className="puntos">
            <span>{list3BestRamas[0]?.puntos}</span><span style={{fontSize:'1.2rem'}}> pts</span>
          </div>

          <div className="info-user">
            <span className="name-user">{list3BestRamas[0]?.nombre}</span>
          </div>
        </div>
        <div className="third-place">
        {
              list3BestRamas.length > 2 && (
                <>
        <div className="label-position-third"><strong>3</strong></div>
        {
              list3BestRamas[2]?.foto !== 'default'?
              (
        <img
            src={list3BestRamas[2]?.foto}
            alt=""
            referrerPolicy="no-referrer"
            className="img-user img-user-third"
          />
              ):
              (
                <SvgComponentUserDefaultThird />
              )
              }
          <div className="puntos">
            <span>{list3BestRamas[2]?.puntos}</span><span style={{fontSize:'1.2rem'}}> pts</span>
          </div>

          <div className="info-user">
            <span className="name-user">{list3BestRamas[2]?.nombre}</span>
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

export default ThreePositionsRamas;
