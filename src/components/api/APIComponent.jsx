import React, { useEffect, useState } from 'react'
import "./APIComponent.css"
// import SwaggerUI from "swagger-ui-react"
// import "swagger-ui-react/swagger-ui.css"
import Footer from '../footer/Footer'
// import TopicsComponent from './TopicsComponent'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Accordion from './accordion'
import { dataStructure } from './dataStructure'
import { Introduccion } from './docs'

const APIComponent = () => {
  const location = useLocation()
  const [currentActive, setCurrentActive] = useState()
  // const [currentUrl, setCurrentUrl] = useState()
  return (
    <>
      <div className="apidocs">
        <div className='apihome__picture'>
          {/* <img src='nature-arbu.jpg' /> */}
        </div>
        <div className="apidocs__content">
          <div className="apidocs__sidebar">
            <div className="sticky">
              {
                dataStructure.map((accordion, index) => {
                  const { path, label, nav } = accordion
                  return (
                    <Accordion
                      key={index}
                      id={index}
                      currentActive={currentActive}
                      onClick={setCurrentActive}
                      type='sidebar'
                      itemName={{ path, label }}
                      itemContent={nav ? nav : null}
                    />
                  )
                })
              }

            </div>
          </div>
          <div className="apidocs__panel">
            {location.pathname === '/api' ? <Introduccion /> : <Outlet />}
          </div>
        </div>
      </div>
      <Footer />
    </>

    // <div className='apidocs'>
    //   {/* <h2>API</h2> */}
    //   {/* <TopicsComponent /> */}
    //   {/* <SwaggerUI url="https://api-arbu.herokuapp.com/api-docs" /> */}
    //   {/* <SwaggerUI url="https://api-arbu.herokuapp.com/swagger.json" /> */}
    //   {/* <SwaggerUI url="https://serviceapiarbu.onrender.com/swagger.json" /> */}
    //   {/* <SwaggerUI url="http://localhost:4000/swagger.json" /> */}
    //   {/* <SwaggerUI url="http://localhost:4000/api-docs/" /> */}
    //   {/* <Footer /> */}
    // </div>
  );
}

export default APIComponent
